import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Save } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { MediaPicker } from "../components/MediaPicker";
import { MarkdownEditor } from "../components/MarkdownEditor";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  useBlogCategories,
  useBlogPost,
  useBlogTags,
} from "../../../lib/api/hooks";
import { useCreateBlogPost, useUpdateBlogPost } from "../../../lib/api/admin-hooks";
import type { BlogPostPayload } from "../../../lib/api/types";

const NONE = "__none__";
const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function AdminBlogPostEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  const { data: existing } = useBlogPost(isNew ? "" : (id as string));
  const { data: categories = [] } = useBlogCategories();
  const { data: tags = [] } = useBlogTags();
  const createM = useCreateBlogPost();
  const updateM = useUpdateBlogPost();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category_id: NONE,
    featured_media_id: "",
    featured_url: "",
    status: "DRAFT" as BlogPostPayload["status"],
    tag_ids: [] as string[],
  });
  const [slugTouched, setSlugTouched] = useState(false);
  const set = (k: keyof typeof form, v: any) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (existing && !isNew) {
      setForm({
        title: existing.title || "",
        slug: existing.slug || "",
        excerpt: existing.excerpt || "",
        content: existing.content || "",
        category_id: existing.categoryId || NONE,
        featured_media_id: existing.featuredMedia?.id || existing.featuredMediaId || "",
        featured_url: existing.featuredMedia?.url || "",
        status: (existing.status as BlogPostPayload["status"]) || "DRAFT",
        tag_ids: existing.tags.map((t) => t.id),
      });
      setSlugTouched(true);
    }
  }, [existing, isNew]);

  const toggleTag = (tagId: string) =>
    set(
      "tag_ids",
      form.tag_ids.includes(tagId)
        ? form.tag_ids.filter((t) => t !== tagId)
        : [...form.tag_ids, tagId]
    );

  const submit = async () => {
    const payload: BlogPostPayload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      excerpt: form.excerpt || undefined,
      content: form.content,
      category_id: form.category_id === NONE ? undefined : form.category_id,
      featured_media_id: form.featured_media_id || undefined,
      status: form.status,
      tag_ids: form.tag_ids,
    };
    if (isNew) await createM.mutateAsync(payload);
    else await updateM.mutateAsync({ id: id as string, payload });
    navigate("/admin/blog");
  };

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => navigate("/admin/blog")}
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 mb-4"
      >
        <ArrowLeft size={15} /> Kembali
      </button>
      <PageHeader title={isNew ? "Artikel Baru" : "Edit Artikel"} />

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>Judul</Label>
          <Input
            value={form.title}
            onChange={(e) => {
              set("title", e.target.value);
              if (!slugTouched) set("slug", slugify(e.target.value));
            }}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Slug</Label>
          <Input
            value={form.slug}
            onChange={(e) => {
              set("slug", e.target.value);
              setSlugTouched(true);
            }}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Ringkasan (excerpt)</Label>
          <Textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Konten</Label>
          <MarkdownEditor
            value={form.content}
            onChange={(v) => set("content", v)}
            placeholder={"Tulis konten artikel di sini…\n\nGunakan tombol di atas untuk memformat teks (judul, tebal, daftar, gambar, dll)."}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Kategori</Label>
            <Select value={form.category_id} onValueChange={(v) => set("category_id", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>— Tidak ada —</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) => set("status", v as BlogPostPayload["status"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Tag</Label>
          <div className="flex flex-wrap gap-2">
            {tags.length === 0 && (
              <span className="text-sm text-neutral-400">Belum ada tag.</span>
            )}
            {tags.map((t) => {
              const active = form.tag_ids.includes(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleTag(t.id)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    active
                      ? "bg-amber-500 text-white border-amber-500"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-amber-300"
                  }`}
                >
                  {t.name}
                </button>
              );
            })}
          </div>
        </div>

        <MediaPicker
          label="Featured Image"
          value={form.featured_url}
          onChange={(media) => {
            set("featured_media_id", media?.id || "");
            set("featured_url", media?.url || "");
          }}
        />

        <div className="pt-2">
          <Button
            onClick={submit}
            disabled={!form.title || !form.content || createM.isPending || updateM.isPending}
          >
            <Save size={16} /> Simpan
          </Button>
        </div>
      </div>
    </div>
  );
}
