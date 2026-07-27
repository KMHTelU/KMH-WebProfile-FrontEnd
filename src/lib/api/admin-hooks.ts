import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as admin from "./admin";
import { parseApiError } from "./client";
import { getContactMessage, getUser } from "./admin";
import { queryKeys } from "./hooks";
import type { ListParams } from "./endpoints";

// ── Query hooks admin-only ──
export const useAdminMembers = (params?: ListParams) =>
  useQuery({
    queryKey: ["members", "admin", params ?? {}],
    queryFn: () => admin.getAdminMembers(params),
  });

export const useAdminEvents = (params?: ListParams) =>
  useQuery({
    queryKey: ["events", "admin", params ?? {}],
    queryFn: () => admin.getAdminEvents(params),
  });

export const useAdminBanners = (params?: ListParams) =>
  useQuery({
    queryKey: ["banners", "admin", params ?? {}],
    queryFn: () => admin.getAdminBanners(params),
  });

export const useUsers = () =>
  useQuery({ queryKey: queryKeys.users, queryFn: admin.getUsers });

export const useUser = (id: string) =>
  useQuery({ queryKey: queryKeys.user(id), queryFn: () => getUser(id), enabled: !!id });

export const useRoles = () =>
  useQuery({ queryKey: queryKeys.roles, queryFn: admin.getRoles });

export const useContactMessages = (params?: ListParams) =>
  useQuery({
    queryKey: queryKeys.contactMessages(params),
    queryFn: () => admin.getContactMessages(params),
  });

export const useContactMessage = (id: string) =>
  useQuery({
    queryKey: queryKeys.contactMessage(id),
    queryFn: () => getContactMessage(id),
    enabled: !!id,
  });

// ── Helper mutation generik: toast + invalidasi + return useMutation ──
function useAdminMutation<TArgs, TResult>(
  mutationFn: (args: TArgs) => Promise<TResult>,
  opts: { successMessage: string; invalidate: readonly unknown[][] }
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      opts.invalidate.forEach((key) => qc.invalidateQueries({ queryKey: key }));
      toast.success(opts.successMessage);
    },
    onError: (err) => toast.error(parseApiError(err).message),
  });
}

// ── Banners ──
export const useCreateBanner = () =>
  useAdminMutation(
    (args: { file: File; data: Parameters<typeof admin.createBanner>[1] }) =>
      admin.createBanner(args.file, args.data),
    { successMessage: "Banner dibuat", invalidate: [["banners"]] }
  );
export const useDeleteBanner = () =>
  useAdminMutation((id: string) => admin.deleteBanner(id), {
    successMessage: "Banner dihapus",
    invalidate: [["banners"]],
  });

// ── Divisions ──
export const useCreateDivision = () =>
  useAdminMutation(admin.createDivision, {
    successMessage: "Divisi dibuat",
    invalidate: [["divisions"]],
  });
export const useUpdateDivision = () =>
  useAdminMutation(
    (args: { id: string; payload: Parameters<typeof admin.updateDivision>[1] }) =>
      admin.updateDivision(args.id, args.payload),
    { successMessage: "Divisi diperbarui", invalidate: [["divisions"]] }
  );
export const useDeleteDivision = () =>
  useAdminMutation((id: string) => admin.deleteDivision(id), {
    successMessage: "Divisi dihapus",
    invalidate: [["divisions"]],
  });
export const useUploadDivisionIcon = () =>
  useAdminMutation(
    (args: { id: string; file: File }) =>
      admin.uploadDivisionIcon(args.id, args.file),
    { successMessage: "Ikon divisi diunggah", invalidate: [["divisions"]] }
  );

// ── Members ──
export const useCreateMember = () =>
  useAdminMutation(admin.createMember, {
    successMessage: "Anggota dibuat",
    invalidate: [["members"]],
  });
export const useUpdateMember = () =>
  useAdminMutation(
    (args: { id: string; payload: Parameters<typeof admin.updateMember>[1] }) =>
      admin.updateMember(args.id, args.payload),
    { successMessage: "Anggota diperbarui", invalidate: [["members"]] }
  );
export const useDeleteMember = () =>
  useAdminMutation((id: string) => admin.deleteMember(id), {
    successMessage: "Anggota dihapus",
    invalidate: [["members"]],
  });
export const useUploadMemberPhoto = () =>
  useAdminMutation(
    (args: { id: string; file: File }) =>
      admin.uploadMemberPhoto(args.id, args.file),
    { successMessage: "Foto anggota diunggah", invalidate: [["members"]] }
  );

// ── Events ──
export const useCreateEvent = () =>
  useAdminMutation(admin.createEvent, {
    successMessage: "Event dibuat",
    invalidate: [["events"]],
  });
export const useUpdateEvent = () =>
  useAdminMutation(
    (args: { id: string; payload: Parameters<typeof admin.updateEvent>[1] }) =>
      admin.updateEvent(args.id, args.payload),
    { successMessage: "Event diperbarui", invalidate: [["events"]] }
  );
export const useDeleteEvent = () =>
  useAdminMutation((id: string) => admin.deleteEvent(id), {
    successMessage: "Event dihapus",
    invalidate: [["events"]],
  });

// ── Blog categories ──
export const useCreateBlogCategory = () =>
  useAdminMutation(admin.createBlogCategory, {
    successMessage: "Kategori dibuat",
    invalidate: [["blog-categories"]],
  });
export const useUpdateBlogCategory = () =>
  useAdminMutation(
    (args: { id: string; payload: Parameters<typeof admin.updateBlogCategory>[1] }) =>
      admin.updateBlogCategory(args.id, args.payload),
    { successMessage: "Kategori diperbarui", invalidate: [["blog-categories"]] }
  );
