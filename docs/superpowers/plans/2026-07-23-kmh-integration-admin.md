# KMH Integration + Admin Dashboard — Implementation Plan

> **For agentic workers:** Implement task-by-task. Steps use checkbox (`- [ ]`) syntax.
> No unit-test harness exists in this repo; the verification cycle for each task is
> **type/build check** (`npm run build` for frontend, `go build ./...` for backend) plus
> a manual smoke note. Treat a green build as the passing gate.

**Goal:** Selesaikan integrasi API (axios + TanStack Query), bangun Admin Dashboard CRUD full-set, dan tambah halaman publik Blog, Contact/Join, About.

**Architecture:** Backend menambah endpoint upload media generik + org-profile publik. Frontend memakai lapisan `admin.ts`/`admin-hooks.ts` di atas `client.ts` (interceptor Bearer + refresh sudah ada). Admin di `/admin/*` dengan guard; publik memakai `content.ts` + fallback statis.

**Tech Stack:** React 18, Vite 6, react-router 7, TanStack Query 5, axios, Tailwind v4, shadcn/ui (Radix), react-hook-form + zod, dompurify, date-fns, motion.

## Global Constraints

- Semua request ke `/api/protected/*` wajib `Authorization: Bearer` (otomatis via interceptor).
- Envelope respons `{ status, message, data, error? }`; data dibaca via `apiRequest` (sudah unwrap + normalize).
- Payload write = snake_case sesuai kontrak. Tanggal RFC3339.
- Utamakan komponen `src/app/components/ui/*`. Mobile-first.
- Login entry disembunyikan via flag `SHOW_ADMIN_LOGIN_LINK=false` + `hidden`.
- Jangan hapus fallback statis publik.

---

## Phase 1 — Backend

### Task 1: Endpoint upload media generik + list + org-profile publik
**Files (Backend):**
- Modify: `internal/handlers/*_handler.go` (tambah `UploadMediaHandler`, `ListMediaHandler`, `GetOrganizationProfileList`/reuse)
- Modify: `routes/routes.go` (register `POST/GET /api/protected/media`, `GET /api/organization-profile`)
- Modify: service/repository seperlunya (reuse `UploadMediaService`)

- [ ] Baca `internal/services` media/upload + org-profile service & repo untuk sinyatur.
- [ ] Tambah `UploadMediaHandler` (multipart `file`) → return objek media `{ id, url, file_type, mime_type, file_name }`.
- [ ] Tambah `ListMediaHandler` bila query list media tersedia; jika tidak, skip (dokumentasikan).
- [ ] Tambah handler+route publik `GET /api/organization-profile` (first/list).
- [ ] `go build ./...` → exit 0.

## Phase 2 — Frontend API Layer

### Task 2: Tipe payload + endpoint admin
**Files:** Create `src/lib/api/admin.ts`; Modify `src/lib/api/types.ts` (payload yang kurang: banner form, gallery item, role, user update, media).
- [ ] Tambah fungsi: banners (create multipart, listAll, delete), divisions (create/update/delete/uploadIcon), members (create/update/delete/uploadPhoto), events (create/update/delete), blogPosts/categories/tags (CRUD), galleries (CRUD + addItem/deleteItem), orgProfile (create/update/uploadLogo), contactMessages (list/get/markRead/delete), users (CRUD), roles (CRUD), `uploadMedia(file)`.
- [ ] `npm run build` → exit 0.

### Task 3: Admin hooks (mutation + invalidation)
**Files:** Create `src/lib/api/admin-hooks.ts`; Modify `src/lib/api/hooks.ts` (queryKeys tambahan: users, roles, contactMessages, media).
- [ ] `useMutation` per aksi, `onSuccess` invalidate + `toast.success`, `onError` `toast.error(parseApiError().message)`.
- [ ] Query hooks list untuk admin (users, roles, contactMessages, blog cats/tags already exist).
- [ ] `npm run build` → exit 0.

## Phase 3 — Auth & Admin Shell

