import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import {
  divisions as staticDivisions,
  events as staticEvents,
  galleryImages as staticGallery,
} from "../app/data/kmh-data";
import { ENABLE_STATIC_FALLBACK } from "./config";
import {
  useBanners,
  useDivisions,
  useEvents,
  useGalleries,
} from "./api/hooks";
import { getGallery } from "./api/endpoints";
import type { Banner, Division, EventItem, Gallery } from "./api/types";

// ── View models (bentuk yang dipakai halaman, kompatibel dengan kmh-data.ts) ──
export interface DivisionView {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  category: string;
  responsibilities: string[];
  programs: { name: string; description: string }[];
  image: string;
  members: { name: string; role: string; photo: string }[];
}

export interface EventView {
  id: string;
  name: string;
  year: number;
  status: "Upcoming" | "Completed";
  date: string;
  /** ISO 8601 untuk schema.org / <time> */
  startISO: string | null;
  endISO: string | null;
  location: string;
  description: string;
  divisionId: string;
  image: string;
  gallery: string[];
}

export interface GalleryImageView {
  id: string;
  src: string;
  event: string;
  year: number;
}

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1667133000547-36edda79f81d?w=800&h=600&fit=crop";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function mapEventStatus(s: string | null): "Upcoming" | "Completed" {
  if (!s) return "Upcoming";
  return ["finished", "completed", "past", "done"].includes(s.toLowerCase())
    ? "Completed"
    : "Upcoming";
}

// ── Adapters API -> View ──
export function divisionToView(d: Division): DivisionView {
  return {
    id: d.slug || d.id,
    name: d.name || "",
    shortDescription: d.description || "",
    description: d.description || "",
    category: "Internal Division",
    responsibilities: [],
    programs: [],
    image: d.icon?.url || FALLBACK_IMG,
    members: d.coordinator
      ? [
          {
            name: d.coordinator.name || "",
            role: "Koordinator",
            photo: d.coordinator.photo?.url || FALLBACK_IMG,
          },
        ]
      : [],
  };
}

export function eventToView(e: EventItem): EventView {
  return {
    id: e.slug || e.id,
    name: e.title || "",
    year: e.startTime ? new Date(e.startTime).getFullYear() : new Date().getFullYear(),
    status: mapEventStatus(e.status),
    date: formatDate(e.startTime),
    startISO: e.startTime,
    endISO: e.endTime,
    location: e.location || "",
    description: e.description || "",
    divisionId: "",
    image: e.cover?.url || FALLBACK_IMG,
    gallery: [],
  };
}

// ── Hooks konten (API + fallback statis) ──
function withFallback<T>(apiData: T[] | undefined, staticData: T[]): T[] {
  const hasApi = Array.isArray(apiData) && apiData.length > 0;
  if (hasApi) return apiData as T[];
  return ENABLE_STATIC_FALLBACK ? staticData : [];
}

export function useDivisionsView() {
  const query = useDivisions();
  const data = useMemo(
    () => withFallback(query.data?.map(divisionToView), staticDivisions as DivisionView[]),
    [query.data]
  );
  return { ...query, data };
}

export function useEventsView() {
  const query = useEvents({ limit: 100 });
  const data = useMemo(
    () => withFallback(query.data?.map(eventToView), staticEvents as unknown as EventView[]),
    [query.data]
  );
  return { ...query, data };
}

export function useBannersView() {
  const query = useBanners();
  const banners: Banner[] = query.data ?? [];
  const primary = banners[0] ?? null;
  return { ...query, banners, primary };
}

// Flatten semua album galeri publik menjadi daftar gambar (untuk grid galeri).
export function useGalleryView() {
  const galleriesQuery = useGalleries({ limit: 50 });
  const galleries: Gallery[] = (galleriesQuery.data ?? []).filter((g) => g.isPublic);

  const detailQueries = useQueries({
    queries: galleries.map((g) => ({
      queryKey: ["galleries", g.id, "detail"],
      queryFn: () => getGallery(g.id),
      staleTime: 60_000,
    })),
  });

  const apiImages: GalleryImageView[] = useMemo(() => {
    const out: GalleryImageView[] = [];
    detailQueries.forEach((q, idx) => {
      const g = galleries[idx];
      const year = g?.createdAt ? new Date(g.createdAt).getFullYear() : new Date().getFullYear();
      (q.data?.items ?? []).forEach((item) => {
        if (item.media?.url) {
          out.push({
            id: item.id,
            src: item.media.url,
            event: g?.title || "",
            year,
          });
        }
      });
    });
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(detailQueries.map((q) => q.dataUpdatedAt))]);

  const data = withFallback(apiImages, staticGallery as GalleryImageView[]);
  const isLoading =
    galleriesQuery.isLoading || detailQueries.some((q) => q.isLoading);

  return { data, isLoading };
}