export const useDeleteBlogCategory = () =>
  useAdminMutation((id: string) => admin.deleteBlogCategory(id), {
    successMessage: "Kategori dihapus",
    invalidate: [["blog-categories"]],
  });

// ── Blog tags ──
export const useCreateBlogTag = () =>
  useAdminMutation(admin.createBlogTag, {
    successMessage: "Tag dibuat",
    invalidate: [["blog-tags"]],
  });
export const useUpdateBlogTag = () =>
  useAdminMutation(
    (args: { id: string; payload: Parameters<typeof admin.updateBlogTag>[1] }) =>
      admin.updateBlogTag(args.id, args.payload),
    { successMessage: "Tag diperbarui", invalidate: [["blog-tags"]] }
  );
export const useDeleteBlogTag = () =>
  useAdminMutation((id: string) => admin.deleteBlogTag(id), {
    successMessage: "Tag dihapus",
    invalidate: [["blog-tags"]],
  });

// ── Blog posts ──
export const useCreateBlogPost = () =>
  useAdminMutation(admin.createBlogPost, {
    successMessage: "Artikel dibuat",
    invalidate: [["blog-posts"]],
  });
export const useUpdateBlogPost = () =>
  useAdminMutation(
    (args: { id: string; payload: Parameters<typeof admin.updateBlogPost>[1] }) =>
      admin.updateBlogPost(args.id, args.payload),
    { successMessage: "Artikel diperbarui", invalidate: [["blog-posts"]] }
  );
export const useDeleteBlogPost = () =>
  useAdminMutation((id: string) => admin.deleteBlogPost(id), {
    successMessage: "Artikel dihapus",
    invalidate: [["blog-posts"]],
  });

// ── Galleries ──
export const useCreateGallery = () =>
  useAdminMutation(admin.createGallery, {
    successMessage: "Galeri dibuat",
    invalidate: [["galleries"]],
  });
export const useUpdateGallery = () =>
  useAdminMutation(
    (args: { id: string; payload: Parameters<typeof admin.updateGallery>[1] }) =>
      admin.updateGallery(args.id, args.payload),
    { successMessage: "Galeri diperbarui", invalidate: [["galleries"]] }
  );
export const useDeleteGallery = () =>
  useAdminMutation((id: string) => admin.deleteGallery(id), {
    successMessage: "Galeri dihapus",
    invalidate: [["galleries"]],
  });
export const useAddGalleryItem = () =>
  useAdminMutation(
    (args: { galleryId: string; payload: Parameters<typeof admin.addGalleryItem>[1] }) =>
      admin.addGalleryItem(args.galleryId, args.payload),
    { successMessage: "Media ditambahkan", invalidate: [["galleries"]] }
  );
export const useDeleteGalleryItem = () =>
  useAdminMutation(
    (args: { galleryId: string; itemId: string }) =>
      admin.deleteGalleryItem(args.galleryId, args.itemId),
    { successMessage: "Media dihapus", invalidate: [["galleries"]] }
  );

// ── Organization Profile ──
export const useCreateOrgProfile = () =>
  useAdminMutation(admin.createOrgProfile, {
    successMessage: "Profil organisasi dibuat",
    invalidate: [["organization-profile"]],
  });
export const useUpdateOrgProfile = () =>
  useAdminMutation(
    (args: { id: string; payload: Parameters<typeof admin.updateOrgProfile>[1] }) =>
      admin.updateOrgProfile(args.id, args.payload),
    { successMessage: "Profil organisasi diperbarui", invalidate: [["organization-profile"]] }
  );
export const useUploadOrgProfileLogo = () =>
  useAdminMutation(
    (args: { id: string; file: File }) =>
      admin.uploadOrgProfileLogo(args.id, args.file),
    { successMessage: "Logo diunggah", invalidate: [["organization-profile"]] }
  );

// ── Contact Messages ──
export const useMarkContactMessageRead = () =>
  useAdminMutation((id: string) => admin.markContactMessageRead(id), {
    successMessage: "Ditandai sudah dibaca",
    invalidate: [["contact-messages"]],
  });
export const useDeleteContactMessage = () =>
  useAdminMutation((id: string) => admin.deleteContactMessage(id), {
    successMessage: "Pesan dihapus",
    invalidate: [["contact-messages"]],
  });

// ── Users ──
export const useCreateUser = () =>
  useAdminMutation(admin.createUser, {
    successMessage: "User dibuat",
    invalidate: [["users"]],
  });
export const useUpdateUser = () =>
  useAdminMutation(
    (args: { id: string; payload: Parameters<typeof admin.updateUser>[1] }) =>
      admin.updateUser(args.id, args.payload),
    { successMessage: "User diperbarui", invalidate: [["users"]] }
  );
export const useDeleteUser = () =>
  useAdminMutation((id: string) => admin.deleteUser(id), {
    successMessage: "User dihapus",
    invalidate: [["users"]],
  });

// ── Roles ──
export const useCreateRole = () =>
  useAdminMutation(admin.createRole, {
    successMessage: "Role dibuat",
    invalidate: [["roles"]],
  });
export const useUpdateRole = () =>
  useAdminMutation(
    (args: { id: string; payload: Parameters<typeof admin.updateRole>[1] }) =>
      admin.updateRole(args.id, args.payload),
    { successMessage: "Role diperbarui", invalidate: [["roles"]] }
  );
export const useDeleteRole = () =>
  useAdminMutation((id: string) => admin.deleteRole(id), {
    successMessage: "Role dihapus",
    invalidate: [["roles"]],
  });

// ── Media upload (dipakai MediaPicker) ──
export const useUploadMedia = () =>
  useMutation({
    mutationFn: (file: File) => admin.uploadMedia(file),
    onError: (err) => toast.error(parseApiError(err).message),
  });
