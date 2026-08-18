// Tipe domain yang dipakai UI (hasil normalisasi dari row backend).

export interface Media {
  id: string | null;
  url: string | null;
  fileName: string | null;
  fileType: string | null;
  mimeType: string | null;
  fileSize: number | null;
  altText: string | null;
  caption: string | null;
}

export interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  ctaText: string | null;
  ctaUrl: string | null;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  media: Media | null;
}

export type EventStatus = "upcoming" | "ongoing" | "finished" | string;

export interface EventItem {
  id: string;
  title: string | null;
  slug: string | null;
  description: string | null;
  eventType: string | null;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  googleMapsUrl: string | null;
  registrationUrl: string | null;
  status: EventStatus | null;
  isPublished: boolean;
  cover: Media | null;
  /** Divisi penyelenggara/penanggung jawab event (opsional). */
  divisionId: string | null;
  divisionName: string | null;
  divisionSlug: string | null;
}

export interface Member {
  id: string;
  name: string | null;
  nim: string | null;
  bio: string | null;
  email: string | null;
  phone: string | null;
  instagramUrl: string | null;
  periodStart: number | null;
  periodEnd: number | null;
  isActive: boolean;
  photo: Media | null;
}

// ── Hall of Fame (arsip museum 3D) ──

export type HofCategory =
  | "Academic"
  | "Competition"
  | "Leadership"
  | "Community Service"
  | "Arts & Culture"
  | "Technology"
  | "Entrepreneurship"
  | "Sports"
  | "Other";

export interface HofGeneration {
  id: string;
  name: string;
  yearStart: number;
  yearEnd: number;
  description: string;
  milestones: string[];
  accent: string;
  sortOrder: number;
}

export interface HofPerson {
  id: string;
  generationId: string;
  name: string;
  role: string;
  studyProgram: string;
  biography: string;
  contributions: string;
  legacy: string;
  quote: string;
  fields: string[];
  photoMediaId: string | null;
  photoUrl: string | null;
  sortOrder: number;
}

export interface HofAchievement {
  id: string;
  personId: string;
  title: string;
  category: string;
  year: number;
  organization: string;
  result: string;
  description: string;
}

export interface HofTimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  sortOrder: number;
}

export interface HallOfFame {
  generations: HofGeneration[];
  people: HofPerson[];
  achievements: HofAchievement[];
  timeline: HofTimelineEvent[];
}

// Payload CRUD HOF (snake_case sesuai kontrak backend).
export interface HofGenerationPayload {
  name: string;
  year_start: number;
  year_end: number;
  description?: string;
  milestones?: string[];
  accent?: string;
  sort_order?: number;
}

export interface HofPersonPayload {
  generation_id: string;
  name: string;
  role?: string;
  study_program?: string;
  biography?: string;
  contributions?: string;
  legacy?: string;
  quote?: string;
  fields?: string[];
  photo_media_id?: string;
  sort_order?: number;
}

export interface HofAchievementPayload {
  person_id: string;
  title: string;
  category?: string;
  year: number;
  organization?: string;
  result?: string;
  description?: string;
}

export interface HofTimelinePayload {
  year_label: string;
  title: string;
  description?: string;
  sort_order?: number;
}

// ── Organization tree (GET /organization-tree) ──

/** Orang yang tampil di struktur organisasi (foto = foto member yang sudah ada). */
export interface OrgTreePerson {
  memberId: string;
  name: string | null;
  nim: string | null;
  photoUrl: string | null;
  roleTitle: string | null;
}

export interface OrgTreeDivision {
  id: string;
  name: string | null;
  slug: string | null;
  subtitle: string | null;
  description: string | null;
  responsibilities: string[];
  coordinator: OrgTreePerson | null;
}

export interface OrgTree {
  /** Pengurus inti (dari divisi ber-slug inti/pengurus-inti/bph). */
  leadership: OrgTreePerson[];
  /** Divisi aktif beserta koordinatornya (divisi inti tidak disertakan). */
  divisions: OrgTreeDivision[];
}

/** Satu penugasan anggota ke divisi (baris tabel member_divisions + info divisinya). */
export interface MemberDivision {
  /** ID baris penugasan (dipakai untuk update/hapus). */
  id: string;
  memberId: string | null;
  divisionId: string | null;
  roleTitle: string | null;
  divisionName: string | null;
  divisionSlug: string | null;
}

export interface DivisionProgram {
  name: string;
  description: string;
}

export interface Division {
  id: string;
  name: string | null;
  slug: string | null;
  subtitle: string | null;
  description: string | null;
  responsibilities: string[];
  programs: DivisionProgram[];
  isActive: boolean;
  icon: Media | null;
  coordinator: Member | null;
}

export interface BlogCategory {
  id: string;
  name: string | null;
  slug: string | null;
}

export interface BlogTag {
  id: string;
  name: string | null;
  slug: string | null;
}

export type BlogStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED" | string;

