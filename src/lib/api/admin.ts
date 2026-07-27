// Lapisan fungsi CRUD untuk area admin (semua di bawah /protected).
// Read publik tetap dipakai dari endpoints.ts; di sini fokus write + read admin-only.

import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "./client";
import {
  mapBanner,
  mapContactMessage,
  mapEvent,
  mapGallery,
  mapMember,
  mapRole,
  mapUser,
} from "./mappers";
import type { ListParams } from "./endpoints";
import type {
  AppUser,
  Banner,
  BannerFormPayload,
  BlogPostPayload,
  ContactMessage,
  DivisionPayload,
  DivisionUpdatePayload,
  EventItem,
  EventPayload,
  Gallery,
  GalleryItemPayload,
  GalleryPayload,
  Media,
  MemberPayload,
  MemberUpdatePayload,
  NameSlugPayload,
  OrganizationProfilePayload,
  Role,
  RolePayload,
  UserPayload,
  UserUpdatePayload,
} from "./types";

const P = "/protected";

const listConfig = (params?: ListParams) => ({
  params: { limit: params?.limit ?? 50, start: params?.start ?? 0 },
});

const asArray = (data: unknown): any[] => (Array.isArray(data) ? data : []);

const multipart = { headers: { "Content-Type": "multipart/form-data" } };

// ── Media (upload generik) ──
export async function uploadMedia(file: File): Promise<Media> {
  const form = new FormData();
  form.append("file", file);
  const row = await apiPost<Record<string, any>>(`${P}/media`, form, multipart);
  return {
    id: row?.id != null ? String(row.id) : null,
    url: row?.url ?? null,
    fileName: row?.file_name ?? null,
    fileType: row?.file_type ?? null,
    mimeType: row?.mime_type ?? null,
    fileSize: row?.file_size ?? null,
    altText: row?.alt_text ?? null,
    caption: row?.caption ?? null,
  };
}

// ── Homepage Banners ──
export async function getAdminBanners(params?: ListParams): Promise<Banner[]> {
  const data = await apiGet<unknown>(`${P}/homepage-banners`, listConfig(params));
  return asArray(data).map(mapBanner);
}

export async function createBanner(
  file: File,
  data: BannerFormPayload
): Promise<void> {
  const form = new FormData();
  form.append("media", file);
  form.append("data.title", data.title);
  if (data.subtitle) form.append("data.subtitle", data.subtitle);
  if (data.cta_text) form.append("data.cta_text", data.cta_text);
  if (data.cta_url) form.append("data.cta_url", data.cta_url);
  form.append("data.is_active", String(data.is_active));
  form.append("data.start_date", data.start_date);
  form.append("data.end_date", data.end_date);
  if (data.alt_text) form.append("data.alt_text", data.alt_text);
  if (data.caption) form.append("data.caption", data.caption);
  await apiPost<null>(`${P}/homepage-banners`, form, multipart);
}

export async function deleteBanner(id: string): Promise<void> {
  await apiDelete<null>(`${P}/homepage-banners/${id}`);
}

// ── Divisions ──
export async function createDivision(payload: DivisionPayload): Promise<void> {
  await apiPost<null>(`${P}/divisions`, payload);
}
export async function updateDivision(
  id: string,
  payload: DivisionUpdatePayload
): Promise<void> {
  await apiPut<null>(`${P}/divisions/${id}`, payload);
}
export async function deleteDivision(id: string): Promise<void> {
  await apiDelete<null>(`${P}/divisions/${id}`);
}
export async function uploadDivisionIcon(id: string, file: File): Promise<void> {
  const form = new FormData();
  form.append("icon", file);
  await apiPost<null>(`${P}/divisions/${id}/upload`, form, multipart);
}

// ── Members ──
export async function getAdminMembers(params?: ListParams) {
  const data = await apiGet<unknown>(`${P}/members`, listConfig(params));
  return asArray(data).map(mapMember);
}
export async function createMember(payload: MemberPayload): Promise<void> {
  await apiPost<null>(`${P}/members`, payload);
}
export async function updateMember(
  id: string,
  payload: MemberUpdatePayload
): Promise<void> {
  await apiPut<null>(`${P}/members/${id}`, payload);
}
export async function deleteMember(id: string): Promise<void> {
  await apiDelete<null>(`${P}/members/${id}`);
}
export async function uploadMemberPhoto(id: string, file: File): Promise<void> {
  const form = new FormData();
  form.append("photo", file);
  await apiPost<null>(`${P}/members/${id}/upload`, form, multipart);
}

// ── Events ──
export async function createEvent(payload: EventPayload): Promise<void> {
  await apiPost<null>(`${P}/events`, payload);
}
export async function updateEvent(
  id: string,
  payload: EventPayload
): Promise<void> {
  await apiPut<null>(`${P}/events/${id}`, payload);
}
export async function deleteEvent(id: string): Promise<void> {
  await apiDelete<null>(`${P}/events/${id}`);
}
// Admin butuh event yang belum publish juga.
export async function getAdminEvents(params?: ListParams): Promise<EventItem[]> {
  const data = await apiGet<unknown>("/events", listConfig(params));
  return asArray(data).map(mapEvent);
}