### Task 4: Login page + guard + config flag
**Files:** Create `src/app/pages/Login.tsx`, `src/app/admin/RequireAuth.tsx`; Modify `src/lib/config.ts` (`SHOW_ADMIN_LOGIN_LINK`), `src/app/routes.tsx`, `src/app/components/Navbar.tsx`.
- [ ] Form login (react-hook-form+zod) → `loginRequest` → `navigate('/admin')`.
- [ ] `RequireAuth` cek `isAuthenticated()`; else `Navigate to="/login"`.
- [ ] Navbar: link login `hidden` + flag.
- [ ] `npm run build` → exit 0.

### Task 5: Admin layout + dashboard overview
**Files:** Create `src/app/admin/AdminLayout.tsx`, `src/app/admin/AdminSidebar.tsx`, `src/app/admin/pages/Dashboard.tsx`; helper `src/app/admin/components/{DataTable,PageHeader,ConfirmDialog,MediaPicker,FormField}.tsx`.
- [ ] Sidebar nav ke semua modul + logout. Layout responsif (Sheet di mobile).
- [ ] Dashboard: statistik + tabel pesan kontak terbaru.
- [ ] `MediaPicker` (upload via `uploadMedia` / pilih list) reusable.
- [ ] `npm run build` → exit 0.

## Phase 4 — Admin CRUD Modules
Setiap task = satu modul, deliverable teruji via build + smoke.

### Task 6: Banners  → `src/app/admin/pages/Banners.tsx`
### Task 7: Divisions + Members  → `Divisions.tsx`, `Members.tsx`
### Task 8: Events  → `Events.tsx` (datetime-local↔RFC3339, cover via MediaPicker)
### Task 9: Blog (Posts/Categories/Tags)  → `BlogPosts.tsx`, `BlogPostEditor.tsx`, `BlogTaxonomy.tsx`
### Task 10: Galleries  → `Galleries.tsx` (+ items via MediaPicker)
### Task 11: Organization Profile  → `OrgProfile.tsx`
### Task 12: Contact Messages  → `ContactMessages.tsx`
### Task 13: Users + Roles  → `Users.tsx`, `Roles.tsx`
- [ ] Tiap modul: tabel list + Dialog/Sheet form (create/edit) + delete confirm + error field mapping.
- [ ] `npm run build` → exit 0 setelah tiap modul.

## Phase 5 — Public Pages

### Task 14: Blog publik
**Files:** Create `src/app/pages/Blog.tsx`, `src/app/pages/BlogDetail.tsx`; Modify `content.ts` (blog view + read-time), `routes.tsx`, `Navbar.tsx`, `Footer.tsx`.
- [ ] List (PUBLISHED, filter kategori/tag, search, pagination) + detail (dompurify render, related, share).
- [ ] `npm run build` → exit 0.

### Task 15: Contact/Join
**Files:** Create `src/app/pages/Contact.tsx`; Modify `routes.tsx`, link Join di Navbar/Home/DivisionDetail → `/contact`.
- [ ] Form kontak + bagian Join (field digabung ke message). Sukses → toast + reset.
- [ ] `npm run build` → exit 0.

### Task 16: About → Organization Profile
**Files:** Modify `src/app/pages/About.tsx`, `content.ts` (org-profile view + fallback).
- [ ] Tarik org-profile; fallback statis bila kosong.
- [ ] `npm run build` → exit 0.

## Phase 6 — Verifikasi akhir
- [ ] `go build ./...` (Backend) exit 0.
- [ ] `npm run build` (Frontend) exit 0, tanpa error TS.
- [ ] Smoke: login→dashboard→CRUD; Blog/Contact/About render (fallback saat DB kosong); banner hero fade-in mulus.

## Self-Review
- Spec coverage: media gap (Task 1), API axios/TanStack (Task 2-3), auth+hide login (Task 4), admin full-set (Task 5-13), Blog/Contact/About (Task 14-16). ✔
- Non-goals dihormati (no storage/audit/backup/analytics/CV upload).
- Nama fungsi konsisten: `uploadMedia`, `RequireAuth`, `MediaPicker`, `SHOW_ADMIN_LOGIN_LINK`.
