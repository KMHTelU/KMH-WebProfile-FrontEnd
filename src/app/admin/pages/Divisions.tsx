import { useRef, useState } from "react";
import { FileUp, ImageUp, Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { DataTable, type Column } from "../components/DataTable";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { ImportDialog } from "../components/ImportDialog";
import { FieldLabel } from "../components/FieldLabel";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";
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
import { useDivisions } from "../../../lib/api/hooks";
import {
  useAdminMembers,
  useCreateDivision,
  useDeleteDivision,
  useUpdateDivision,
  useUploadDivisionIcon,
} from "../../../lib/api/admin-hooks";
import type { Division, DivisionProgram } from "../../../lib/api/types";

const NONE = "__none__";
const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Textarea daftar: satu butir per baris.
const parseLines = (s: string) =>
  s.split("\n").map((line) => line.trim()).filter(Boolean);

// Textarea program: satu program per baris dengan format "Nama | Deskripsi".
const parsePrograms = (s: string): DivisionProgram[] =>
  parseLines(s)
    .map((line) => {
      const [name, ...rest] = line.split("|");
      return { name: name.trim(), description: rest.join("|").trim() };
    })
    .filter((p) => p.name);

const programsToText = (programs: DivisionProgram[]) =>
  programs
    .map((p) => (p.description ? `${p.name} | ${p.description}` : p.name))
    .join("\n");

export function AdminDivisions() {
  const { data: divisions = [], isLoading } = useDivisions();
  const { data: members = [] } = useAdminMembers({ limit: 200 });
  const createM = useCreateDivision();
  const updateM = useUpdateDivision();
  const deleteM = useDeleteDivision();
  const uploadIcon = useUploadDivisionIcon();
  const fileRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [editing, setEditing] = useState<Division | null>(null);
  const [toDelete, setToDelete] = useState<Division | null>(null);
  const emptyForm = {
    name: "",
    slug: "",
    subtitle: "",
    description: "",
    responsibilities: "",
    programs: "",
    coordinator_id: NONE,
    is_active: true,
  };
  const [form, setForm] = useState(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const set = (k: keyof typeof form, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setSlugTouched(false);
    setOpen(true);
  };
  const openEdit = (d: Division) => {
    setEditing(d);
    setForm({
      name: d.name || "",
      slug: d.slug || "",
      subtitle: d.subtitle || "",
      description: d.description || "",
      responsibilities: (d.responsibilities || []).join("\n"),
      programs: programsToText(d.programs || []),
      coordinator_id: d.coordinator?.id || NONE,
      is_active: d.isActive,
    });
    setSlugTouched(true);
    setOpen(true);
  };

  const submit = async () => {
    const base = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      subtitle: form.subtitle || undefined,
      description: form.description || undefined,
      responsibilities: parseLines(form.responsibilities),
      programs: parsePrograms(form.programs),
      coordinator_id: form.coordinator_id === NONE ? undefined : form.coordinator_id,
    };
    if (editing) {
      await updateM.mutateAsync({ id: editing.id, payload: { ...base, is_active: form.is_active } });
    } else {
      await createM.mutateAsync(base);
    }
    setOpen(false);
  };

  const columns: Column<Division>[] = [
    {
      key: "name",
      header: "Divisi",
      cell: (d) => (
        <div className="flex items-center gap-2">
          {d.icon?.url ? (
            <img src={d.icon.url} alt="" className="w-7 h-7 rounded object-cover" />
          ) : (
            <div className="w-7 h-7 rounded bg-neutral-200" />
          )}
          {d.name || "—"}
        </div>
      ),
    },
    { key: "slug", header: "Slug", cell: (d) => d.slug || "—" },
    { key: "coordinator", header: "Koordinator", cell: (d) => d.coordinator?.name || "—" },
    {
      key: "actions",
      header: "",
      className: "text-right w-24",
      cell: (d) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => openEdit(d)}>
            <Pencil size={15} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setToDelete(d)}>
            <Trash2 size={15} className="text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Divisi"
        description="Kelola divisi & koordinatornya"
        action={
          <>
            <Button variant="outline" onClick={() => setImportOpen(true)}>
              <FileUp size={16} /> Import
            </Button>
            <Button onClick={openCreate}>
              <Plus size={16} /> Divisi Baru
            </Button>
          </>
        }
      />
      <DataTable columns={columns} rows={divisions} isLoading={isLoading} rowKey={(d) => d.id} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Divisi" : "Divisi Baru"}</DialogTitle>
          </DialogHeader>

          {editing && (
            <div className="flex items-center gap-3 pb-2 border-b border-neutral-100">
              {editing.icon?.url ? (
                <img src={editing.icon.url} alt="" className="w-14 h-14 rounded object-cover" />
              ) : (
                <div className="w-14 h-14 rounded bg-neutral-200" />
              )}
              <div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploadIcon.isPending}
                  onClick={() => fileRef.current?.click()}
                >
                  <ImageUp size={15} /> {uploadIcon.isPending ? "Mengunggah..." : "Ganti Ikon"}
                </Button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && editing) uploadIcon.mutate({ id: editing.id, file });
                  }}
                />
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="space-y-1.5">
              <FieldLabel required>Nama</FieldLabel>
              <Input
                value={form.name}
                onChange={(e) => {
                  set("name", e.target.value);
                  if (!slugTouched) set("slug", slugify(e.target.value));
                }}
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Slug</FieldLabel>
              <Input
                value={form.slug}
                placeholder="otomatis dibuat dari nama"
                onChange={(e) => {
                  set("slug", e.target.value);
                  setSlugTouched(true);
                }}
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Subtitle</FieldLabel>
              <Input
                value={form.subtitle}
                placeholder="kalimat singkat untuk hero halaman divisi"
                onChange={(e) => set("subtitle", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Deskripsi</FieldLabel>
              <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Tanggung Jawab</FieldLabel>
              <Textarea
                value={form.responsibilities}
                placeholder={"Satu tanggung jawab per baris, misal:\nMengelola media sosial KMH\nMembuat konten publikasi kegiatan"}
                rows={4}
                onChange={(e) => set("responsibilities", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Program Kerja</FieldLabel>
              <Textarea
                value={form.programs}
                placeholder={"Satu program per baris dengan format Nama | Deskripsi, misal:\nKMH Podcast | Podcast bulanan seputar kegiatan KMH"}
                rows={4}
                onChange={(e) => set("programs", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Koordinator</FieldLabel>
              <Select value={form.coordinator_id} onValueChange={(v) => set("coordinator_id", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih koordinator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>— Tidak ada —</SelectItem>
                  {members.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {editing && (
              <div className="flex items-center justify-between">
                <Label>Aktif</Label>
                <Switch checked={form.is_active} onCheckedChange={(v) => set("is_active", v)} />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button onClick={submit} disabled={!form.name || createM.isPending || updateM.isPending}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ImportDialog
        entity="divisions"
        entityLabel="Divisi"
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
