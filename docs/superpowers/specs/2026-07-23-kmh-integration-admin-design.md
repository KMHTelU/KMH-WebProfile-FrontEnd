# KMH Tel-U — Integrasi Frontend + Admin Dashboard (Design Spec)

**Tanggal:** 2026-07-23
**Status:** Disetujui (brainstorming)

## 1. Tujuan

Menyelesaikan integrasi modul Frontend (React + Vite) dengan modul Backend
(Go + Fiber v3 + sqlc) memakai **axios + TanStack Query**, membangun **Admin
Dashboard** untuk CRUD seluruh konten, serta menambah halaman publik **Blog**,
**Contact/Join**, dan mengintegrasikan **About** ke Organization Profile API.

## 2. Kondisi Saat Ini (sudah ada)

- Lapisan API dasar: `src/lib/api/{client,endpoints,hooks,types,mappers,normalize}.ts`,
  `src/lib/auth/{auth-store,useAuth}.ts`, `src/lib/query-client.ts`, `src/lib/config.ts`.
- `SmartImage` (placeholder + fade-in, anti "loading jelek") & `motion.tsx`
  (Reveal/BlurText/Aurora).
- Integrasi publik selesai: Home, Divisions(+detail), Events(+detail), Gallery
  memakai `content.ts` (hooks API + fallback data statis `kmh-data.ts`).
- Backend: CORS, endpoint publik `divisions`/`members`, route protected divisions.

## 3. Kontrak Backend (ringkas — sumber kebenaran)

- Envelope: `{ status, message, data, error? }`. `error` = map `{ Field: tag }` saat validasi 400.
- Auth: `Authorization: Bearer <access_token>`, dicek per-service. Refresh: `POST /api/refresh { refresh_token }`.
- Pagination: `?limit=N&start=OFFSET`.
- Waktu: RFC3339. Enum blog status: `DRAFT|PUBLISHED|ARCHIVED`. Event `event_type`: `internal|external`, `status`: `upcoming|ongoing|finished`.
- Upload multipart existing: banner (field `media` + `data.*`), member (`photo`), divisi (`icon`), org-profile (`logo`).
- **Gap:** tidak ada upload media generik untuk blog/event/gallery → ditutup di Bagian 4.

## 4. Perubahan Backend (non-breaking, compile-checked)

1. `POST /api/protected/media` — multipart field `file` → `UploadMediaService` → **return objek media** (minimal `id`, `url`, `file_type`, `mime_type`, `file_name`).
2. `GET /api/protected/media` — list media untuk picker (pakai query sqlc bila tersedia; kalau berisiko/absen, cukup upload-return + skip list).
3. `GET /api/organization-profile` — publik, kembalikan profil (list/first) agar About tidak butuh UUID.

Verifikasi: `go build ./...` (exit 0).

## 5. Lapisan API Frontend

- `src/lib/api/admin.ts` — fungsi CRUD protected (snake_case sesuai kontrak) untuk:
  banners, divisions, members, events, blog-posts/categories/tags, galleries(+items),
  organization-profile, contact-messages, users, roles, + `uploadMedia(file)`.
- `src/lib/api/admin-hooks.ts` — `useMutation` per aksi, `onSuccess` invalidate query terkait + `toast`.
- Banner create: multipart tunggal (`media` + `data.title/subtitle/cta_text/cta_url/is_active/start_date/end_date/alt_text/caption`).
- Pola upload 2-langkah: create/update record → `POST /:id/upload` gambar.
- Error form: map `parseApiError().fields` → set error field react-hook-form.

## 6. Auth & Login

- `/login`: shadcn form (email+password) → `loginRequest()` → redirect `/admin`.
- `<RequireAuth>` membungkus `/admin/*`; belum login → `Navigate to="/login"`.
- Entry login di Navbar: dibungkus flag `SHOW_ADMIN_LOGIN_LINK` (default `false`) + `className="hidden"` + `data-admin-login`, mudah dihapus/di-unhide. `/login` tetap bisa diakses via URL.

## 7. Admin Dashboard (`/admin/*`)

- Layout: sidebar (`ui/sidebar.tsx`) + topbar (nama user, logout). Responsif.
- Overview: kartu statistik (anggota, event mendatang, draft blog, pesan kontak belum dibaca) + tabel pesan kontak terbaru. (Storage/audit-log tidak ada di API → dihilangkan.)
- Modul CRUD (tabel + Dialog/Sheet form):
  - Banners (create multipart, list, delete)
  - Divisi (CRUD + upload icon; pilih coordinator dari members)
  - Anggota (CRUD + upload photo)
  - Events (CRUD; datetime-local→RFC3339; pilih cover via media picker)
  - Blog: Posts (**halaman penuh** `/admin/blog/new`,`/admin/blog/:id`; markdown editor + featured media picker + kategori + multi-tag), Kategori (CRUD), Tag (CRUD)
  - Galeri (CRUD + kelola items via media picker)
  - Organization Profile (create/update + upload logo)
  - Contact Messages (list, detail, mark-read, delete)
  - Users (CRUD, pilih role) & Roles (CRUD)
- Media picker reusable: upload (`uploadMedia`) atau pilih dari list.

## 8. Halaman Publik Baru

- **Blog** `/blog`: list hanya `PUBLISHED`, filter kategori/tag, search judul, pagination. Card: featured image (SmartImage), judul, excerpt, author, tanggal, estimasi baca.
- **Blog detail** `/blog/:slug`: judul, author, tanggal, estimasi baca, featured image, konten (Markdown→HTML tersanitasi via `dompurify`), related posts (kategori sama), tombol share.
- **Contact/Join** `/contact`: form kontak (name, email, subject, message) → `submitContactMessage`. Bagian **Join** memakai endpoint sama; field join (npm, semester, divisi pilihan) digabung ke `message` terstruktur. Catatan: CV upload tidak didukung backend → tidak disertakan (atau info alternatif kontak).
- **About**: `useOrganizationProfile` dari `GET /api/organization-profile` untuk visi/misi/sejarah/kontak, fallback ke konten statis bila kosong.
- Navbar & Footer: tambah link **Blog** & **Contact**.

## 9. Dependensi & Teknis

- Tambah: `zod`, `@hookform/resolvers` (validasi klien mirror backend), `dompurify` (+ `@types/dompurify`).
- `date-fns` (ada) untuk format/parsing tanggal.
- Utamakan komponen `src/app/components/ui/*` (shadcn).
- Breakpoint mobile-first; jaga aksesibilitas (label, alt, kontras).

## 10. Non-Goals (v1)

- Storage usage, audit trail, backup/restore, analytics/newsletter/iCal (tidak ada API).
- WYSIWYG penuh (pakai Markdown dulu). CV upload pada Join. 2FA.

## 11. Verifikasi

- `go build ./...` di Backend (exit 0).
- `npm run build` di Frontend (exit 0), tanpa error TypeScript.
- Smoke manual: login → dashboard → satu CRUD; halaman Blog/Contact/About render dengan fallback saat DB kosong.