// ── Blog: categories & tags ──
export async function createBlogCategory(payload: NameSlugPayload): Promise<void> {
  await apiPost<null>(`${P}/blog-categories`, payload);
}
export async function updateBlogCategory(
  id: string,
  payload: NameSlugPayload
): Promise<void> {
  await apiPut<null>(`${P}/blog-categories/${id}`, payload);
}
export async function deleteBlogCategory(id: string): Promise<void> {
  await apiDelete<null>(`${P}/blog-categories/${id}`);
}
export async function createBlogTag(payload: NameSlugPayload): Promise<void> {
  await apiPost<null>(`${P}/blog-tags`, payload);
}
export async function updateBlogTag(
  id: string,
  payload: NameSlugPayload
): Promise<void> {
  await apiPut<null>(`${P}/blog-tags/${id}`, payload);
}
export async function deleteBlogTag(id: string): Promise<void> {
  await apiDelete<null>(`${P}/blog-tags/${id}`);
}

// ── Blog posts ──
export async function createBlogPost(payload: BlogPostPayload): Promise<void> {
  await apiPost<null>(`${P}/blog-posts`, payload);
}
export async function updateBlogPost(
  id: string,
  payload: BlogPostPayload
): Promise<void> {
  await apiPut<null>(`${P}/blog-posts/${id}`, payload);
}
export async function deleteBlogPost(id: string): Promise<void> {
  await apiDelete<null>(`${P}/blog-posts/${id}`);
}

// ── Galleries ──
export async function createGallery(payload: GalleryPayload): Promise<Gallery> {
  const row = await apiPost<Record<string, any>>(`${P}/galleries`, payload);
  return mapGallery(row ?? {});
}
export async function updateGallery(
  id: string,
  payload: GalleryPayload
): Promise<void> {
  await apiPut<null>(`${P}/galleries/${id}`, payload);
}
export async function deleteGallery(id: string): Promise<void> {
  await apiDelete<null>(`${P}/galleries/${id}`);
}
export async function addGalleryItem(
  galleryId: string,
  payload: GalleryItemPayload
): Promise<void> {
  await apiPost<null>(`${P}/galleries/${galleryId}/items`, payload);
}
export async function deleteGalleryItem(
  galleryId: string,
  itemId: string
): Promise<void> {
  await apiDelete<null>(`${P}/galleries/${galleryId}/items/${itemId}`);
}

// ── Organization Profile ──
export async function createOrgProfile(
  payload: OrganizationProfilePayload
): Promise<void> {
  await apiPost<null>(`${P}/organization-profile`, payload);
}
export async function updateOrgProfile(
  id: string,
  payload: OrganizationProfilePayload
): Promise<void> {
  await apiPut<null>(`${P}/organization-profile/${id}`, payload);
}
export async function uploadOrgProfileLogo(
  id: string,
  file: File
): Promise<void> {
  const form = new FormData();
  form.append("logo", file);
  await apiPost<null>(`${P}/organization-profile/${id}/upload`, form, multipart);
}

// ── Contact Messages ──
export async function getContactMessages(
  params?: ListParams
): Promise<ContactMessage[]> {
  const data = await apiGet<unknown>(`${P}/contact-messages`, listConfig(params));
  return asArray(data).map(mapContactMessage);
}
export async function getContactMessage(id: string): Promise<ContactMessage> {
  const row = await apiGet<Record<string, any>>(`${P}/contact-messages/${id}`);
  return mapContactMessage(row ?? {});
}
export async function markContactMessageRead(id: string): Promise<void> {
  await apiPatch<null>(`${P}/contact-messages/${id}/read`);
}
export async function deleteContactMessage(id: string): Promise<void> {
  await apiDelete<null>(`${P}/contact-messages/${id}`);
}

// ── Users ──
export async function getUsers(): Promise<AppUser[]> {
  const data = await apiGet<unknown>(`${P}/user`);
  return asArray(data).map(mapUser);
}
export async function getUser(id: string): Promise<AppUser> {
  const row = await apiGet<Record<string, any>>(`${P}/user/${id}`);
  return mapUser(row ?? {});
}
export async function createUser(payload: UserPayload): Promise<void> {
  await apiPost<null>(`${P}/user`, payload);
}
export async function updateUser(
  id: string,
  payload: UserUpdatePayload
): Promise<void> {
  await apiPut<null>(`${P}/user/${id}`, payload);
}
export async function deleteUser(id: string): Promise<void> {
  await apiDelete<null>(`${P}/user/${id}`);
}

// ── Roles ──
export async function getRoles(): Promise<Role[]> {
  const data = await apiGet<unknown>(`${P}/roles`);
  return asArray(data).map(mapRole);
}
export async function createRole(payload: RolePayload): Promise<void> {
  await apiPost<null>(`${P}/roles`, payload);
}
export async function updateRole(id: string, payload: RolePayload): Promise<void> {
  await apiPut<null>(`${P}/roles/${id}`, payload);
}
export async function deleteRole(id: string): Promise<void> {
  await apiDelete<null>(`${P}/roles/${id}`);
}
