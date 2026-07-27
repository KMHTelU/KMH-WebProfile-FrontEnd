import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { API_BASE_URL } from "../config";
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  updateAccessToken,
} from "../auth/auth-store";
import { normalize } from "./normalize";

// Bentuk envelope standar backend KMH.
export interface ApiEnvelope<T> {
  status: string;
  message: string;
  data: T;
  error?: Record<string, string> | string | null;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: sisipkan Bearer token ──
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.set?.("Authorization", `Bearer ${token}`);
  }
  return config;
});

// ── Response interceptor: auto-refresh saat 401 ──
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  // Pakai instance polos supaya tidak memicu interceptor & rekursi.
  try {
    const resp = await axios.post<ApiEnvelope<{
      access_token: string;
      refresh_token?: string;
      expires_at?: string;
    }>>(`${API_BASE_URL}/refresh`, { refresh_token: refreshToken });
    const data = resp.data?.data;
    if (data?.access_token) {
      updateAccessToken(data.access_token, data.expires_at ?? null);
      return data.access_token;
    }
    return null;
  } catch {
    return null;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    const status = error.response?.status;
    const isRefreshCall = original?.url?.includes("/refresh");

    if (status === 401 && original && !original._retry && !isRefreshCall) {
      original._retry = true;
      if (!refreshPromise) refreshPromise = refreshAccessToken();
      const newToken = await refreshPromise;
      refreshPromise = null;

      if (newToken) {
        original.headers.set?.("Authorization", `Bearer ${newToken}`);
        return api(original);
      }
      // Refresh gagal -> logout.
      clearSession();
    }

    return Promise.reject(error);
  }
);

// ── Helper request yang mengembalikan data ter-normalisasi ──
export async function apiRequest<T>(
  config: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<ApiEnvelope<T>> = await api.request(config);
  return normalize<T>(response.data?.data);
}

export const apiGet = <T>(url: string, config?: AxiosRequestConfig) =>
  apiRequest<T>({ ...config, method: "GET", url });

export const apiPost = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  apiRequest<T>({ ...config, method: "POST", url, data });

export const apiPut = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  apiRequest<T>({ ...config, method: "PUT", url, data });

export const apiPatch = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  apiRequest<T>({ ...config, method: "PATCH", url, data });

export const apiDelete = <T>(url: string, config?: AxiosRequestConfig) =>
  apiRequest<T>({ ...config, method: "DELETE", url });

// ── Utilitas error untuk UI / form ──
export interface ParsedApiError {
  message: string;
  fields: Record<string, string>;
  status?: number;
}

export function parseApiError(error: unknown): ParsedApiError {
  if (axios.isAxiosError(error)) {
    const env = error.response?.data as ApiEnvelope<unknown> | undefined;
    const fields =
      env?.error && typeof env.error === "object"
        ? (env.error as Record<string, string>)
        : {};
    return {
      message: env?.message || error.message || "Terjadi kesalahan jaringan",
      fields,
      status: error.response?.status,
    };
  }
  return { message: "Terjadi kesalahan tak terduga", fields: {} };
}
