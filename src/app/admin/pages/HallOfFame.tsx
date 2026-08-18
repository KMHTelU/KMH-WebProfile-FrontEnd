import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { DataTable, type Column } from "../components/DataTable";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { FieldLabel } from "../components/FieldLabel";
import { MediaPicker } from "../components/MediaPicker";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  useCreateHofAchievement,
  useCreateHofGeneration,
  useCreateHofPerson,
  useCreateHofTimelineEvent,
  useDeleteHofAchievement,
  useDeleteHofGeneration,
  useDeleteHofPerson,
  useDeleteHofTimelineEvent,
  useHallOfFame,
  useUpdateHofAchievement,
  useUpdateHofGeneration,
  useUpdateHofPerson,
  useUpdateHofTimelineEvent,
} from "../../../lib/api/admin-hooks";
import type {
  HofAchievement,
  HofGeneration,
  HofPerson,
  HofTimelineEvent,
} from "../../../lib/api/types";

const CATEGORIES = [
  "Academic",
  "Competition",
  "Leadership",
  "Community Service",
  "Arts & Culture",
  "Technology",
  "Entrepreneurship",
  "Sports",
  "Other",
];

const currentYear = new Date().getFullYear();

// ── Form generasi ──

const emptyGenForm = {
  name: "",
  year_start: currentYear,
  year_end: currentYear + 1,
  description: "",
  milestones: "",
  accent: "#d4af37",
  sort_order: 0,
};

// ── Form tokoh ──

const emptyPersonForm = {
  name: "",
  role: "",
  study_program: "",
  biography: "",
  contributions: "",
  legacy: "",
  quote: "",
  fields: [] as string[],
  photo_media_id: "",
  photo_url: "",
  sort_order: 0,
};

// ── Form prestasi ──

const emptyAchForm = {
  title: "",
  category: "Competition",
  year: currentYear,
  organization: "",
  result: "",
  description: "",
};

// ── Form timeline ──

const emptyTlForm = {
  year_label: "",
  title: "",
  description: "",
  sort_order: 0,
};

