import { AUTH_STORAGE_KEY } from "../config";

export interface AuthUserRole {
  id: string;
  name: string;
  description?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role_id?: string;
  role?: AuthUserRole;
  is_active?: boolean;
  last_login_at?: string | null;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: string | null;
  user: AuthUser | null;
}

// Store token sederhana berbasis localStorage + pub/sub agar bisa dipakai
// dengan useSyncExternalStore di React.
let session: AuthSession | null = readFromStorage();
const listeners = new Set<() => void>();

function readFromStorage(): AuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

function emit() {
  for (const listener of listeners) listener();
}

export function getSession(): AuthSession | null {
  return session;
}

export function getAccessToken(): string | null {
  return session?.accessToken ?? null;
}

export function getRefreshToken(): string | null {
  return session?.refreshToken ?? null;
}

export function setSession(next: AuthSession | null) {
  session = next;
  try {
    if (next) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {
    // localStorage bisa gagal (mode privat) - abaikan, state in-memory tetap jalan.
  }
  emit();
}

export function updateAccessToken(accessToken: string, expiresAt: string | null) {
  if (!session) return;
  setSession({ ...session, accessToken, expiresAt });
}

export function clearSession() {
  setSession(null);
}

export function isAuthenticated(): boolean {
  return Boolean(session?.accessToken);
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // Sinkron antar-tab.
  const onStorage = (e: StorageEvent) => {
    if (e.key === AUTH_STORAGE_KEY) {
      session = readFromStorage();
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
