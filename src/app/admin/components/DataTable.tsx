import type { ReactNode } from "react";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

export interface Column<T> {
  key: string;
  header: string;
  /** Render sel; jika kosong pakai (row as any)[key]. */
  cell?: (row: T) => ReactNode;
  className?: string;
}

/**
 * Tabel data generik untuk halaman admin: header, loading skeleton,
 * empty state, render sel kustom, dan (opsional) seleksi baris untuk
 * aksi bulk.
 */
export function DataTable<T>({
  columns,
  rows,
  isLoading,
  emptyText = "Belum ada data.",
  rowKey,
  selectedIds,
  onSelectionChange,
}: {
  columns: Column<T>[];
  rows: T[];
  isLoading?: boolean;
  emptyText?: string;
  rowKey: (row: T, index: number) => string;
  /** Isi kedua prop ini untuk mengaktifkan kolom checkbox seleksi. */
  selectedIds?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;
}) {
  const selectable = !!selectedIds && !!onSelectionChange;
  const allKeys = rows.map((r, i) => rowKey(r, i));
  const allSelected =
    selectable && rows.length > 0 && allKeys.every((k) => selectedIds!.has(k));

  const toggleAll = () => {
    if (!selectable) return;
    onSelectionChange!(allSelected ? new Set() : new Set(allKeys));
  };
  const toggleOne = (key: string) => {
    if (!selectable) return;
    const next = new Set(selectedIds);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onSelectionChange!(next);
  };

  const colSpan = columns.length + (selectable ? 1 : 0);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <Table>
        <TableHeader>
          <TableRow className="bg-neutral-50/80 hover:bg-neutral-50/80">
            {selectable && (
              <TableHead className="w-10 pl-4">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={toggleAll}
                  aria-label="Pilih semua"
                />
              </TableHead>
            )}
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={`text-[11px] font-semibold uppercase tracking-wider text-neutral-500 ${col.className ?? ""}`}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={`sk-${i}`}>
                {selectable && <TableCell className="pl-4" />}
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    <div className="h-4 w-full max-w-[160px] rounded bg-neutral-100 animate-pulse" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={colSpan}
                className="text-center text-neutral-400 py-10"
              >
                {emptyText}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, i) => {
              const key = rowKey(row, i);
              const checked = selectable && selectedIds!.has(key);
              return (
                <TableRow
                  key={key}
                  data-state={checked ? "selected" : undefined}
                  className={checked ? "bg-amber-50/50 hover:bg-amber-50/70" : undefined}
                >
                  {selectable && (
                    <TableCell className="pl-4">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleOne(key)}
                        aria-label="Pilih baris"
                      />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.cell ? col.cell(row) : ((row as any)[col.key] ?? "—")}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
