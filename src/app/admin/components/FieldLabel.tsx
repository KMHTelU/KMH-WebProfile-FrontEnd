import type { ReactNode } from "react";
import { Label } from "../../components/ui/label";

/**
 * Label field form admin dengan penanda wajib/opsional:
 * wajib = asterisk merah, opsional = teks "(opsional)".
 */
export function FieldLabel({
  htmlFor,
  required = false,
  children,
}: {
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <Label htmlFor={htmlFor}>
      {children}
      {required ? (
        <span className="text-red-500 -ml-1.5" aria-label="wajib diisi">
          *
        </span>
      ) : (
        <span className="text-xs font-normal text-neutral-400 -ml-1">
          (opsional)
        </span>
      )}
    </Label>
  );
}
