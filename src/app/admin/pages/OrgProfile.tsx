import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ImageUp, Plus, Save, Trash2 } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { useOrganizationProfile } from "../../../lib/api/hooks";
import {
  useCreateOrgProfile,
  useUpdateOrgProfile,
  useUploadOrgProfileLogo,
} from "../../../lib/api/admin-hooks";
import { ORG_PROFILE_ID } from "../../../lib/config";
import type { OrganizationProfilePayload } from "../../../lib/api/types";
import {
  parseHistoryTimeline,
  serializeHistoryTimeline,
  type HistoryEntry,
} from "../../../lib/org-history";

const empty: OrganizationProfilePayload = {
  name: "",
  short_name: "",
  description: "",
  vision: "",
  mission: "",
  history: "",
  address: "",
  email: "",
  phone: "",
  instagram_url: "",
  youtube_url: "",
  website_url: "",
};

/** Pecah teks tersimpan menjadi item per baris (format yang sama dengan halaman publik). */
const toItems = (text: string | null | undefined): string[] =>
  (text || "")
    .split(/\r?\n+/)
    .map((s) => s.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);

/**
 * Editor daftar poin: tiap poin satu kolom sendiri, bisa tambah/hapus/urutkan.
 * Tersimpan sebagai teks dengan satu poin per baris — format yang dibaca
 * halaman publik (About) untuk render kartu bernomor.
 */
function ListEditor({
  items,
  onChange,
  addLabel,
  itemPlaceholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  addLabel: string;
  itemPlaceholder: string;
}) {
  const update = (i: number, v: string) =>
    onChange(items.map((item, idx) => (idx === i ? v : item)));
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {items.length === 0 && (
        <p className="text-sm text-neutral-400">Belum ada poin. Tambahkan di bawah.</p>
      )}
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 mt-1.5 text-amber-800"
            style={{ background: "linear-gradient(135deg, #fde68a, #fbbf24)", fontWeight: 700 }}
          >
            {i + 1}
          </div>
          <Textarea
            value={item}
            onChange={(e) => update(i, e.target.value)}
            placeholder={itemPlaceholder}
            className="min-h-9"
          />
          <div className="flex flex-col shrink-0">
            <button
              type="button"
              onClick={() => move(i, -1)}
              disabled={i === 0}
              aria-label="Naikkan"
              className="p-1 rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ArrowUp size={14} />
            </button>
            <button
              type="button"
              onClick={() => move(i, 1)}
              disabled={i === items.length - 1}
              aria-label="Turunkan"
              className="p-1 rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ArrowDown size={14} />
            </button>
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Hapus poin"
              className="p-1 rounded text-neutral-400 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, ""])}>
        <Plus size={14} /> {addLabel}
      </Button>
    </div>
  );
}

/**
 * Editor timeline sejarah: tiap entri punya Tahun, Judul, dan Deskripsi.
 * Tersimpan sebagai JSON array di kolom teks `history` — dirender halaman
 * publik sebagai timeline bernomor tahun.
 */
function TimelineEditor({
  entries,
  onChange,
}: {
  entries: HistoryEntry[];
  onChange: (entries: HistoryEntry[]) => void;
}) {
  const update = (i: number, patch: Partial<HistoryEntry>) =>
    onChange(entries.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));
  const remove = (i: number) => onChange(entries.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= entries.length) return;
    const next = [...entries];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {entries.length === 0 && (
        <p className="text-sm text-neutral-400">
          Belum ada entri. Jika dibiarkan kosong, halaman publik menampilkan timeline bawaan.
        </p>
      )}
      {entries.map((entry, i) => (
        <div key={i} className="rounded-lg border border-neutral-200 bg-neutral-50/50 p-3 space-y-2">
          <div className="flex items-start gap-2">
            <div
              className="w-7 h-7 rounded-full border-2 border-amber-400 bg-white flex items-center justify-center shrink-0 mt-1"
              style={{ boxShadow: "0 0 0 3px rgba(251,191,36,0.15)" }}
            >
              <div className="w-2 h-2 rounded-full bg-amber-400" />
            </div>
            <Input
              value={entry.year}
              onChange={(e) => update(i, { year: e.target.value })}
              placeholder="Tahun"
              className="w-24 shrink-0"
            />
            <Input
              value={entry.title}
              onChange={(e) => update(i, { title: e.target.value })}
              placeholder="Judul peristiwa"
            />
            <div className="flex shrink-0">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label="Naikkan"
                className="p-1.5 rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:pointer-events-none"
              >
                <ArrowUp size={14} />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === entries.length - 1}
                aria-label="Turunkan"
                className="p-1.5 rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:pointer-events-none"
              >
                <ArrowDown size={14} />
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="Hapus entri"
                className="p-1.5 rounded text-neutral-400 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <Textarea
            value={entry.description}
            onChange={(e) => update(i, { description: e.target.value })}
            placeholder="Deskripsi peristiwa…"
            className="min-h-16 ml-9 w-[calc(100%-2.25rem)]"
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...entries, { year: "", title: "", description: "" }])}
      >
        <Plus size={14} /> Tambah Entri Sejarah
      </Button>
    </div>
  );
}

