import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Calendar, ChevronRight, Clock, Search } from "lucide-react";
import { SmartImage } from "../components/common/SmartImage";
import { Reveal } from "../components/common/motion";
import { Seo } from "../components/common/Seo";
import { useBlogCategories, useBlogPosts } from "../../lib/api/hooks";
import type { BlogPost } from "../../lib/api/types";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1758613655378-89bb3d122c57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920";
const FALLBACK =
  "https://images.unsplash.com/photo-1667133000547-36edda79f81d?w=800&h=600&fit=crop";
const PAGE_SIZE = 9;

export function readingTime(content: string | null): number {
  if (!content) return 1;
  const words = content.replace(/[#*_>`~\-]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export function Blog() {
  const { data: posts = [], isLoading } = useBlogPosts({ limit: 200 });
  const { data: categories = [] } = useBlogCategories();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [page, setPage] = useState(1);

  const published = useMemo(
    () => posts.filter((p) => (p.status || "").toUpperCase() === "PUBLISHED"),
    [posts]
  );

  const filtered = useMemo(() => {
    return published.filter((p) => {
      const matchQuery =
        !query ||
        (p.title || "").toLowerCase().includes(query.toLowerCase()) ||
        (p.excerpt || "").toLowerCase().includes(query.toLowerCase());
      const matchCat = category === "all" || p.categoryId === category;
      return matchQuery && matchCat;
    });
  }, [published, query, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetPage = () => setPage(1);

  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="Blog"
        description="Artikel, berita, dan cerita dari Keluarga Mahasiswa Hindu Telkom University."
        path="/blog"
      />
      {/* Hero */}
      <section className="relative h-[42vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <SmartImage
          src={HERO_IMAGE}
          alt="Blog KMH"
          priority
          wrapperClassName="absolute inset-0 w-full h-full"
          imgClassName="w-full h-full object-cover"
          placeholderClassName="bg-neutral-800"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70 z-10" />
        <div className="relative z-20 text-center px-6">
          <div className="text-xs tracking-widest uppercase text-amber-300 mb-3">Blog & Berita</div>
          <h1 className="text-white" style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 700 }}>
            Cerita & Kabar KMH
          </h1>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Filter bar */}
          <div className="flex flex-col md:flex-row gap-3 mb-10">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  resetPage();
                }}
                placeholder="Cari artikel..."
                className="w-full pl-9 pr-4 py-2.5 rounded-full border border-neutral-200 text-sm focus:outline-none focus:border-amber-300"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => {
                  setCategory("all");
                  resetPage();
                }}
                className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                  category === "all"
                    ? "bg-amber-500 text-white border-amber-500"
                    : "bg-white text-neutral-600 border-neutral-200 hover:border-amber-300"
                }`}
              >
                Semua
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCategory(c.id);
                    resetPage();
                  }}
                  className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                    category === c.id
                      ? "bg-amber-500 text-white border-amber-500"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-amber-300"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-neutral-100 overflow-hidden">
                  <div className="h-48 bg-neutral-100 animate-pulse" />
                  <div className="p-5 space-y-2">
                    <div className="h-4 bg-neutral-100 rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-neutral-100 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : pageItems.length === 0 ? (
            <div className="text-center py-24 text-neutral-400">
              Belum ada artikel yang cocok.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pageItems.map((post: BlogPost, i) => (
                <Reveal as="div" key={post.id} delay={i * 0.05}>
                  <Link
                    to={`/blog/${post.slug || post.id}`}
                    className="group block bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:shadow-xl transition-all duration-300 h-full"
                    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <SmartImage
                        src={post.featuredMedia?.url || FALLBACK}
                        alt={post.title || ""}
                        wrapperClassName="w-full h-full"
                        imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {post.categoryName && (
                        <span className="absolute top-3 left-3 z-10 text-xs px-2.5 py-1 rounded-full bg-white/90 text-amber-700 backdrop-blur-sm">
                          {post.categoryName}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-3 text-xs text-neutral-400 mb-2">
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={12} /> {formatDate(post.publishedAt || post.createdAt)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock size={12} /> {readingTime(post.content)} mnt
                        </span>
                      </div>
                      <h3
                        className="text-neutral-900 group-hover:text-amber-700 transition-colors line-clamp-2"
                        style={{ fontSize: "1.05rem", fontWeight: 600, lineHeight: 1.35 }}
                      >
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-neutral-500 text-sm leading-relaxed line-clamp-2 mt-2">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-full text-sm transition-colors ${
                    page === i + 1
                      ? "bg-amber-500 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
