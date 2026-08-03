import { useState } from "react";
import { Images, Pencil, Plus, Trash2, X } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { DataTable, type Column } from "../components/DataTable";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { FieldLabel } from "../components/FieldLabel";
import { MediaPicker } from "../components/MediaPicker";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useGalleries, useGallery } from "../../../lib/api/hooks";
import { useAdminEvents } from "../../../lib/api/admin-hooks";
import {
  useAddGalleryItem,
  useCreateGallery,
  useDeleteGallery,
  useDeleteGalleryItem,
  useUpdateGallery,
} from "../../../lib/api/admin-hooks";
import type { Gallery } from "../../../lib/api/types";

const NONE = "__none__";

function ItemsManager({ galleryId }: { galleryId: string }) {
  const { data: detail, isLoading } = useGallery(galleryId);
  const addItem = useAddGalleryItem();
  const deleteItem = useDeleteGalleryItem();
  const items = detail?.items ?? [];

  return (
    <div className="space-y-3">
      <MediaPicker
        label="Tambah media"
        value={null}
        onChange={(media) => {
          if (media?.id)
            addItem.mutate({
              galleryId,
              payload: { media_id: media.id, sort_order: items.length },
            });
        }}
      />
      {isLoading ? (
        <p className="text-sm text-neutral-400">Memuat item…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-neutral-400">Belum ada media di album ini.</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {items.map((it) => (
            <div key={it.id} className="relative rounded-lg overflow-hidden border border-neutral-200">
              {it.media?.url ? (
                <img src={it.media.url} alt="" className="w-full h-20 object-cover" />
              ) : (
                <div className="w-full h-20 bg-neutral-100" />
              )}
              <button
                type="button"
                onClick={() => deleteItem.mutate({ galleryId, itemId: it.id })}
                className="absolute top-1 right-1 rounded-full bg-black/60 text-white p-0.5"
                aria-label="Hapus item"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AdminGalleries() {
  const { data: galleries = [], isLoading } = useGalleries({ limit: 100 });
  const { data: events = [] } = useAdminEvents({ limit: 200 });
  const createM = useCreateGallery();
  const updateM = useUpdateGallery();
  const deleteM = useDeleteGallery();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Gallery | null>(null);
  const [toDelete, setToDelete] = useState<Gallery | null>(null);
  const [managing, setManaging] = useState<Gallery | null>(null);
  const [form, setForm] = useState({ title: "", description: "", event_id: NONE, is_public: true });
  const set = (k: keyof typeof form, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", description: "", event_id: NONE, is_public: true });
    setOpen(true);
  };
  const openEdit = (g: Gallery) => {
    setEditing(g);
    setForm({
      title: g.title || "",
      description: g.description || "",
      event_id: g.eventId || NONE,
      is_public: g.isPublic,
    });
    setOpen(true);
  };

  const submit = async () => {
    const payload = {
      title: form.title,
      description: form.description || undefined,
      event_id: form.event_id === NONE ? undefined : form.event_id,
      is_public: form.is_public,
    };
    if (editing) await updateM.mutateAsync({ id: editing.id, payload });
    else await createM.mutateAsync(payload);
    setOpen(false);
  };

  const columns: Column<Gallery>[] = [
    { key: "title", header: "Album", cell: (g) => g.title || "—" },
    { key: "event", header: "Event", cell: (g) => g.eventTitle || "—" },
    {
      key: "isPublic",
      header: "Publik",
      cell: (g) =>
        g.isPublic ? (
          <Badge className="bg-emerald-500">Publik</Badge>
        ) : (
          <Badge variant="secondary">Privat</Badge>
        ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right w-32",
      cell: (g) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => setManaging(g)} title="Kelola media">
            <Images size={15} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => openEdit(g)}>
            <Pencil size={15} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setToDelete(g)}>
            <Trash2 size={15} className="text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Galeri"
        description="Album foto/video per event atau kategori"
        action={
          <Button onClick={openCreate}>
            <Plus size={16} /> Album Baru
          </Button>
        }
      />
      <DataTable columns={columns} rows={galleries} isLoading={isLoading} rowKey={(g) => g.id} />

      {/* Form album */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Album" : "Album Baru"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <FieldLabel required>Judul</FieldLabel>
              <Input value={form.title} onChange={(e) => set("title", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Deskripsi</FieldLabel>
              <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Event Terkait</FieldLabel>
              <Select value={form.event_id} onValueChange={(v) => set("event_id", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>— Tidak ada —</SelectItem>
                  {events.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label>Publik</Label>
              <Switch checked={form.is_public} onCheckedChange={(v) => set("is_public", v)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button onClick={submit} disabled={!form.title || createM.isPending || updateM.isPending}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Kelola media */}
      <Dialog open={!!managing} onOpenChange={(o) => !o && setManaging(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Kelola Media — {managing?.title}</DialogTitle>
          </DialogHeader>
          {managing && <ItemsManager galleryId={managing.id} />}
          <DialogFooter>
            <Button onClick={() => setManaging(null)}>Selesai</Button>
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
