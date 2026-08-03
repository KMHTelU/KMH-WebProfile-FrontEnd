import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "../../components/ui/button";

/**
 * Bar aksi bulk yang muncul di atas tabel ketika ada baris terpilih.
 * Aksi spesifik entitas dioper lewat children (tombol-tombol).
 */
export function BulkActionBar({
  count,
  onClear,
  children,
}: {
  count: number;
  onClear: () => void;
  children: ReactNode;
}) {
  if (count === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 mb-3">
      <span className="text-sm font-medium text-amber-900">
        {count} dipilih
      </span>
      <div className="flex flex-wrap items-center gap-1.5 ml-1">{children}</div>
      <Button
        variant="ghost"
        size="sm"
        className="ml-auto text-amber-800 hover:bg-amber-100"
        onClick={onClear}
      >
        <X size={14} /> Batal pilih
      </Button>
    </div>
  );
}
