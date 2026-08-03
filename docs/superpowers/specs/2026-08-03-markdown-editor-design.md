# Editor Markdown Ber-toolbar untuk Blog Admin

Tanggal: 2026-08-03 · Status: disetujui

## Masalah

Form artikel admin (`src/app/admin/pages/BlogPostEditor.tsx`) memakai `Textarea` polos
untuk konten Markdown. User yang tidak paham Markdown kesulitan memformat tulisan.

## Solusi

Komponen reusable `MarkdownEditor` (`src/app/admin/components/MarkdownEditor.tsx`)
bergaya editor GitHub: user tetap menulis Markdown, tetapi toolbar menyisipkan
sintaks secara otomatis, dan tab Preview menampilkan hasil jadi.

### Toolbar

Tombol ikon (lucide-react) yang beroperasi pada seleksi/kursor textarea:

- Heading H2 (`## `) dan H3 (`### `) — mengganti prefix heading yang sudah ada di baris tsb.
- Bold (`**`), Italic (`*`), Strikethrough (`~~`) — membungkus seleksi; tanpa seleksi
  menyisipkan placeholder yang langsung terseleksi.
- Bullet list (`- `) dan numbered list (`1. `) — prefix per baris terpilih.
- Kutipan (`> `), inline code (`` ` ``), tautan (`[teks](url)`).
- Gambar — file picker → upload via `useUploadMedia` (endpoint media yang sudah ada) →
  sisipkan `![nama](url)` di posisi kursor. Tombol menampilkan spinner selama upload.
- Shortcut: Ctrl/Cmd+B (bold), Ctrl/Cmd+I (italic).

Setelah setiap operasi, fokus dan seleksi textarea dipulihkan.

### Tab Tulis / Preview

Preview merender `marked.parse` + `DOMPurify.sanitize` dengan kelas styling yang sama
seperti halaman publik `BlogDetail.tsx`, sehingga tampilan preview identik dengan hasil
akhir di situs.

### API Komponen

```tsx
<MarkdownEditor value={string} onChange={(v: string) => void} placeholder?={string} />
```

### Integrasi

`BlogPostEditor.tsx`: `Textarea` konten diganti `MarkdownEditor`. Tidak ada perubahan
payload/API backend — konten tetap string Markdown.

## Di Luar Cakupan

- WYSIWYG penuh (Tiptap/Milkdown).
- Perubahan field form lain atau tampilan blog publik.

---

# Lanjutan: Form Profil Organisasi (Misi & Sejarah)

Tanggal: 2026-08-03 · Status: disetujui

## Masalah

Halaman publik `About.tsx` memecah `mission`/`history`/`description` per baris:
tiap baris misi → kartu bernomor, tiap baris sejarah/deskripsi → paragraf.
Form admin (`OrgProfile.tsx`) hanya `Textarea` polos tanpa petunjuk, sehingga
user tidak tahu aturan "satu baris = satu poin/paragraf".

## Solusi (frontend saja — tanpa perubahan DB/API)

Format penyimpanan tetap string dengan satu poin per baris; yang berubah hanya UI admin.

- **Misi → list builder** (`ListEditor`, lokal di `OrgProfile.tsx`): tiap poin satu
  kolom input dengan badge nomor bergaya sama dengan kartu publik, tombol
  tambah/hapus/naik/turun. Saat simpan, item di-trim, yang kosong dibuang,
  digabung dengan `\n`.
- **Sejarah & Deskripsi → `ParagraphField`**: textarea + keterangan
  "Enter = paragraf baru" + preview pemisahan paragraf (muncul saat ≥ 2 paragraf).
- Saat memuat data lama, prefix bullet (`- `, `• `, `*`) dibersihkan mengikuti
  logika `splitLines` di halaman publik.

## Di Luar Cakupan

- Migrasi kolom DB ke JSON array (tidak diperlukan; format baris sudah jadi kontrak
  dengan halaman publik).

---

# Lanjutan: Timeline Sejarah Terstruktur (Tahun/Judul/Deskripsi)

Tanggal: 2026-08-03 · Status: disetujui

## Masalah

Timeline sejarah di halaman publik butuh tiga bagian per entri (tahun, judul,
deskripsi), tetapi kolom `history` hanya teks bebas — tidak bisa diparse dari
paragraf polos.

## Solusi (tanpa migrasi DB — JSON array disimpan di kolom teks yang ada)

- Helper `src/lib/org-history.ts`: `HistoryEntry { year, title, description }`,
  `parseHistoryTimeline` (null bila bukan JSON → berarti teks paragraf lama),
  `serializeHistoryTimeline` (buang entri kosong; string kosong bila tak ada entri).
- **Admin** (`OrgProfile.tsx`): field Sejarah → `TimelineEditor`, list builder
  dengan kolom Tahun + Judul + Deskripsi per entri, tombol tambah/hapus/naik/turun.
  Data paragraf lama dimuat sebagai entri berisi deskripsi saja (tinggal dilengkapi).
- **Publik** (`About.tsx`): urutan render Sejarah —
  1. JSON timeline → timeline dinamis (markup sama dengan timeline statis;
     tahun/judul/deskripsi yang kosong disembunyikan),
  2. teks paragraf lama → paragraf seperti sebelumnya,
  3. kosong → timeline statis bawaan.

## Trade-off

JSON di kolom teks dipilih karena backend tidak perlu memvalidasi/meng-query per
entri. Bila kebutuhan itu muncul, migrasi ke kolom JSON/tabel terpisah dilakukan
di repo backend.
