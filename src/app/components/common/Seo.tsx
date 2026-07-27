import { useEffect } from "react";

const SITE_NAME = "KMH Telkom University";
const SITE_URL = (import.meta.env.VITE_SITE_URL?.trim() || "").replace(/\/$/, "");
const DEFAULT_IMAGE = "/KMH.png";
const DEFAULT_DESCRIPTION =
  "Keluarga Mahasiswa Hindu (KMH) Telkom University — wadah mahasiswa Hindu di Tel-U untuk bertumbuh dalam spiritualitas, budaya, dan pengabdian.";

interface SeoProps {
  /** judul halaman tanpa nama situs; nama situs ditambahkan otomatis */
  title?: string;
  description?: string;
  /** URL absolut atau path relatif (mis. "/KMH.png") */
  image?: string;
  type?: "website" | "article";
  /** path kanonik; default = lokasi saat ini */
  path?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noIndex?: boolean;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

const JSONLD_ID = "kmh-jsonld-route";

/**
 * Mengelola tag <head> per-route secara client-side (title, description, canonical,
 * Open Graph, Twitter Card, dan JSON-LD opsional). Render null.
 *
 * Catatan: crawler sosial (WhatsApp/Facebook/Twitter) tidak menjalankan JS sehingga
 * hanya membaca meta statis di index.html. Meta dinamis ini terutama membantu Google
 * (yang me-render JS) dan judul tab browser.
 */
export function Seo({
  title,
  description,
  image,
  type = "website",
  path,
  jsonLd,
  noIndex,
}: SeoProps) {
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : "";
  useEffect(() => {
    const origin =
      SITE_URL || (typeof window !== "undefined" ? window.location.origin : "");
    const fullTitle = title
      ? `${title} — ${SITE_NAME}`
      : `${SITE_NAME} — Keluarga Mahasiswa Hindu`;
    const desc = description || DEFAULT_DESCRIPTION;
    const canonicalPath =
      path ?? (typeof window !== "undefined" ? window.location.pathname : "/");
    const url = origin + canonicalPath;
    const img = image
      ? image.startsWith("http")
        ? image
        : origin + image
      : origin + DEFAULT_IMAGE;

    document.title = fullTitle;
    upsertMeta("name", "description", desc);
    upsertMeta("name", "robots", noIndex ? "noindex, nofollow" : "index, follow");
    upsertLink("canonical", url);

    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", desc);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", img);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", desc);
    upsertMeta("name", "twitter:image", img);

    const existing = document.getElementById(JSONLD_ID);
    if (existing) existing.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = JSONLD_ID;
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, image, type, path, noIndex, jsonLdKey]);

  return null;
}
