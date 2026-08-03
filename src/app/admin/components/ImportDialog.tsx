import { useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Loader2,
  UploadCloud,
  XCircle,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  useDownloadImportTemplate,
  useImportCommit,
  useImportPreview,
} from "../../../lib/api/admin-hooks";
import type { BulkReport, ImportEntity } from "../../../lib/api/types";

function ReportSummary({ report }: { report: BulkReport }) {
  const failures = report.results.filter((r) => r.status === "failed");
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-neutral-50 border border-neutral-200 py-2">
          <div className="text-lg font-semibold text-neutral-900">
            {report.total}
          </div>
          <div className="text-xs text-neutral-500">Total baris</div>
        </div>
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 py-2">
          <div className="text-lg font-semibold text-emerald-700">
            {report.succeeded}
          </div>
          <div className="text-xs text-emerald-600">Valid / sukses</div>
        </div>
        <div className="rounded-lg bg-red-50 border border-red-200 py-2">
          <div className="text-lg font-semibold text-red-700">
            {report.failed}
          </div>
          <div className="text-xs text-red-600">Gagal</div>
        </div>
      </div>

      {failures.length > 0 && (
        <div className="max-h-48 overflow-y-auto rounded-lg border border-red-100">
          <table className="w-full text-sm">
            <thead className="bg-red-50 text-red-700 sticky top-0">
              <tr>
                <th className="text-left px-3 py-1.5 font-medium w-20">Baris</th>
                <th className="text-left px-3 py-1.5 font-medium">Masalah</th>
              </tr>
            </thead>
            <tbody>
              {failures.map((f) => (
                <tr key={`${f.index}-${f.row}`} className="border-t border-red-50">
                  <td className="px-3 py-1.5 text-neutral-600">
                    {f.row || f.index + 1}
                  </td>
                  <td className="px-3 py-1.5 text-neutral-700">{f.error}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/**
 * Dialog import Excel/CSV tiga langkah: unduh template → pilih file &
 * pratinjau (dry-run, tidak menyimpan apa pun) → impor baris yang valid.
 */
export function ImportDialog({
  entity,
  entityLabel,
  open,
  onOpenChange,
}: {
  entity: ImportEntity;
  entityLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const template = useDownloadImportTemplate();
  const preview = useImportPreview();
  const commit = useImportCommit();
  const fileRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewReport, setPreviewReport] = useState<BulkReport | null>(null);
  const [finalReport, setFinalReport] = useState<BulkReport | null>(null);

  const reset = () => {
    setFile(null);
    setPreviewReport(null);
    setFinalReport(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleOpenChange = (o: boolean) => {
    if (!o) reset();
    onOpenChange(o);
  };

  const pickFile = (f: File | null) => {
    setFile(f);
    setPreviewReport(null);
    setFinalReport(null);
  };

  const runPreview = async () => {
    if (!file) return;
    try {
      setPreviewReport(await preview.mutateAsync({ entity, file }));
    } catch {
      // Toast error sudah ditangani hook-nya.
    }
  };

  const runImport = async () => {
    if (!file) return;
    try {
      setFinalReport(await commit.mutateAsync({ entity, file }));
    } catch {
      // Toast error sudah ditangani hook-nya.
    }
  };

  const busy = preview.isPending || commit.isPending;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import {entityLabel} dari Excel/CSV</DialogTitle>
          <DialogDescription>
            Unduh template, isi datanya, lalu unggah kembali. Maksimal 500
            baris, ukuran file 5 MB.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Langkah 1: template */}
          <div className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2.5">
            <div className="flex items-center gap-2.5 text-sm text-neutral-700">
              <FileSpreadsheet size={17} className="text-emerald-600" />
              Template {entityLabel}
            </div>
            <div className="flex gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={template.isPending}
                onClick={() => template.mutate({ entity, format: "xlsx" })}
              >
                <Download size={14} /> XLSX
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={template.isPending}
                onClick={() => template.mutate({ entity, format: "csv" })}
              >
                <Download size={14} /> CSV
              </Button>
            </div>
          </div>

          {/* Langkah 2: pilih file */}
          <div
            className="border-2 border-dashed border-neutral-200 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-amber-300 hover:bg-amber-50/40 transition-colors"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files?.[0];
              if (f) pickFile(f);
            }}
          >
            <UploadCloud size={26} className="text-neutral-400" />
            {file ? (
              <div className="text-sm text-neutral-800 font-medium">
                {file.name}{" "}
                <span className="text-neutral-400 font-normal">
                  ({(file.size / 1024).toFixed(0)} KB)
                </span>
              </div>
            ) : (
              <div className="text-sm text-neutral-500 text-center">
                Klik atau tarik file <b>.xlsx</b> / <b>.csv</b> ke sini
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.csv"
            className="hidden"
            onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
          />

          {/* Hasil preview / import */}
          {finalReport ? (
            <div className="space-y-3">
              <div
                className={`flex items-center gap-2 text-sm font-medium ${
                  finalReport.failed === 0
                    ? "text-emerald-700"
                    : finalReport.succeeded === 0
                      ? "text-red-700"
                      : "text-amber-700"
                }`}
              >
                {finalReport.failed === 0 ? (
                  <CheckCircle2 size={17} />
                ) : finalReport.succeeded === 0 ? (
                  <XCircle size={17} />
                ) : (
                  <AlertTriangle size={17} />
                )}
                Import selesai — {finalReport.succeeded} dari {finalReport.total}{" "}
                baris tersimpan.
              </div>
              <ReportSummary report={finalReport} />
            </div>
          ) : previewReport ? (
            <div className="space-y-3">
              <div className="text-sm font-medium text-neutral-700">
                Hasil pratinjau (belum ada data yang disimpan):
              </div>
              <ReportSummary report={previewReport} />
              {previewReport.failed > 0 && previewReport.succeeded > 0 && (
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  Baris yang gagal akan dilewati saat import. Perbaiki file lalu
                  unggah ulang bila ingin semua baris masuk.
                </p>
              )}
            </div>
          ) : null}
        </div>

        <DialogFooter>
          {finalReport ? (
            <Button onClick={() => handleOpenChange(false)}>Selesai</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Batal
              </Button>
              <Button
                variant="outline"
                onClick={runPreview}
                disabled={!file || busy}
              >
                {preview.isPending && (
                  <Loader2 size={15} className="animate-spin" />
                )}
                Pratinjau
              </Button>
              <Button
                onClick={runImport}
                disabled={
                  !file || busy || !previewReport || previewReport.succeeded === 0
                }
              >
                {commit.isPending && <Loader2 size={15} className="animate-spin" />}
                Impor {previewReport ? `${previewReport.succeeded} Baris` : ""}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