export function AdminHallOfFame() {
  const { data: hall, isLoading } = useHallOfFame();

  const createGen = useCreateHofGeneration();
  const updateGen = useUpdateHofGeneration();
  const deleteGen = useDeleteHofGeneration();
  const createPerson = useCreateHofPerson();
  const updatePerson = useUpdateHofPerson();
  const deletePerson = useDeleteHofPerson();
  const createAch = useCreateHofAchievement();
  const updateAch = useUpdateHofAchievement();
  const deleteAch = useDeleteHofAchievement();
  const createTl = useCreateHofTimelineEvent();
  const updateTl = useUpdateHofTimelineEvent();
  const deleteTl = useDeleteHofTimelineEvent();

  const generations = hall?.generations ?? [];
  const people = hall?.people ?? [];
  const achievements = hall?.achievements ?? [];
  const timeline = useMemo(
    () => [...(hall?.timeline ?? [])].sort((a, b) => a.sortOrder - b.sortOrder),
    [hall?.timeline]
  );

  // ── State pilihan & dialog ──
  const [selectedGenId, setSelectedGenId] = useState<string | null>(null);
  const activeGen =
    generations.find((g) => g.id === selectedGenId) ?? generations[0] ?? null;

  const [genDialogOpen, setGenDialogOpen] = useState(false);
  const [editingGen, setEditingGen] = useState<HofGeneration | null>(null);
  const [genForm, setGenForm] = useState({ ...emptyGenForm });
  const [genToDelete, setGenToDelete] = useState<HofGeneration | null>(null);

  const [personDialogOpen, setPersonDialogOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<HofPerson | null>(null);
  const [personForm, setPersonForm] = useState({ ...emptyPersonForm });
  const [personToDelete, setPersonToDelete] = useState<HofPerson | null>(null);

  const [achEditing, setAchEditing] = useState<HofAchievement | "new" | null>(null);
  const [achForm, setAchForm] = useState({ ...emptyAchForm });
  const [achToDelete, setAchToDelete] = useState<HofAchievement | null>(null);

  const [tlDialogOpen, setTlDialogOpen] = useState(false);
  const [editingTl, setEditingTl] = useState<HofTimelineEvent | null>(null);
  const [tlForm, setTlForm] = useState({ ...emptyTlForm });
  const [tlToDelete, setTlToDelete] = useState<HofTimelineEvent | null>(null);

  const setG = (k: keyof typeof genForm, v: any) =>
    setGenForm((f) => ({ ...f, [k]: v }));
  const setP = (k: keyof typeof personForm, v: any) =>
    setPersonForm((f) => ({ ...f, [k]: v }));
  const setA = (k: keyof typeof achForm, v: any) =>
    setAchForm((f) => ({ ...f, [k]: v }));
  const setT = (k: keyof typeof tlForm, v: any) =>
    setTlForm((f) => ({ ...f, [k]: v }));

  // ── Generasi ──

  const openCreateGen = () => {
    setEditingGen(null);
    setGenForm({ ...emptyGenForm });
    setGenDialogOpen(true);
  };
  const openEditGen = (g: HofGeneration) => {
    setEditingGen(g);
    setGenForm({
      name: g.name,
      year_start: g.yearStart,
      year_end: g.yearEnd,
      description: g.description,
      milestones: g.milestones.join("\n"),
      accent: g.accent || "#d4af37",
      sort_order: g.sortOrder,
    });
    setGenDialogOpen(true);
  };
  const submitGen = async () => {
    const payload = {
      name: genForm.name,
      year_start: Number(genForm.year_start),
      year_end: Number(genForm.year_end),
      description: genForm.description || undefined,
      milestones: genForm.milestones
        .split("\n")
        .map((m) => m.trim())
        .filter(Boolean),
      accent: genForm.accent || undefined,
      sort_order: Number(genForm.sort_order) || 0,
    };
    if (editingGen) await updateGen.mutateAsync({ id: editingGen.id, payload });
    else await createGen.mutateAsync(payload);
    setGenDialogOpen(false);
  };

  // ── Tokoh ──

  const genPeople = useMemo(
    () =>
      people
        .filter((p) => p.generationId === activeGen?.id)
        .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)),
    [people, activeGen]
  );
  const achievementsOf = (personId: string) =>
    achievements.filter((a) => a.personId === personId);

  const openCreatePerson = () => {
    setEditingPerson(null);
    setPersonForm({ ...emptyPersonForm });
    setAchEditing(null);
    setPersonDialogOpen(true);
  };
  const openEditPerson = (p: HofPerson) => {
    setEditingPerson(p);
    setPersonForm({
      name: p.name,
      role: p.role,
      study_program: p.studyProgram,
      biography: p.biography,
      contributions: p.contributions,
      legacy: p.legacy,
      quote: p.quote,
      fields: [...p.fields],
      photo_media_id: p.photoMediaId ?? "",
      photo_url: p.photoUrl ?? "",
      sort_order: p.sortOrder,
    });
    setAchEditing(null);
    setPersonDialogOpen(true);
  };
  const submitPerson = async () => {
    if (!activeGen) return;
    const payload = {
      generation_id: editingPerson?.generationId ?? activeGen.id,
      name: personForm.name,
      role: personForm.role || undefined,
      study_program: personForm.study_program || undefined,
      biography: personForm.biography || undefined,
      contributions: personForm.contributions || undefined,
      legacy: personForm.legacy || undefined,
      quote: personForm.quote || undefined,
      fields: personForm.fields,
      photo_media_id: personForm.photo_media_id || undefined,
      sort_order: Number(personForm.sort_order) || 0,
    };
    if (editingPerson)
      await updatePerson.mutateAsync({ id: editingPerson.id, payload });
    else await createPerson.mutateAsync(payload);
    setPersonDialogOpen(false);
  };

  // ── Prestasi (di dalam dialog tokoh) ──

  const startAddAch = () => {
    setAchForm({ ...emptyAchForm });
    setAchEditing("new");
  };
  const startEditAch = (a: HofAchievement) => {
    setAchForm({
      title: a.title,
      category: a.category,
      year: a.year,
      organization: a.organization,
      result: a.result,
      description: a.description,
    });
    setAchEditing(a);
  };
  const submitAch = async () => {
    if (!editingPerson) return;
    const payload = {
      person_id: editingPerson.id,
      title: achForm.title,
      category: achForm.category,
      year: Number(achForm.year),
      organization: achForm.organization || undefined,
      result: achForm.result || undefined,
      description: achForm.description || undefined,
    };
    if (achEditing && achEditing !== "new")
      await updateAch.mutateAsync({ id: achEditing.id, payload });
    else await createAch.mutateAsync(payload);
    setAchEditing(null);
  };

  // ── Timeline ──

  const openCreateTl = () => {
    setEditingTl(null);
    setTlForm({ ...emptyTlForm });
    setTlDialogOpen(true);
  };
  const openEditTl = (t: HofTimelineEvent) => {
    setEditingTl(t);
    setTlForm({
      year_label: t.year,
      title: t.title,
      description: t.description,
      sort_order: t.sortOrder,
    });
    setTlDialogOpen(true);
  };
  const submitTl = async () => {
    const payload = {
      year_label: tlForm.year_label,
      title: tlForm.title,
      description: tlForm.description || undefined,
      sort_order: Number(tlForm.sort_order) || 0,
    };
    if (editingTl) await updateTl.mutateAsync({ id: editingTl.id, payload });
    else await createTl.mutateAsync(payload);
    setTlDialogOpen(false);
  };

  // ── Kolom tabel ──

  const personColumns: Column<HofPerson>[] = [
    {
      key: "name",
      header: "Nama",
      cell: (p) => (
        <div className="flex items-center gap-2">
          {p.photoUrl ? (
            <img src={p.photoUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-neutral-200" />
          )}
          {p.name || "—"}
        </div>
      ),
    },
    { key: "role", header: "Peran", cell: (p) => p.role || "—" },
    {
      key: "ach",
      header: "Prestasi",
      cell: (p) => <Badge variant="secondary">{achievementsOf(p.id).length}</Badge>,
    },
    {
      key: "actions",
      header: "",
      className: "text-right w-24",
      cell: (p) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => openEditPerson(p)}>
            <Pencil size={15} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setPersonToDelete(p)}>
            <Trash2 size={15} className="text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  const tlColumns: Column<HofTimelineEvent>[] = [
    { key: "year", header: "Tahun", cell: (t) => t.year || "—", className: "w-24" },
    { key: "title", header: "Peristiwa", cell: (t) => t.title || "—" },
    {
      key: "desc",
      header: "Deskripsi",
      cell: (t) => <span className="text-neutral-500 text-xs">{t.description || "—"}</span>,
    },
    {
      key: "actions",
      header: "",
      className: "text-right w-24",
      cell: (t) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => openEditTl(t)}>
            <Pencil size={15} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setTlToDelete(t)}>
            <Trash2 size={15} className="text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Hall of Fame"
        description="Arsip sejarah untuk museum 3D — generasi, tokoh, prestasi, dan timeline organisasi"
      />

      <Tabs defaultValue="generations">
        <TabsList className="mb-4">
          <TabsTrigger value="generations">Generasi &amp; Tokoh</TabsTrigger>
          <TabsTrigger value="timeline">Timeline Organisasi</TabsTrigger>
        </TabsList>

        {/* ══ TAB: GENERASI & TOKOH ══ */}
        <TabsContent value="generations" className="space-y-4">
          {/* Pilihan generasi */}
          <div className="flex flex-wrap items-center gap-2">
            {generations.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGenId(g.id)}
                className={`px-3.5 py-1.5 rounded-full text-sm border transition-colors ${
                  activeGen?.id === g.id
                    ? "border-amber-400 bg-amber-50 text-amber-900 font-medium"
                    : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                }`}
              >
                {g.name || g.yearStart}
              </button>
            ))}
            <Button variant="outline" size="sm" onClick={openCreateGen}>
              <Plus size={14} /> Generasi Baru
            </Button>
          </div>

          {activeGen ? (
            <>
              {/* Info generasi aktif */}
              <div className="rounded-xl border border-neutral-200 bg-white p-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full border border-neutral-200"
                      style={{ background: activeGen.accent || "#d4af37" }}
                      title="Warna aksen zona di museum"
                    />
                    <h3 className="font-semibold text-neutral-900">
                      {activeGen.name}{" "}
                      <span className="text-neutral-400 font-normal">
                        · {activeGen.yearStart}–{activeGen.yearEnd}
                      </span>
                    </h3>
                  </div>
                  {activeGen.description && (
                    <p className="text-sm text-neutral-500 mt-1">{activeGen.description}</p>
                  )}
                  {activeGen.milestones.length > 0 && (
                    <ul className="text-xs text-neutral-500 mt-2 list-disc ml-4 space-y-0.5">
                      {activeGen.milestones.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => openEditGen(activeGen)}>
                    <Pencil size={15} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setGenToDelete(activeGen)}>
                    <Trash2 size={15} className="text-red-500" />
                  </Button>
                </div>
              </div>

              {/* Tokoh dalam generasi */}
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-neutral-700">
                  Tokoh di {activeGen.name} — {genPeople.length} orang
                </h4>
                <Button size="sm" onClick={openCreatePerson}>
                  <Plus size={14} /> Tokoh Baru
                </Button>
              </div>
              <DataTable
                columns={personColumns}
                rows={genPeople}
                isLoading={isLoading}
                rowKey={(p) => p.id}
              />
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-neutral-300 p-10 text-center text-neutral-500">
              <p className="mb-3">Arsip masih kosong. Mulai dengan membuat generasi pertama.</p>
              <Button onClick={openCreateGen}>
                <Plus size={15} /> Buat Generasi Pertama
              </Button>
            </div>
          )}
        </TabsContent>

        {/* ══ TAB: TIMELINE ══ */}
        <TabsContent value="timeline" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-500">
              Perjalanan organisasi: pendirian, transisi penting, program besar, era berjalan.
            </p>
            <Button size="sm" onClick={openCreateTl}>
              <Plus size={14} /> Peristiwa Baru
            </Button>
          </div>
          <DataTable
            columns={tlColumns}
            rows={timeline}
            isLoading={isLoading}
            rowKey={(t) => t.id}
          />
        </TabsContent>
      </Tabs>

      {/* ══ Dialog generasi ══ */}
      <Dialog open={genDialogOpen} onOpenChange={setGenDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingGen ? "Edit Generasi" : "Generasi Baru"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 col-span-2">
              <FieldLabel required>Nama Generasi</FieldLabel>
              <Input
                placeholder="cth: GENERATION 2024"
                value={genForm.name}
                onChange={(e) => setG("name", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel required>Tahun Mulai</FieldLabel>
              <Input
                type="number"
                value={genForm.year_start}
                onChange={(e) => setG("year_start", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel required>Tahun Selesai</FieldLabel>
              <Input
                type="number"
                value={genForm.year_end}
                onChange={(e) => setG("year_end", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <FieldLabel>Deskripsi Era</FieldLabel>
              <Textarea
                placeholder="Konteks zaman, arah kepengurusan, fokus program…"
                value={genForm.description}
                onChange={(e) => setG("description", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <FieldLabel>Milestones (satu per baris)</FieldLabel>
              <Textarea
                placeholder={"Regenerasi kepengurusan\nProgram unggulan baru"}
                value={genForm.milestones}
                onChange={(e) => setG("milestones", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Warna Aksen Zona</FieldLabel>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={genForm.accent}
                  onChange={(e) => setG("accent", e.target.value)}
                  className="w-9 h-9 rounded border border-neutral-200 cursor-pointer"
                />
                <Input
                  value={genForm.accent}
                  onChange={(e) => setG("accent", e.target.value)}
                  className="font-mono"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Urutan</FieldLabel>
              <Input
                type="number"
                value={genForm.sort_order}
                onChange={(e) => setG("sort_order", e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGenDialogOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={submitGen}
              disabled={
                !genForm.name || createGen.isPending || updateGen.isPending
              }
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══ Dialog tokoh ══ */}
      <Dialog open={personDialogOpen} onOpenChange={setPersonDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPerson ? "Edit Tokoh" : `Tokoh Baru — ${activeGen?.name ?? ""}`}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <MediaPicker
                label="Foto (tampil di potret museum)"
                value={personForm.photo_url}
                onChange={(media) => {
                  setP("photo_media_id", media?.id || "");
                  setP("photo_url", media?.url || "");
                }}
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <FieldLabel required>Nama</FieldLabel>
              <Input value={personForm.name} onChange={(e) => setP("name", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Peran / Jabatan</FieldLabel>
              <Input
                placeholder="cth: Ketua Umum"
                value={personForm.role}
                onChange={(e) => setP("role", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Program Studi</FieldLabel>
              <Input
                value={personForm.study_program}
                onChange={(e) => setP("study_program", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <FieldLabel>Bidang</FieldLabel>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((c) => {
                  const on = personForm.fields.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() =>
                        setP(
                          "fields",
                          on
                            ? personForm.fields.filter((f) => f !== c)
                            : [...personForm.fields, c]
                        )
                      }
                      className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                        on
                          ? "border-amber-400 bg-amber-50 text-amber-900"
                          : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="space-y-1.5 col-span-2">
              <FieldLabel>Biografi Singkat</FieldLabel>
              <Textarea
                value={personForm.biography}
                onChange={(e) => setP("biography", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <FieldLabel>Kontribusi untuk KMH</FieldLabel>
              <Textarea
                value={personForm.contributions}
                onChange={(e) => setP("contributions", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <FieldLabel>Legacy (pengaruh ke generasi berikutnya)</FieldLabel>
              <Textarea
                value={personForm.legacy}
                onChange={(e) => setP("legacy", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <FieldLabel>Kutipan</FieldLabel>
              <Textarea
                placeholder="HANYA kutipan asli yang terverifikasi — kosongkan bila tidak ada"
                value={personForm.quote}
                onChange={(e) => setP("quote", e.target.value)}
              />
              <p className="text-xs text-amber-600">
                Jangan mengarang kutipan. Bagian ini otomatis disembunyikan di museum
                bila kosong.
              </p>
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Urutan</FieldLabel>
              <Input
                type="number"
                value={personForm.sort_order}
                onChange={(e) => setP("sort_order", e.target.value)}
              />
            </div>
          </div>

          {/* ── Prestasi tokoh (hanya saat edit) ── */}
          {editingPerson ? (
            <div className="space-y-2 rounded-lg border border-neutral-200 p-3">
              <div className="flex items-center justify-between">
                <FieldLabel>Prestasi</FieldLabel>
                {achEditing === null && (
                  <Button type="button" variant="outline" size="sm" onClick={startAddAch}>
                    <Plus size={13} /> Tambah
                  </Button>
                )}
              </div>

              <ul className="space-y-1.5">
                {achievementsOf(editingPerson.id).map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between gap-2 rounded-md bg-neutral-50 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-neutral-800 truncate">{a.title}</p>
                      <p className="text-xs text-neutral-500">
                        {a.year} · {a.category}
                        {a.result ? ` · ${a.result}` : ""}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditAch(a)}
                      >
                        <Pencil size={13} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setAchToDelete(a)}
                      >
                        <Trash2 size={13} className="text-red-500" />
                      </Button>
                    </div>
                  </li>
                ))}
                {achievementsOf(editingPerson.id).length === 0 && (
                  <li className="text-sm text-neutral-400">Belum ada prestasi tercatat.</li>
                )}
              </ul>

              {achEditing !== null && (
                <div className="grid grid-cols-2 gap-2 rounded-md border border-amber-200 bg-amber-50/40 p-3">
                  <div className="space-y-1 col-span-2">
                    <FieldLabel required>Judul Prestasi</FieldLabel>
                    <Input
                      value={achForm.title}
                      onChange={(e) => setA("title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <FieldLabel>Kategori</FieldLabel>
                    <Select
                      value={achForm.category}
                      onValueChange={(v) => setA("category", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <FieldLabel required>Tahun</FieldLabel>
                    <Input
                      type="number"
                      value={achForm.year}
                      onChange={(e) => setA("year", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <FieldLabel>Penyelenggara</FieldLabel>
                    <Input
                      value={achForm.organization}
                      onChange={(e) => setA("organization", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <FieldLabel>Hasil</FieldLabel>
                    <Input
                      placeholder="cth: Juara 1 Nasional"
                      value={achForm.result}
                      onChange={(e) => setA("result", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <FieldLabel>Deskripsi / Konteks</FieldLabel>
                    <Textarea
                      value={achForm.description}
                      onChange={(e) => setA("description", e.target.value)}
                    />
                  </div>
                  <div className="col-span-2 flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setAchEditing(null)}
                    >
                      Batal
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      disabled={!achForm.title || createAch.isPending || updateAch.isPending}
                      onClick={submitAch}
                    >
                      Simpan Prestasi
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-neutral-500 rounded-lg bg-neutral-50 px-3 py-2">
              Simpan tokoh terlebih dahulu, lalu buka kembali lewat tombol edit untuk
              mencatat prestasinya.
            </p>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPersonDialogOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={submitPerson}
              disabled={!personForm.name || createPerson.isPending || updatePerson.isPending}
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══ Dialog timeline ══ */}
      <Dialog open={tlDialogOpen} onOpenChange={setTlDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTl ? "Edit Peristiwa" : "Peristiwa Baru"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <FieldLabel required>Tahun / Label</FieldLabel>
              <Input
                placeholder="cth: 2010 atau 2010–2012"
                value={tlForm.year_label}
                onChange={(e) => setT("year_label", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Urutan</FieldLabel>
              <Input
                type="number"
                value={tlForm.sort_order}
                onChange={(e) => setT("sort_order", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <FieldLabel required>Judul Peristiwa</FieldLabel>
              <Input
                placeholder="cth: Pendirian KMH"
                value={tlForm.title}
                onChange={(e) => setT("title", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <FieldLabel>Deskripsi</FieldLabel>
              <Textarea
                value={tlForm.description}
                onChange={(e) => setT("description", e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTlDialogOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={submitTl}
              disabled={
                !tlForm.year_label || !tlForm.title || createTl.isPending || updateTl.isPending
              }
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══ Konfirmasi hapus ══ */}
      <ConfirmDialog
        open={!!genToDelete}
        onOpenChange={(o) => !o && setGenToDelete(null)}
        loading={deleteGen.isPending}
        onConfirm={async () => {
          if (genToDelete) {
            await deleteGen.mutateAsync(genToDelete.id);
            if (selectedGenId === genToDelete.id) setSelectedGenId(null);
          }
          setGenToDelete(null);
        }}
      />
      <ConfirmDialog
        open={!!personToDelete}
        onOpenChange={(o) => !o && setPersonToDelete(null)}
        loading={deletePerson.isPending}
        onConfirm={async () => {
          if (personToDelete) await deletePerson.mutateAsync(personToDelete.id);
          setPersonToDelete(null);
        }}
      />
      <ConfirmDialog
        open={!!achToDelete}
        onOpenChange={(o) => !o && setAchToDelete(null)}
        loading={deleteAch.isPending}
        onConfirm={async () => {
          if (achToDelete) await deleteAch.mutateAsync(achToDelete.id);
          setAchToDelete(null);
        }}
      />
      <ConfirmDialog
        open={!!tlToDelete}
        onOpenChange={(o) => !o && setTlToDelete(null)}
        loading={deleteTl.isPending}
        onConfirm={async () => {
          if (tlToDelete) await deleteTl.mutateAsync(tlToDelete.id);
          setTlToDelete(null);
        }}
      />
    </div>
  );
}
