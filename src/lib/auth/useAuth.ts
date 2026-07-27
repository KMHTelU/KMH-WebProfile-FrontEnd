import { useSyncExternalStore } from "react";
import { apiPost } from "../api/client";
import type { LoginPayload } from "../api/types";
import {
  clearSession,
  getSession,
  setSession,
  subscribe,
  type AuthSession,
  type AuthUser,
} from "./auth-store";

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_at?: string;
  user?: AuthUser;
}

export async function loginRequest(payload: LoginPayload): Promise<AuthSession> {
  const data = await apiPost<LoginResponse>("/login", payload);
  const session: AuthSession = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: data.expires_at ?? null,
    user: data.user ?? null,
  };
  setSession(session);
  return session;
}

export function logout() {
  clearSession();
}

export function useAuth() {
  const session = useSyncExternalStore(subscribe, getSession, () => null);
  return {
    session,
    user: session?.user ?? null,
    isAuthenticated: Boolean(session?.accessToken),
    login: loginRequest,
    logout,
  };
}
