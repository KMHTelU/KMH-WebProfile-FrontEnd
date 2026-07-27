import { useRef, useState } from "react";
import { ImageUp, Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { DataTable, type Column } from "../components/DataTable";
import { ConfirmDialog } from "../components/ConfirmDialog";
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
  useAdminMembers,
  useCreateMember,
  useDeleteMember,
  useUpdateMember,
  useUploadMemberPhoto,
} from "../../../lib/api/admin-hooks";
import type { Member } from "../../../lib/api/types";

const currentYear = new Date().getFullYear();

export function AdminMembers() {
  const { data: members = [], isLoading } = useAdminMembers({ limit: 200 });
  const createM = useCreateMember();
  const updateM = useUpdateMember();
  const deleteM = useDeleteMember();
  const uploadPhoto = useUploadMemberPhoto();
  const fileRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [toDelete, setToDelete] = useState<Member | null>(null);

  const [form, setForm] = useState({
    name: "",
    npm: "",
    bio: "",
    email: "",
    phone: "",
    instagram_url: "",
    period_start: currentYear,
    period_end: currentYear + 1,
    is_active: true,
  });

  const set = (k: keyof typeof form, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      npm: "",
      bio: "",
      email: "",
      phone: "",
      instagram_url: "",
      period_start: currentYear,
      period_end: currentYear + 1,
      is_active: true,
    });
    setOpen(true);
  };
  const openEdit = (m: Member) => {
    setEditing(m);
    setForm({
      name: m.name || "",
      npm: m.npm || "",
      bio: m.bio || "",
      email: m.email || "",
      phone: m.phone || "",
      instagram_url: m.instagramUrl || "",
      period_start: m.periodStart ?? currentYear,
      period_end: m.periodEnd ?? currentYear + 1,
      is_active: m.isActive,
    });
    setOpen(true);
  };

  const submit = async () => {
    const base = {
      name: form.name,
      npm: form.npm,
      bio: form.bio || undefined,
      email: form.email || undefined,
      phone: form.phone || undefined,
      instagram_url: form.instagram_url || undefined,
      period_start: Number(form.period_start),
      period_end: Number(form.period_end),
    };
    if (editing) {
      await updateM.mutateAsync({
        id: editing.id,
        payload: { ...base, is_active: form.is_active },
      });
    } else {
      await createM.mutateAsync(base);
    }
    setOpen(false);
  };

  const columns: Column<Member>[] = [
    {
      key: "name",
      header: "Nama",
      cell: (m) => (
        <div className="flex items-center gap-2">
          {m.photo?.url ? (
            <img src={m.photo.url} alt="" className="w-7 h-7 rounded-full object-cover" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-neutral-200" />
          )}
          {m.name || "—"}
        </div>
      ),
    },
    { key: "npm", header: "NPM", cell: (m) => m.npm || "—" },
    {
      key: "period",
      header: "Periode",
      cell: (m) => (m.periodStart ? `${m.periodStart}–${m.periodEnd ?? ""}` : "—"),
    },
    {
      key: "isActive",
      header: "Status",
      cell: (m) =>
        m.isActive ? (
          <Badge className="bg-emerald-500">Aktif</Badge>
        ) : (
          <Badge variant="secondary">Nonaktif</Badge>
        ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right w-24",
      cell: (m) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => openEdit(m)}>
            <Pencil size={15} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setToDelete(m)}>
            <Trash2 size={15} className="text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Anggota"
        description="Data pengurus & anggota KMH"
        action={
          <Button onClick={openCreate}>
            <Plus size={16} /> Anggota Baru
          </Button>
        }
      />
      <DataTable columns={columns} rows={members} isLoading={isLoading} rowKey={(m) => m.id} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Anggota" : "Anggota Baru"}</DialogTitle>
          </DialogHeader>

          {editing && (
            <div className="flex items-center gap-3 pb-2 border-b border-neutral-100">
              {editing.photo?.url ? (
                <img src={editing.photo.url} alt="" className="w-14 h-14 rounded-full object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-neutral-200" />
              )}
              <div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploadPhoto.isPending}
                  onClick={() => fileRef.current?.click()}
                >
                  <ImageUp size={15} /> {uploadPhoto.isPending ? "Mengunggah..." : "Ganti Foto"}
                </Button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && editing) uploadPhoto.mutate({ id: editing.id, file });
                  }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 col-span-2">
              <Label>Nama</Label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>NIM</Label>
              <Input value={form.npm} onChange={(e) => set("npm", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Telepon</Label>
              <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Instagram URL</Label>
              <Input value={form.instagram_url} onChange={(e) => set("instagram_url", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Periode Mulai</Label>
              <Input
                type="number"
                value={form.period_start}
                onChange={(e) => set("period_start", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Periode Selesai</Label>
              <Input
                type="number"
                value={form.period_end}
                onChange={(e) => set("period_end", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Bio</Label>
              <Textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} />
            </div>
            {editing && (
              <div className="flex items-center justify-between col-span-2">
                <Label>Aktif</Label>
                <Switch checked={form.is_active} onCheckedChange={(v) => set("is_active", v)} />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={submit}
              disabled={!form.name || !form.npm || createM.isPending || updateM.isPending}
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