export interface BlogPost {
  id: string;
  title: string | null;
  slug: string | null;
  excerpt: string | null;
  content: string | null;
  status: BlogStatus | null;
  publishedAt: string | null;
  createdAt: string | null;
  categoryId: string | null;
  featuredMediaId: string | null;
  authorId: string | null;
  authorName: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  featuredMedia: Media | null;
  tags: BlogTag[];
}

export interface Gallery {
  id: string;
  title: string | null;
  description: string | null;
  eventId: string | null;
  isPublic: boolean;
  createdAt: string | null;
  eventTitle: string | null;
}

export interface GalleryItem {
  id: string;
  galleryId: string | null;
  mediaId: string | null;
  sortOrder: number | null;
  media: Media | null;
}

export interface GalleryDetail extends Gallery {
  items: GalleryItem[];
}

export interface OrganizationProfile {
  id: string;
  name: string | null;
  shortName: string | null;
  description: string | null;
  vision: string | null;
  mission: string | null;
  history: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  websiteUrl: string | null;
  logo: Media | null;
}

export interface ContactMessage {
  id: string;
  name: string | null;
  email: string | null;
  subject: string | null;
  message: string | null;
  isRead: boolean;
  createdAt: string | null;
}

export interface Role {
  id: string;
  name: string | null;
  description?: string | null;
}

export interface AppUser {
  id: string;
  name: string | null;
  email: string | null;
  roleId: string | null;
  role: Role | null;
  isActive: boolean;
  lastLoginAt: string | null;
}

// ── Payload request (mengikuti kontrak backend, snake_case) ──

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  new_password: string;
}

export interface ContactMessagePayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface EventPayload {
  title: string;
  slug: string;
  description?: string;
  event_type?: string;
  start_time: string;
  end_time?: string;
  location?: string;
  google_maps_url?: string;
  registration_url?: string;
  cover_media_id?: string;
  status?: string;
  is_published?: boolean;
  division_id?: string;
}

export interface BlogPostPayload {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category_id?: string;
  featured_media_id?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  tag_ids?: string[];
}

export interface GalleryPayload {
  title: string;
  description?: string;
  event_id?: string;
  is_public?: boolean;
}

export interface DivisionPayload {
  name: string;
  slug: string;
  subtitle?: string;
  description?: string;
  responsibilities?: string[];
  programs?: DivisionProgram[];
  coordinator_id?: string;
}

export interface MemberPayload {
  name: string;
  nim: string;
  bio?: string;
  email?: string;
  phone?: string;
  instagram_url?: string;
  period_start: number;
  period_end: number;
}

export interface OrganizationProfilePayload {
  name: string;
  short_name: string;
  description?: string;
  vision?: string;
  mission?: string;
  history?: string;
  address?: string;
  email?: string;
  phone?: string;
  instagram_url?: string;
  youtube_url?: string;
  website_url?: string;
}

export interface NameSlugPayload {
  name: string;
  slug: string;
}

export interface UserPayload {
  name: string;
  email: string;
  password?: string;
  role_id: string;
  is_active?: boolean;
}

export interface UserUpdatePayload {
  name?: string;
  email?: string;
  password?: string;
  role_id?: string;
  is_active?: boolean;
}

export interface RolePayload {
  name: string;
  description?: string;
}

// Update payload untuk member (field tambahan yang hanya ada saat update).
export interface MemberUpdatePayload extends Partial<MemberPayload> {
  is_active?: boolean;
  photo_media_id?: string;
}

// Update payload untuk divisi.
export interface DivisionUpdatePayload extends Partial<DivisionPayload> {
  is_active?: boolean;
}

// Item galeri (referensi media yang sudah ada).
export interface GalleryItemPayload {
  media_id: string;
  sort_order?: number;
}

// Penugasan anggota ke divisi (POST /protected/member-divisions).
export interface MemberDivisionPayload {
  member_id: string;
  division_id: string;
  role_title?: string;
}

// ── Bulk & Import (kontrak backend /bulk dan /import/:entity) ──

export interface BulkItemResult {
  index: number;
  status: "success" | "failed";
  id?: string;
  /** Nomor baris berkas asli (hanya pada alur import). */
  row?: number;
  error?: string;
}

export interface BulkReport {
  total: number;
  succeeded: number;
  failed: number;
  results: BulkItemResult[];
}

/** Entity yang didukung endpoint /protected/import/:entity. */
export type ImportEntity =
  | "members"
  | "divisions"
  | "member-divisions"
  | "events"
  | "roles";

// Item update bulk selalu menyertakan id.
export type BulkUpdateItem<T> = T & { id: string };

// Field teks banner (dikirim sebagai form field data.* bersama file media).
export interface BannerFormPayload {
  title: string;
  subtitle?: string;
  cta_text?: string;
  cta_url?: string;
  is_active: boolean;
  start_date: string; // RFC3339
  end_date: string; // RFC3339
  alt_text?: string;
  caption?: string;
}
