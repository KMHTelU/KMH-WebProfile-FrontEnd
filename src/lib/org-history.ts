/**
 * Kolom `history` di profil organisasi bertipe teks bebas. Untuk timeline
 * terstruktur (tahun/judul/deskripsi) kita menyimpan JSON array di kolom itu.
 * Teks lama berupa paragraf tetap didukung: parse mengembalikan null dan
 * pemanggil jatuh ke render paragraf.
 */
export interface HistoryEntry {
  year: string;
  title: string;
  description: string;
}

/** Kembalikan array entri bila teks berupa JSON timeline, selain itu null. */
export function parseHistoryTimeline(
  text: string | null | undefined
): HistoryEntry[] | null {
  if (!text) return null;
  const trimmed = text.trim();
  if (!trimmed.startsWith("[")) return null;
  try {
    const parsed = JSON.parse(trimmed);
    if (!Array.isArray(parsed)) return null;
    return parsed.map((e) => ({
      year: e?.year != null ? String(e.year) : "",
      title: typeof e?.title === "string" ? e.title : "",
      description: typeof e?.description === "string" ? e.description : "",
    }));
  } catch {
    return null;
  }
}

/** Serialisasi entri ke string JSON; entri yang seluruh kolomnya kosong dibuang. */
export function serializeHistoryTimeline(entries: HistoryEntry[]): string {
  const cleaned = entries
    .map((e) => ({
      year: e.year.trim(),
      title: e.title.trim(),
      description: e.description.trim(),
    }))
    .filter((e) => e.year || e.title || e.description);
  return cleaned.length > 0 ? JSON.stringify(cleaned) : "";
}
