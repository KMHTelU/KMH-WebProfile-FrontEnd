import { useMemo, useRef, useState } from "react";
import {
  FileUp,
  ImageUp,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { DataTable, type Column } from "../components/DataTable";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { ImportDialog } from "../components/ImportDialog";
import { BulkActionBar } from "../components/BulkActionBar";
import { FieldLabel } from "../components/FieldLabel";
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
  useAdminMembers,
  useAssignMemberDivision,
  useBulkUpdateMembers,
  useCreateMember,
  useDeleteMember,
  useMemberDivisions,
  useRemoveMemberDivision,
  useUpdateMember,
  useUploadMemberPhoto,
} from "../../../lib/api/admin-hooks";
import { useDivisions } from "../../../lib/api/hooks";
import type { Member } from "../../../lib/api/types";

const currentYear = new Date().getFullYear();

// Bagian pengelolaan divisi pada dialog edit anggota. Dibuat sesederhana
// mungkin untuk admin non-teknis: pilih divisi, isi jabatan, klik Tautkan.
function MemberDivisionsSection({ member }: { member: Member }) {
  const { data: assignments = [], isLoading } = useMemberDivisions(member.id);
  const { data: divisions = [] } = useDivisions();
  const assignM = useAssignMemberDivision();
  const removeM = useRemoveMemberDivision();

  const [divisionId, setDivisionId] = useState("");
  const [roleTitle, setRoleTitle] = useState("");

  // Divisi yang sudah ditautkan tidak ditawarkan lagi agar tidak dobel.
  const assignedIds = new Set(assignments.map((a) => a.divisionId));
  const available = divisions.filter((d) => !assignedIds.has(d.id));

  const add = async () => {
    if (!divisionId) return;
    await assignM.mutateAsync({
      member_id: member.id,
      division_id: divisionId,
      role_title: roleTitle.trim() || undefined,
    });
    setDivisionId("");
    setRoleTitle("");
  };

  return (
    <div className="col-span-2 space-y-2 rounded-lg border border-neutral-200 p-3">
      <div>
        <Label>Divisi &amp; Jabatan</Label>
        <p className="text-xs text-neutral-500 mt-0.5">
          Tautkan anggota ini ke satu atau beberapa divisi. Jabatan bebas diisi,
          misalnya Ketua, Wakil, atau Staff.
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-neutral-400">Memuat divisi…</p>
      ) : assignments.length === 0 ? (
        <p className="text-sm text-neutral-400">
          Belum tergabung di divisi mana pun.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {assignments.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between gap-2 rounded-md bg-neutral-50 px-3 py-2"
            >
              <div className="min-w-0">
                <p className="text-sm text-neutral-800 truncate">
                  {a.divisionName || "Divisi tanpa nama"}
                </p>
                <p className="text-xs text-neutral-500">
                  {a.roleTitle || "Anggota"}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                title="Lepas dari divisi ini"
                disabled={removeM.isPending}
                onClick={() => removeM.mutate(a.id)}
              >
                <Trash2 size={14} className="text-red-500" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      {available.length > 0 ? (
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <Select value={divisionId} onValueChange={setDivisionId}>
            <SelectTrigger className="sm:flex-1">
              <SelectValue placeholder="Pilih divisi…" />
            </SelectTrigger>
            <SelectContent>
              {available.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name || "Divisi tanpa nama"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            className="sm:flex-1"
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
            placeholder="Jabatan (opsional), cth: Ketua"
          />
          <Button
            type="button"
            variant="outline"
            disabled={!divisionId || assignM.isPending}
            onClick={add}
          >
            <Plus size={15} /> Tautkan
          </Button>
        </div>
      ) : (
        assignments.length > 0 && (
          <p className="text-xs text-neutral-400">
            Semua divisi sudah ditautkan ke anggota ini.
          </p>
        )
      )}
    </div>
  );
}

export function AdminMembers() {
  const { data: members = [], isLoading } = useAdminMembers({ limit: 200 });
  const createM = useCreateMember();
  const updateM = useUpdateMember();
  const deleteM = useDeleteMember();
  const bulkUpdateM = useBulkUpdateMembers();
  const uploadPhoto = useUploadMemberPhoto();
  const fileRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [toDelete, setToDelete] = useState<Member | null>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [form, setForm] = useState({
    name: "",
    nim: "",
    bio: "",
    email: "",
    phone: "",
    instagram_url: "",
    period_start: currentYear,
    period_end: currentYear + 1,
    is_active: true,
  });

  const set = (k: keyof typeof form, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        (m.name ?? "").toLowerCase().includes(q) ||
        (m.nim ?? "").toLowerCase().includes(q) ||
        (m.email ?? "").toLowerCase().includes(q)
    );
  }, [members, search]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      nim: "",
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
      nim: m.nim || "",
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
      nim: form.nim,
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

  const bulkSetActive = async (isActive: boolean) => {
    await bulkUpdateM.mutateAsync(
      [...selected].map((id) => ({ id, is_active: isActive }))
    );
    setSelected(new Set());
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
    { key: "nim", header: "NIM", cell: (m) => m.nim || "—" },
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
        description={`Data pengurus & anggota KMH — ${members.length} orang`}
        action={
          <>
            <Button variant="outline" onClick={() => setImportOpen(true)}>
              <FileUp size={16} /> Import
            </Button>
            <Button onClick={openCreate}>
              <Plus size={16} /> Anggota Baru
            </Button>
          </>
        }
      />

      <div className="relative mb-3 max-w-xs">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama, NIM, atau email…"
          className="pl-9"
        />
      </div>

      <BulkActionBar count={selected.size} onClear={() => setSelected(new Set())}>
        <Button
          size="sm"
          variant="outline"
          className="border-amber-300 bg-white"
          disabled={bulkUpdateM.isPending}
          onClick={() => bulkSetActive(true)}
        >
          <UserCheck size={14} /> Aktifkan
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-amber-300 bg-white"
          disabled={bulkUpdateM.isPending}
          onClick={() => bulkSetActive(false)}
        >
          <UserX size={14} /> Nonaktifkan
        </Button>
      </BulkActionBar>

      <DataTable
        columns={columns}
        rows={filtered}
        isLoading={isLoading}
        rowKey={(m) => m.id}
        selectedIds={selected}
        onSelectionChange={setSelected}
      />

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
              <FieldLabel required>Nama</FieldLabel>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <FieldLabel required>NIM</FieldLabel>
              <Input value={form.nim} onChange={(e) => set("nim", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Email</FieldLabel>
              <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Telepon</FieldLabel>
              <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Instagram URL</FieldLabel>
              <Input value={form.instagram_url} onChange={(e) => set("instagram_url", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <FieldLabel required>Periode Mulai</FieldLabel>
              <Input
                type="number"
                value={form.period_start}
                onChange={(e) => set("period_start", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel required>Periode Selesai</FieldLabel>
              <Input
                type="number"
                value={form.period_end}
                onChange={(e) => set("period_end", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <FieldLabel>Bio</FieldLabel>
              <Textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} />
            </div>
            {editing ? (
              <MemberDivisionsSection member={editing} />
            ) : (
              <p className="col-span-2 text-xs text-neutral-500 rounded-lg bg-neutral-50 px-3 py-2">
                Setelah anggota disimpan, buka kembali lewat tombol edit untuk
                menautkannya ke divisi.
              </p>
            )}
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
              disabled={!form.name || !form.nim || createM.isPending || updateM.isPending}
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ImportDialog
        entity="members"
        entityLabel="Anggota"
        open={importOpen}
        onOpenChange={setImportOpen}
      />

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
