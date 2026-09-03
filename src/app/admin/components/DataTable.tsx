import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Checkbox } from "../../components/ui/checkbox";
import { Button } from "../../components/ui/button";
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

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

/**
 * Tabel data generik untuk halaman admin: header, loading skeleton,
 * empty state, render sel kustom, seleksi baris untuk aksi bulk, dan
 * PAGINATION sisi klien — total data selalu terlihat dan navigasinya ringan.
 *
 * Catatan seleksi: checkbox header memilih semua baris di HALAMAN AKTIF;
 * pilihan dari halaman lain tetap dipertahankan.
 */
export function DataTable<T>({
  columns,
  rows,
  isLoading,
  emptyText = "Belum ada data.",
  rowKey,
  selectedIds,
  onSelectionChange,
  initialPageSize = 25,
}: {
  columns: Column<T>[];
  rows: T[];
  isLoading?: boolean;
  emptyText?: string;
  rowKey: (row: T, index: number) => string;
  /** Isi kedua prop ini untuk mengaktifkan kolom checkbox seleksi. */
  selectedIds?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;
  /** Jumlah baris per halaman awal (10/25/50/100). */
  initialPageSize?: number;
}) {
  const selectable = !!selectedIds && !!onSelectionChange;

  // ── Pagination ──
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Saat data menyusut (mis. karena pencarian), jangan terdampar di halaman
  // yang sudah tidak ada.
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const startIndex = (page - 1) * pageSize;
  const pagedRows = useMemo(
    () => rows.slice(startIndex, startIndex + pageSize),
    [rows, startIndex, pageSize]
  );

  // ── Seleksi (lingkup halaman aktif, pilihan halaman lain dipertahankan) ──
  const pageKeys = pagedRows.map((r, i) => rowKey(r, startIndex + i));
  const allPageSelected =
    selectable && pagedRows.length > 0 && pageKeys.every((k) => selectedIds!.has(k));

  const toggleAll = () => {
    if (!selectable) return;
    const next = new Set(selectedIds);
    if (allPageSelected) pageKeys.forEach((k) => next.delete(k));
    else pageKeys.forEach((k) => next.add(k));
    onSelectionChange!(next);
  };
  const toggleOne = (key: string) => {
    if (!selectable) return;
    const next = new Set(selectedIds);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onSelectionChange!(next);
  };

  const colSpan = columns.length + (selectable ? 1 : 0);
  const rangeStart = total === 0 ? 0 : startIndex + 1;
  const rangeEnd = Math.min(startIndex + pageSize, total);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <Table>
        <TableHeader>
          <TableRow className="bg-neutral-50/80 hover:bg-neutral-50/80">
            {selectable && (
              <TableHead className="w-10 pl-4">
                <Checkbox
                  checked={allPageSelected}
                  onCheckedChange={toggleAll}
                  aria-label="Pilih semua di halaman ini"
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
          ) : total === 0 ? (
            <TableRow>
              <TableCell
                colSpan={colSpan}
                className="text-center text-neutral-400 py-10"
              >
                {emptyText}
              </TableCell>
            </TableRow>
          ) : (
            pagedRows.map((row, i) => {
              const key = rowKey(row, startIndex + i);
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

      {/* ── Footer pagination: total selalu terlihat ── */}
      {!isLoading && total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-2.5 border-t border-neutral-100 bg-neutral-50/50">
          <div className="text-xs text-neutral-500">
            Menampilkan <b>{rangeStart}–{rangeEnd}</b> dari <b>{total}</b> data
            {selectable && selectedIds!.size > 0 && (
              <span className="text-amber-700"> · {selectedIds!.size} dipilih</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs text-neutral-500">
              Per halaman
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="h-7 rounded-md border border-neutral-200 bg-white px-1.5 text-xs text-neutral-700 outline-none focus:border-amber-400"
              >
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>

            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={page === 1}
                  onClick={() => setPage(1)}
                  aria-label="Halaman pertama"
                >
                  <ChevronsLeft size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  aria-label="Halaman sebelumnya"
                >
                  <ChevronLeft size={14} />
                </Button>
                <span className="text-xs text-neutral-600 px-1.5 whitespace-nowrap">
                  Hal. <b>{page}</b> / {totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  aria-label="Halaman berikutnya"
                >
                  <ChevronRight size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={page === totalPages}
                  onClick={() => setPage(totalPages)}
                  aria-label="Halaman terakhir"
                >
                  <ChevronsRight size={14} />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
