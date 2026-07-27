import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../lib/auth/useAuth";

/**
 * Pembungkus rute admin. Jika belum login, redirect ke /login
 * sambil menyimpan lokasi asal agar bisa kembali setelah login.
 */
export function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
