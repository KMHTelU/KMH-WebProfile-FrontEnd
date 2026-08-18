// Konfigurasi runtime yang dibaca dari environment variables (Vite).

export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL?.trim() || "/api";

export const ENABLE_STATIC_FALLBACK: boolean =
  (import.meta.env.VITE_ENABLE_STATIC_FALLBACK ?? "true").toLowerCase() !==
  "false";

// Kunci penyimpanan token di localStorage.
export const AUTH_STORAGE_KEY = "kmh.auth";

// ID Organization Profile untuk halaman About (backend hanya punya GET /:id).
// Kosongkan bila belum ada; About akan memakai konten statis sebagai fallback.
export const ORG_PROFILE_ID: string =
  import.meta.env.VITE_ORG_PROFILE_ID?.trim() || "";

// URL aplikasi Hall of Fame (museum 3D) — aplikasi terpisah, dibuka di tab
// baru. Default mengasumsikan deploy di subpath /hall-of-fame/ pada domain
// yang sama; untuk dev lokal set VITE_HALL_OF_FAME_URL=http://localhost:5173.
export const HALL_OF_FAME_URL: string =
  import.meta.env.VITE_HALL_OF_FAME_URL?.trim() || "/hall-of-fame/";

// Tampilkan entri "Login" admin di Navbar?
// Default false — sengaja disembunyikan (masih didiskusikan). Untuk memunculkan:
// set VITE_SHOW_ADMIN_LOGIN=true, atau hapus className "hidden" pada elemen
// bertanda data-admin-login di Navbar. Halaman /login tetap bisa diakses via URL.
export const SHOW_ADMIN_LOGIN_LINK: boolean =
  (import.meta.env.VITE_SHOW_ADMIN_LOGIN ?? "false").toLowerCase() === "true";
