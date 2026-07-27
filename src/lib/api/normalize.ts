// Backend KMH (Go + sqlc) mengembalikan sebagian besar row mentah, sehingga
// nilai yang nullable ter-serialisasi sebagai "null wrapper" ala database/sql:
//
//   sql.NullString -> { "String": "abc", "Valid": true }
//   sql.NullTime   -> { "Time": "2025-...", "Valid": true }
//   sql.NullBool   -> { "Bool": true, "Valid": true }
//   sql.NullInt64  -> { "Int64": 123, "Valid": true }
//   uuid.NullUUID  -> { "UUID": "...", "Valid": true }
//
// Normalizer ini menelusuri objek/array secara rekursif dan membuka wrapper
// tersebut menjadi nilai biasa (atau null bila Valid=false). Aman juga bila
// backend suatu saat langsung mengirim nilai bersih (idempoten).

const WRAPPER_VALUE_KEYS = [
  "String",
  "Time",
  "Bool",
  "Int64",
  "Int32",
  "Int16",
  "Float64",
  "UUID",
] as const;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function unwrapIfNullable(obj: Record<string, unknown>): unknown | undefined {
  const keys = Object.keys(obj);
  if (keys.length !== 2 || !("Valid" in obj)) return undefined;

  const valueKey = keys.find((k) => k !== "Valid");
  if (!valueKey || !WRAPPER_VALUE_KEYS.includes(valueKey as never)) {
    return undefined;
  }

  const valid = obj.Valid === true;
  if (!valid) return null;
  return normalize(obj[valueKey]);
}

export function normalize<T = unknown>(input: unknown): T {
  if (Array.isArray(input)) {
    return input.map((item) => normalize(item)) as unknown as T;
  }

  if (isPlainObject(input)) {
    const unwrapped = unwrapIfNullable(input);
    if (unwrapped !== undefined) return unwrapped as T;

    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      result[key] = normalize(value);
    }
    return result as T;
  }

  return input as T;
}
