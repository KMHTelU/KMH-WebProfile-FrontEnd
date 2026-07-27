import { useRef, useState } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { DataTable, type Column } from "../components/DataTable";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  useAdminBanners,
  useCreateBanner,
  useDeleteBanner,
} from "../../../lib/api/admin-hooks";
import type { Banner } from "../../../lib/api/types";

function toRFC3339(local: string): string {
  if (!local) return "";
  const d = new Date(local);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString();
}

const emptyForm = {
  title: "",
  subtitle: "",
  cta_text: "",
  cta_url: "",
  is_active: true,
  start_date: "",
  end_date: "",
  alt_text: "",
  caption: "",
};

export function AdminBanners() {
  const { data: banners = [], isLoading } = useAdminBanners({ limit: 100 });
  const createM = useCreateBanner();
  const deleteM = useDeleteBanner();
  const fileRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Banner | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const set = (k: keyof typeof form, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const openCreate = () => {
    setForm({ ...emptyForm });
    setFile(null);
    setPreview(null);
    setOpen(true);
  };

  const submit = async () => {
    if (!file) return;
    await createM.mutateAsync({
      file,
      data: {
        title: form.title,
        subtitle: form.subtitle || undefined,
        cta_text: form.cta_text || undefined,
        cta_url: form.cta_url || undefined,
        is_active: form.is_active,
        start_date: toRFC3339(form.start_date),
        end_date: toRFC3339(form.end_date),
        alt_text: form.alt_text || undefined,
        caption: form.caption || undefined,
      },
    });
    setOpen(false);
  };

  const columns: Column<Banner>[] = [
    {
      key: "media",
      header: "Media",
      cell: (b) =>
        b.media?.url ? (
          <img src={b.media.url} alt="" className="w-16 h-9 rounded object-cover" />
        ) : (
          <div className="w-16 h-9 rounded bg-neutral-200" />
        ),
    },
    { key: "title", header: "Judul", cell: (b) => b.title || "—" },
    {
      key: "isActive",
      header: "Status",
      cell: (b) =>
        b.isActive ? (
          <Badge className="bg-emerald-500">Aktif</Badge>
        ) : (
          <Badge variant="secondary">Nonaktif</Badge>
        ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right w-16",
      cell: (b) => (
        <Button variant="ghost" size="icon" onClick={() => setToDelete(b)}>
          <Trash2 size={15} className="text-red-500" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Banner"
        description="Hero/banner halaman utama"
        action={
          <Button onClick={openCreate}>
            <Plus size={16} /> Banner Baru
          </Button>
        }
      />
      <DataTable columns={columns} rows={banners} isLoading={isLoading} rowKey={(b) => b.id} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Banner Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Media (gambar/video)</Label>
              <div
                className="border border-dashed border-neutral-300 rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:bg-neutral-50"
                onClick={() => fileRef.current?.click()}
              >
                {preview ? (
                  <img src={preview} alt="" className="w-24 h-14 rounded object-cover" />
                ) : (
                  <div className="w-24 h-14 rounded bg-neutral-100 flex items-center justify-center">
                    <Upload size={18} className="text-neutral-400" />
                  </div>
                )}
                <span className="text-sm text-neutral-500">
                  {file ? file.name : "Klik untuk pilih file"}
                </span>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*,video/mp4"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  setFile(f);
                  setPreview(f ? URL.createObjectURL(f) : null);
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Judul</Label>
              <Input value={form.title} onChange={(e) => set("title", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Subjudul</Label>
              <Input value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Teks CTA</Label>
                <Input value={form.cta_text} onChange={(e) => set("cta_text", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>URL CTA</Label>
                <Input value={form.cta_url} onChange={(e) => set("cta_url", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Mulai Tampil</Label>
                <Input
                  type="datetime-local"
                  value={form.start_date}
                  onChange={(e) => set("start_date", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Selesai Tampil</Label>
                <Input
                  type="datetime-local"
                  value={form.end_date}
                  onChange={(e) => set("end_date", e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Aktif</Label>
              <Switch checked={form.is_active} onCheckedChange={(v) => set("is_active", v)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={submit}
              disabled={!file || !form.title || !form.start_date || !form.end_date || createM.isPending}
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        loading={deleteM.isPending}
        onConfirm={async () => {
          if (toDelete) await deleteM.mutateAsync(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}
