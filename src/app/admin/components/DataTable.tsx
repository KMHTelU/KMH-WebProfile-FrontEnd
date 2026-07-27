import type { ReactNode } from "react";
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
 * empty state, dan render sel kustom.
 */
export function DataTable<T>({
  columns,
  rows,
  isLoading,
  emptyText = "Belum ada data.",
  rowKey,
}: {
  columns: Column<T>[];
  rows: T[];
  isLoading?: boolean;
  emptyText?: string;
  rowKey: (row: T, index: number) => string;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-neutral-50">
            {columns.map((col) => (
              <TableHead key={col.key} className={col.className}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={`sk-${i}`}>
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
                colSpan={columns.length}
                className="text-center text-neutral-400 py-10"
              >
                {emptyText}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, i) => (
              <TableRow key={rowKey(row, i)}>
                {columns.map((col) => (
                  <TableCell key={col.key} className={col.className}>
                    {col.cell ? col.cell(row) : ((row as any)[col.key] ?? "—")}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
