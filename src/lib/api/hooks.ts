import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getBanners,
  getBlogCategories,
  getBlogPost,
  getBlogPosts,
  getBlogTags,
  getDivision,
  getDivisions,
  getEvent,
  getEvents,
  getGalleries,
  getGallery,
  getMembers,
  getOrganizationProfile,
  getOrganizationTree,
  submitContactMessage,
  type ListParams,
} from "./endpoints";

// Kunci query terpusat.
export const queryKeys = {
  banners: ["banners"] as const,
  events: (params?: ListParams) => ["events", params ?? {}] as const,
  event: (id: string) => ["events", id] as const,
  galleries: (params?: ListParams) => ["galleries", params ?? {}] as const,
  gallery: (id: string) => ["galleries", id] as const,
  blogPosts: (params?: ListParams) => ["blog-posts", params ?? {}] as const,
  blogPost: (id: string) => ["blog-posts", id] as const,
  blogCategories: ["blog-categories"] as const,
  blogTags: ["blog-tags"] as const,
  divisions: ["divisions"] as const,
  division: (id: string) => ["divisions", id] as const,
  members: (params?: ListParams) => ["members", params ?? {}] as const,
  orgProfile: (id: string) => ["organization-profile", id] as const,
  orgTree: ["organization-tree"] as const,
  // Admin-only
  users: ["users"] as const,
  user: (id: string) => ["users", id] as const,
  roles: ["roles"] as const,
  contactMessages: (params?: ListParams) =>
    ["contact-messages", params ?? {}] as const,
  contactMessage: (id: string) => ["contact-messages", id] as const,
  bannersAdmin: ["banners", "admin"] as const,
};

export const useBanners = () =>
  useQuery({ queryKey: queryKeys.banners, queryFn: getBanners });

export const useEvents = (params?: ListParams) =>
  useQuery({ queryKey: queryKeys.events(params), queryFn: () => getEvents(params) });

export const useEvent = (id: string) =>
  useQuery({ queryKey: queryKeys.event(id), queryFn: () => getEvent(id), enabled: !!id });

export const useGalleries = (params?: ListParams) =>
  useQuery({ queryKey: queryKeys.galleries(params), queryFn: () => getGalleries(params) });

export const useGallery = (id: string) =>
  useQuery({ queryKey: queryKeys.gallery(id), queryFn: () => getGallery(id), enabled: !!id });

export const useBlogPosts = (params?: ListParams) =>
  useQuery({ queryKey: queryKeys.blogPosts(params), queryFn: () => getBlogPosts(params) });

export const useBlogPost = (id: string) =>
  useQuery({ queryKey: queryKeys.blogPost(id), queryFn: () => getBlogPost(id), enabled: !!id });

export const useBlogCategories = () =>
  useQuery({ queryKey: queryKeys.blogCategories, queryFn: () => getBlogCategories() });

export const useBlogTags = () =>
  useQuery({ queryKey: queryKeys.blogTags, queryFn: () => getBlogTags() });

export const useDivisions = () =>
  useQuery({ queryKey: queryKeys.divisions, queryFn: getDivisions });

export const useDivision = (id: string) =>
  useQuery({ queryKey: queryKeys.division(id), queryFn: () => getDivision(id), enabled: !!id });

export const useMembers = (params?: ListParams) =>
  useQuery({ queryKey: queryKeys.members(params), queryFn: () => getMembers(params) });

export const useOrganizationTree = () =>
  useQuery({ queryKey: queryKeys.orgTree, queryFn: getOrganizationTree });

export const useOrganizationProfile = (id: string) =>
  useQuery({
    queryKey: queryKeys.orgProfile(id),
    queryFn: () => getOrganizationProfile(id),
    enabled: !!id,
  });

export const useSubmitContactMessage = () =>
  useMutation({ mutationFn: submitContactMessage });