/** Textarea paragraf + keterangan aturan render dan preview pemisahan paragraf. */
function ParagraphField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint: string;
}) {
  const paragraphs = toItems(value);
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-28"
        placeholder={"Paragraf pertama…\nParagraf kedua…"}
      />
      <p className="text-xs text-neutral-400">{hint}</p>
      {paragraphs.length > 1 && (
        <div className="rounded-lg bg-neutral-50 border border-neutral-100 px-3 py-2.5 space-y-2">
          <p className="text-[11px] uppercase tracking-wide text-neutral-400 font-medium">
            Preview — {paragraphs.length} paragraf
          </p>
          {paragraphs.map((p, i) => (
            <p key={i} className="text-xs text-neutral-600 leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export function AdminOrgProfile() {
  const id = ORG_PROFILE_ID;
  const { data: profile } = useOrganizationProfile(id);
  const createM = useCreateOrgProfile();
  const updateM = useUpdateOrgProfile();
  const uploadLogo = useUploadOrgProfileLogo();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<OrganizationProfilePayload>({ ...empty });
  const [missionItems, setMissionItems] = useState<string[]>([]);
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const set = (k: keyof OrganizationProfilePayload, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        short_name: profile.shortName || "",
        description: profile.description || "",
        vision: profile.vision || "",
        mission: profile.mission || "",
        history: profile.history || "",
        address: profile.address || "",
        email: profile.email || "",
        phone: profile.phone || "",
        instagram_url: profile.instagramUrl || "",
        youtube_url: profile.youtubeUrl || "",
        website_url: profile.websiteUrl || "",
      });
      setMissionItems(toItems(profile.mission));
      // Data lama berupa paragraf → jadikan entri deskripsi agar tinggal dilengkapi tahun/judul.
      setHistoryEntries(
        parseHistoryTimeline(profile.history) ??
          toItems(profile.history).map((p) => ({ year: "", title: "", description: p }))
      );
    }
  }, [profile]);

  const submit = async () => {
    const payload: OrganizationProfilePayload = {
      ...form,
      mission: missionItems.map((s) => s.trim()).filter(Boolean).join("\n"),
      history: serializeHistoryTimeline(historyEntries),
    };
    if (id) await updateM.mutateAsync({ id, payload });
    else await createM.mutateAsync(payload);
  };

  const field = (
    key: keyof OrganizationProfilePayload,
    label: string,
    textarea = false
  ) => (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {textarea ? (
        <Textarea value={form[key] || ""} onChange={(e) => set(key, e.target.value)} />
      ) : (
        <Input value={form[key] || ""} onChange={(e) => set(key, e.target.value)} />
      )}
    </div>
  );

  return (
    <div className="max-w-2xl">
      <PageHeader title="Profil Organisasi" description="Identitas & kontak resmi KMH" />

      {!id && (
        <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          Belum ada ID profil terkonfigurasi. Menyimpan akan <b>membuat</b> profil baru.
          Setelah dibuat, set <code>VITE_ORG_PROFILE_ID</code> dengan ID profil agar bisa
          diperbarui & mengunggah logo.
        </div>
      )}

      {id && (
        <div className="flex items-center gap-3 mb-6">
          {profile?.logo?.url ? (
            <img src={profile.logo.url} alt="logo" className="w-16 h-16 rounded-lg object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-neutral-200" />
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploadLogo.isPending}
            onClick={() => fileRef.current?.click()}
          >
            <ImageUp size={15} /> {uploadLogo.isPending ? "Mengunggah..." : "Ganti Logo"}
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadLogo.mutate({ id, file });
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {field("name", "Nama")}
        {field("short_name", "Nama Singkat")}
        <div className="sm:col-span-2">
          <ParagraphField
            label="Deskripsi"
            value={form.description || ""}
            onChange={(v) => set("description", v)}
            hint="Tekan Enter untuk paragraf baru — setiap baris ditampilkan sebagai paragraf terpisah di halaman Tentang."
          />
        </div>
        <div className="sm:col-span-2">{field("vision", "Visi", true)}</div>
        <div className="sm:col-span-2 space-y-1.5">
          <Label>Misi</Label>
          <p className="text-xs text-neutral-400 -mt-0.5">
            Setiap poin tampil sebagai kartu bernomor di halaman Tentang, sesuai urutan di sini.
          </p>
          <ListEditor
            items={missionItems}
            onChange={setMissionItems}
            addLabel="Tambah Poin Misi"
            itemPlaceholder="Tulis satu poin misi…"
          />
        </div>
        <div className="sm:col-span-2 space-y-1.5">
          <Label>Sejarah</Label>
          <p className="text-xs text-neutral-400 -mt-0.5">
            Setiap entri tampil sebagai satu titik timeline (tahun, judul, deskripsi) di
            halaman Tentang, sesuai urutan di sini.
          </p>
          <TimelineEditor entries={historyEntries} onChange={setHistoryEntries} />
        </div>
        <div className="sm:col-span-2">{field("address", "Alamat", true)}</div>
        {field("email", "Email")}
        {field("phone", "Telepon")}
        {field("instagram_url", "Instagram URL")}
        {field("youtube_url", "YouTube URL")}
        {field("website_url", "Website URL")}
      </div>

      <div className="mt-6">
        <Button
          onClick={submit}
          disabled={!form.name || !form.short_name || createM.isPending || updateM.isPending}
        >
          <Save size={16} /> Simpan
        </Button>
      </div>
    </div>
  );
}
