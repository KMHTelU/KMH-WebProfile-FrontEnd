import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { DataTable, type Column } from "../components/DataTable";
import { ConfirmDialog } from "../components/ConfirmDialog";
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
import {
  useAdminEvents,
  useCreateEvent,
  useDeleteEvent,
  useUpdateEvent,
} from "../../../lib/api/admin-hooks";
import type { EventItem, EventPayload } from "../../../lib/api/types";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// RFC3339 -> nilai input datetime-local (waktu lokal).
function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}
// datetime-local -> RFC3339 (ISO UTC, valid RFC3339).
function toRFC3339(local: string): string {
  if (!local) return "";
  const d = new Date(local);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString();
}

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  event_type: "internal",
  start_time: "",
  end_time: "",
  location: "",
  google_maps_url: "",
  registration_url: "",
  cover_media_id: "",
  cover_url: "",
  status: "upcoming",
  is_published: false,
};

export function AdminEvents() {
  const { data: events = [], isLoading } = useAdminEvents({ limit: 200 });
  const createM = useCreateEvent();
  const updateM = useUpdateEvent();
  const deleteM = useDeleteEvent();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [toDelete, setToDelete] = useState<EventItem | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [slugTouched, setSlugTouched] = useState(false);
  const set = (k: keyof typeof form, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setSlugTouched(false);
    setOpen(true);
  };
  const openEdit = (e: EventItem) => {
    setEditing(e);
    setForm({
      title: e.title || "",
      slug: e.slug || "",
      description: e.description || "",
      event_type: e.eventType || "internal",
      start_time: toLocalInput(e.startTime),
      end_time: toLocalInput(e.endTime),
      location: e.location || "",
      google_maps_url: e.googleMapsUrl || "",
      registration_url: e.registrationUrl || "",
      cover_media_id: e.cover?.id || "",
      cover_url: e.cover?.url || "",
      status: e.status || "upcoming",
      is_published: e.isPublished,
    });
    setSlugTouched(true);
    setOpen(true);
  };

  const submit = async () => {
    const payload: EventPayload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      description: form.description || undefined,
      event_type: form.event_type,
      start_time: toRFC3339(form.start_time),
      end_time: form.end_time ? toRFC3339(form.end_time) : undefined,
      location: form.location || undefined,
      google_maps_url: form.google_maps_url || undefined,
      registration_url: form.registration_url || undefined,
      cover_media_id: form.cover_media_id || undefined,
      status: form.status,
      is_published: form.is_published,
    };
    if (editing) await updateM.mutateAsync({ id: editing.id, payload });
    else await createM.mutateAsync(payload);
    setOpen(false);
  };

  const columns: Column<EventItem>[] = [
    { key: "title", header: "Judul", cell: (e) => e.title || "—" },
    {
      key: "start",
      header: "Mulai",
      cell: (e) =>
        e.startTime ? new Date(e.startTime).toLocaleDateString("id-ID") : "—",
    },
    { key: "status", header: "Status", cell: (e) => e.status || "—" },
    {
      key: "published",
      header: "Publik",
      cell: (e) =>
        e.isPublished ? (
          <Badge className="bg-emerald-500">Publish</Badge>
        ) : (
          <Badge variant="secondary">Draft</Badge>
        ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right w-24",
      cell: (e) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => openEdit(e)}>
            <Pencil size={15} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setToDelete(e)}>
            <Trash2 size={15} className="text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Events"
        description="Kelola acara & dokumentasinya"
        action={
          <Button onClick={openCreate}>
            <Plus size={16} /> Event Baru
          </Button>
        }
      />
      <DataTable columns={columns} rows={events} isLoading={isLoading} rowKey={(e) => e.id} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Event" : "Event Baru"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 col-span-2">
              <Label>Judul</Label>
              <Input
                value={form.title}
                onChange={(e) => {
                  set("title", e.target.value);
                  if (!slugTouched) set("slug", slugify(e.target.value));
                }}
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => {
                  set("slug", e.target.value);
                  setSlugTouched(true);
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tipe</Label>
              <Select value={form.event_type} onValueChange={(v) => set("event_type", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="external">Eksternal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="finished">Finished</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Waktu Mulai</Label>
              <Input
                type="datetime-local"
                value={form.start_time}
                onChange={(e) => set("start_time", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Waktu Selesai</Label>
              <Input
                type="datetime-local"
                value={form.end_time}
                onChange={(e) => set("end_time", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Lokasi</Label>
              <Input value={form.location} onChange={(e) => set("location", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Google Maps URL</Label>
              <Input value={form.google_maps_url} onChange={(e) => set("google_maps_url", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>URL Registrasi</Label>
              <Input value={form.registration_url} onChange={(e) => set("registration_url", e.target.value)} />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Deskripsi</Label>
              <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} />
            </div>
            <div className="col-span-2">
              <MediaPicker
                label="Cover"
                value={form.cover_url}
                onChange={(media) => {
                  set("cover_media_id", media?.id || "");
                  set("cover_url", media?.url || "");
                }}
              />
            </div>
            <div className="flex items-center justify-between col-span-2">
              <Label>Publikasikan</Label>
              <Switch checked={form.is_published} onCheckedChange={(v) => set("is_published", v)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={submit}
              disabled={!form.title || !form.start_time || createM.isPending || updateM.isPending}
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
