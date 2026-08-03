import type {
  AppUser,
  Banner,
  BlogCategory,
  BlogPost,
  BlogTag,
  ContactMessage,
  Division,
  EventItem,
  Gallery,
  GalleryDetail,
  GalleryItem,
  Media,
  Member,
  OrganizationProfile,
  Role,
} from "./types";

// Row sudah dinormalisasi (null-wrapper terbuka), jadi nilainya berupa
// string/number/boolean/null biasa. Helper di bawah untuk coercion aman.
type Row = Record<string, any>;

const str = (v: unknown): string | null =>
  v === null || v === undefined || v === "" ? null : String(v);
const bool = (v: unknown): boolean => v === true;
const num = (v: unknown): number | null => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};

function mapMedia(row: Row, idKey = "id_2"): Media | null {
  if (!row) return null;
  const url = str(row.url);
  const id = str(row[idKey]);
  if (!url && !id) return null;
  return {
    id,
    url,
    fileName: str(row.file_name),
    fileType: str(row.file_type),
    mimeType: str(row.mime_type),
    fileSize: num(row.file_size),
    altText: str(row.alt_text),
    caption: str(row.caption),
  };
}

export function mapBanner(row: Row): Banner {
  return {
    id: String(row.id),
    title: str(row.title),
    subtitle: str(row.subtitle),
    ctaText: str(row.cta_text),
    ctaUrl: str(row.cta_url),
    isActive: bool(row.is_active),
    startDate: str(row.start_date),
    endDate: str(row.end_date),
    media: mapMedia(row),
  };
}

export function mapEvent(row: Row): EventItem {
  const src = row?.event ?? row;
  return {
    id: String(src.id),
    title: str(src.title),
    slug: str(src.slug),
    description: str(src.description),
    eventType: str(src.event_type),
    startTime: str(src.start_time),
    endTime: str(src.end_time),
    location: str(src.location),
    googleMapsUrl: str(src.google_maps_url),
    registrationUrl: str(src.registration_url),
    status: str(src.status),
    isPublished: bool(src.is_published),
    cover: mapMedia(src),
  };
}

export function mapMember(row: Row): Member {
  return {
    id: String(row.id),
    name: str(row.name),
    nim: str(row.nim ?? row.npm),
    bio: str(row.bio),
    email: str(row.email),
    phone: str(row.phone),
    instagramUrl: str(row.instagram_url),
    periodStart: num(row.period_start),
    periodEnd: num(row.period_end),
    isActive: bool(row.is_active),
    photo: mapMedia(row),
  };
}

export function mapDivision(row: Row): Division {
  // Row divisi menggabungkan media (id_2) + koordinator/member (id_3, name_2, ...).
  const coordinator: Member | null = row.id_3
    ? {
        id: String(row.id_3),
        name: str(row.name_2),
        nim: str(row.nim ?? row.npm),
        bio: str(row.bio),
        email: str(row.email),
        phone: str(row.phone),
        instagramUrl: str(row.instagram_url),
        periodStart: num(row.period_start),
        periodEnd: num(row.period_end),
        isActive: bool(row.is_active_2),
        photo: null,
      }
    : null;

  return {
    id: String(row.id),
    name: str(row.name),
    slug: str(row.slug),
    subtitle: str(row.subtitle),
    description: str(row.description),
    responsibilities: Array.isArray(row.responsibilities)
      ? row.responsibilities.map((item: unknown) => String(item ?? "")).filter(Boolean)
      : [],
    programs: Array.isArray(row.programs)
      ? row.programs
          .map((p: Row) => ({
            name: str(p?.name) ?? "",
            description: str(p?.description) ?? "",
          }))
          .filter((p: { name: string }) => p.name)
      : [],
    isActive: bool(row.is_active),
    icon: mapMedia(row),
    coordinator,
  };
}

export function mapBlogCategory(row: Row): BlogCategory {
  return { id: String(row.id), name: str(row.name), slug: str(row.slug) };
}

export function mapBlogTag(row: Row): BlogTag {
  return { id: String(row.id), name: str(row.name), slug: str(row.slug) };
}

export function mapBlogPost(row: Row): BlogPost {
  // Detail endpoint mengembalikan { post, tags }. List endpoint = row datar.
  const post = row?.post ?? row;
  const tags = Array.isArray(row?.tags) ? row.tags.map(mapBlogTag) : [];
  return {
    id: String(post.id),
    title: str(post.title),
    slug: str(post.slug),
    excerpt: str(post.excerpt),
    content: str(post.content),
    status: str(post.status),
    publishedAt: str(post.published_at),
    createdAt: str(post.created_at),
    categoryId: str(post.category_id),
    featuredMediaId: str(post.featured_media_id),
    authorId: str(post.author_id),
    authorName: str(post.name),
    categoryName: str(post.name_2),
    categorySlug: str(post.slug_2),
    featuredMedia: mapMedia(post, "id_4"),
    tags,
  };
}

export function mapGallery(row: Row): Gallery {
  return {
    id: String(row.id),
    title: str(row.title),
    description: str(row.description),
    eventId: str(row.event_id),
    isPublic: bool(row.is_public),
    createdAt: str(row.created_at),
    eventTitle: str(row.title_2),
  };
}

function mapGalleryItem(row: Row): GalleryItem {
  return {
    id: String(row.id),
    galleryId: str(row.gallery_id),
    mediaId: str(row.media_id),
    sortOrder: num(row.sort_order),
    media: mapMedia(row),
  };
}

export function mapGalleryDetail(data: Row): GalleryDetail {
  const gallery = data?.gallery ?? data;
  const items = Array.isArray(data?.items) ? data.items.map(mapGalleryItem) : [];
  return { ...mapGallery(gallery), items };
}

export function mapOrganizationProfile(row: Row): OrganizationProfile {
  return {
    id: String(row.id),
    name: str(row.name),
    shortName: str(row.short_name),
    description: str(row.description),
    vision: str(row.vision),
    mission: str(row.mission),
    history: str(row.history),
    address: str(row.address),
    email: str(row.email),
    phone: str(row.phone),
    instagramUrl: str(row.instagram_url),
    youtubeUrl: str(row.youtube_url),
    websiteUrl: str(row.website_url),
    logo: mapMedia(row),
  };
}

export function mapContactMessage(row: Row): ContactMessage {
  return {
    id: String(row.id),
    name: str(row.name),
    email: str(row.email),
    subject: str(row.subject),
    message: str(row.message),
    isRead: bool(row.is_read),
    createdAt: str(row.created_at),
  };
}

export function mapRole(row: Row): Role {
  return {
    id: String(row.id),
    name: str(row.name),
    description: str(row.description),
  };
}

export function mapUser(row: Row): AppUser {
  return {
    id: String(row.id),
    name: str(row.name),
    email: str(row.email),
    roleId: str(row.role_id),
    role: row.role ? mapRole(row.role) : null,
    isActive: bool(row.is_active),
    lastLoginAt: str(row.last_login_at),
  };
}
