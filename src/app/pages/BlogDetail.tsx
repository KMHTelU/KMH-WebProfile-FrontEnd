import { useMemo } from "react";
import { Link, Navigate, useParams } from "react-router";
import { ArrowLeft, Calendar, Clock, Facebook, Link2, Twitter, User } from "lucide-react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { toast } from "sonner";
import { SmartImage } from "../components/common/SmartImage";
import { Reveal } from "../components/common/motion";
import { Seo } from "../components/common/Seo";
import { useBlogPost, useBlogPosts } from "../../lib/api/hooks";
import { readingTime } from "./Blog";

const FALLBACK =
  "https://images.unsplash.com/photo-1667133000547-36edda79f81d?w=1200&h=700&fit=crop";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: posts = [], isLoading } = useBlogPosts({ limit: 200 });

  const match = posts.find((p) => p.slug === slug || p.id === slug);
  const { data: detail } = useBlogPost(match?.id || "");
  const post = detail || match;

  const html = useMemo(() => {
    if (!post?.content) return "";
    const raw = marked.parse(post.content, { async: false }) as string;
    return DOMPurify.sanitize(raw);
  }, [post?.content]);

  const related = useMemo(() => {
    if (!post) return [];
    return posts
      .filter(
        (p) =>
          p.id !== post.id &&
          (p.status || "").toUpperCase() === "PUBLISHED" &&
          p.categoryId === post.categoryId
      )
      .slice(0, 3);
  }, [posts, post]);

  if (!isLoading && posts.length > 0 && !match) {
    return <Navigate to="/blog" replace />;
  }
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-400">
        Memuat artikel…
      </div>
    );
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const metaDesc = (
    post.excerpt ||
    (post.content || "").replace(/[#*_>`\[\]]/g, "").replace(/\s+/g, " ").trim()
  ).slice(0, 160);

  const postJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    ...(post.featuredMedia?.url ? { image: [post.featuredMedia.url] } : {}),
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    ...(post.authorName
      ? { author: { "@type": "Person", name: post.authorName } }
      : {}),
    publisher: {
      "@type": "Organization",
      name: "Keluarga Mahasiswa Hindu Telkom University",
    },
    description: metaDesc,
  };

  return (
    <div className="min-h-screen bg-white">
      <Seo
        title={post.title || "Artikel"}
        description={metaDesc}
        image={post.featuredMedia?.url || FALLBACK}
        type="article"
        path={`/blog/${post.slug || post.id}`}
        jsonLd={postJsonLd}
      />
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[340px] flex items-end overflow-hidden">
        <SmartImage
          src={post.featuredMedia?.url || FALLBACK}
          alt={post.title || ""}
          priority
          wrapperClassName="absolute inset-0 w-full h-full"
          imgClassName="w-full h-full object-cover"
          placeholderClassName="bg-neutral-800"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/85 z-10" />
        <div className="relative z-20 max-w-3xl mx-auto px-6 pb-12 w-full">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white mb-4"
          >
            <ArrowLeft size={15} /> Kembali ke Blog
          </Link>
          {post.categoryName && (
            <span className="inline-block text-xs px-3 py-1 rounded-full bg-amber-500 text-white mb-3">
              {post.categoryName}
            </span>
          )}
          <h1 className="text-white" style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", fontWeight: 700, lineHeight: 1.15 }}>
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/70 mt-4">
            {post.authorName && (
              <span className="inline-flex items-center gap-1.5">
                <User size={14} /> {post.authorName}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={14} /> {formatDate(post.publishedAt || post.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} /> {readingTime(post.content)} menit baca
            </span>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-14 px-6">
        <div className="max-w-3xl mx-auto">
          <article
            className="max-w-none text-neutral-700 leading-relaxed
              [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:text-neutral-900
              [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-neutral-900
              [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-neutral-900
              [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
              [&_li]:mb-1 [&_a]:text-amber-700 [&_a]:underline
              [&_blockquote]:border-l-4 [&_blockquote]:border-amber-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-neutral-500
              [&_img]:rounded-xl [&_img]:my-6 [&_code]:bg-neutral-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm
              [&_pre]:bg-neutral-900 [&_pre]:text-neutral-100 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:my-6"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {/* Share */}
          <div className="flex items-center gap-3 mt-10 pt-6 border-t border-neutral-100">
            <span className="text-sm text-neutral-500">Bagikan:</span>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title || "")}`}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600"
              aria-label="Bagikan ke Twitter"
            >
              <Twitter size={16} />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600"
              aria-label="Bagikan ke Facebook"
            >
              <Facebook size={16} />
            </a>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(shareUrl);
                toast.success("Tautan disalin");
              }}
              className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600"
              aria-label="Salin tautan"
            >
              <Link2 size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-14 px-6 bg-neutral-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-neutral-900 mb-8" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
              Artikel Terkait
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p, i) => (
                <Reveal as="div" key={p.id} delay={i * 0.05}>
                  <Link
                    to={`/blog/${p.slug || p.id}`}
                    className="group block bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:shadow-lg transition-all"
                  >
                    <div className="h-40 overflow-hidden">
                      <SmartImage
                        src={p.featuredMedia?.url || FALLBACK}
                        alt={p.title || ""}
                        wrapperClassName="w-full h-full"
                        imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-neutral-900 group-hover:text-amber-700 transition-colors line-clamp-2" style={{ fontWeight: 600 }}>
                        {p.title}
                      </h3>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
