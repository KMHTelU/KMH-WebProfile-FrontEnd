import { apiGet, apiPost } from "./client";
import {
  mapBanner,
  mapBlogCategory,
  mapBlogPost,
  mapBlogTag,
  mapDivision,
  mapDivisionMember,
  mapEvent,
  mapGallery,
  mapGalleryDetail,
  mapMember,
  mapOrganizationProfile,
  mapOrgTree,
} from "./mappers";
import type {
  Banner,
  BlogCategory,
  BlogPost,
  BlogTag,
  ContactMessagePayload,
  Division,
  DivisionMember,
  EventItem,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  Gallery,
  GalleryDetail,
  Member,
  OrganizationProfile,
  OrgTree,
} from "./types";

export interface ListParams {
  limit?: number;
  start?: number;
}

const listConfig = (params?: ListParams) => ({
  params: {
    limit: params?.limit ?? 50,
    start: params?.start ?? 0,
  },
});

const asArray = (data: unknown): any[] => (Array.isArray(data) ? data : []);

// ── Banners (hero) ──
export async function getBanners(): Promise<Banner[]> {
  const data = await apiGet<unknown>("/homepage-banners");
  return asArray(data).map(mapBanner);
}

// ── Events ──
export async function getEvents(params?: ListParams): Promise<EventItem[]> {
  const data = await apiGet<unknown>("/events", listConfig(params));
  return asArray(data).map(mapEvent);
}

export async function getEvent(id: string): Promise<EventItem> {
  const data = await apiGet<unknown>(`/events/${id}`);
  return mapEvent(data as Record<string, any>);
}

// ── Galleries ──
export async function getGalleries(params?: ListParams): Promise<Gallery[]> {
  const data = await apiGet<unknown>("/galleries", listConfig(params));
  return asArray(data).map(mapGallery);
}

export async function getGallery(id: string): Promise<GalleryDetail> {
  const data = await apiGet<unknown>(`/galleries/${id}`);
  return mapGalleryDetail(data as Record<string, any>);
}

// ── Blog ──
export async function getBlogPosts(params?: ListParams): Promise<BlogPost[]> {
  const data = await apiGet<unknown>("/blog-posts", listConfig(params));
  return asArray(data).map(mapBlogPost);
}

export async function getBlogPost(id: string): Promise<BlogPost> {
  const data = await apiGet<unknown>(`/blog-posts/${id}`);
  return mapBlogPost(data as Record<string, any>);
}

export async function getBlogCategories(params?: ListParams): Promise<BlogCategory[]> {
  const data = await apiGet<unknown>("/blog-categories", listConfig(params));
  return asArray(data).map(mapBlogCategory);
}

export async function getBlogTags(params?: ListParams): Promise<BlogTag[]> {
  const data = await apiGet<unknown>("/blog-tags", listConfig(params));
  return asArray(data).map(mapBlogTag);
}

// ── Divisions (endpoint publik ditambahkan di backend) ──
export async function getDivisions(): Promise<Division[]> {
  const data = await apiGet<unknown>("/divisions");
  return asArray(data).map(mapDivision);
}

export async function getDivision(id: string): Promise<Division> {
  const data = await apiGet<unknown>(`/divisions/${id}`);
  return mapDivision(data as Record<string, any>);
}

/** Semua anggota yang ditautkan ke sebuah divisi (beserta jabatan & foto). */
export async function getDivisionMembers(id: string): Promise<DivisionMember[]> {
  const data = await apiGet<unknown>(`/divisions/${id}/members`);
  return asArray(data).map(mapDivisionMember);
}

// ── Members (endpoint publik ditambahkan di backend) ──
export async function getMembers(params?: ListParams): Promise<Member[]> {
  const data = await apiGet<unknown>("/members", listConfig(params));
  return asArray(data).map(mapMember);
}

// ── Organization Tree (struktur organisasi publik) ──
export async function getOrganizationTree(): Promise<OrgTree> {
  const data = await apiGet<unknown>("/organization-tree");
  return mapOrgTree(data as Record<string, any>);
}

// ── Organization Profile ──
export async function getOrganizationProfile(
  id: string
): Promise<OrganizationProfile> {
  const data = await apiGet<unknown>(`/organization-profile/${id}`);
  return mapOrganizationProfile(data as Record<string, any>);
}

// ── Contact / Join form (publik) ──
export async function submitContactMessage(
  payload: ContactMessagePayload
): Promise<void> {
  await apiPost<null>("/contact-messages", payload);
}

// ── Lupa / reset password (publik, tanpa auth) ──
export async function forgotPassword(
  payload: ForgotPasswordPayload
): Promise<void> {
  await apiPost<null>("/forgot-password", payload);
}

export async function resetPassword(
  payload: ResetPasswordPayload
): Promise<void> {
  await apiPost<null>("/reset-password", payload);
}
