import { useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Filter, ZoomIn } from "lucide-react";
import { SmartImage } from "../components/common/SmartImage";
import { Seo } from "../components/common/Seo";
import { useGalleryView } from "../../lib/content";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1556595163-03653bd477b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920";

export function Gallery() {
  const { data: galleryImages } = useGalleryView();
  const years = [...new Set(galleryImages.map((img) => img.year))].sort((a, b) => b - a);
  const eventNames = [...new Set(galleryImages.map((img) => img.event))];

  const [filterYear, setFilterYear] = useState<number | "all">("all");
  const [filterEvent, setFilterEvent] = useState<string | "all">("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = galleryImages.filter((img) => {
    const yearMatch = filterYear === "all" || img.year === filterYear;
    const eventMatch = filterEvent === "all" || img.event === filterEvent;
    return yearMatch && eventMatch;
  });

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = "";
  }, []);

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
  }, [filtered.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length));
  }, [filtered.length]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    },
    [closeLightbox, prev, next]
  );

  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="Galeri"
        description="Galeri foto kegiatan Keluarga Mahasiswa Hindu Telkom University — momen kebersamaan, budaya, dan pengabdian."
        path="/gallery"
      />
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[320px] flex items-end justify-start overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Gallery"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/85" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-12 w-full">
          <div
            className="inline-block text-xs tracking-widest uppercase text-amber-400 mb-3"
            style={{ fontWeight: 600 }}
          >
            Documentation
          </div>
          <h1
            className="text-white mb-2"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            Gallery
          </h1>
          <p className="text-white/70 max-w-lg" style={{ fontSize: "1rem" }}>
            Moments captured from our spiritual, cultural, and community activities.
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-neutral-400 mr-1">
              <Filter size={13} />
              <span style={{ fontWeight: 500 }}>Filter</span>
            </div>

            {/* Year */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setFilterYear("all")}
                className={`px-3 py-1.5 rounded-full text-xs transition-all duration-150 ${
                  filterYear === "all"
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                }`}
                style={{ fontWeight: 500 }}
              >
                All Years
              </button>
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => setFilterYear(y)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all duration-150 ${
                    filterYear === y
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                  }`}
                  style={{ fontWeight: 500 }}
                >
                  {y}
                </button>
              ))}
            </div>

            <div className="w-px h-4 bg-neutral-200" />

            {/* Event */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setFilterEvent("all")}
                className={`px-3 py-1.5 rounded-full text-xs transition-all duration-150 ${
                  filterEvent === "all"
                    ? "bg-amber-600 text-white"
                    : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                }`}
                style={{ fontWeight: 500 }}
              >
                All Events
              </button>
              {eventNames.map((name) => (
                <button
                  key={name}
                  onClick={() => setFilterEvent(name)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all duration-150 ${
                    filterEvent === name
                      ? "bg-amber-600 text-white"
                      : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                  }`}
                  style={{ fontWeight: 500 }}
                >
                  {name}
                </button>
              ))}
            </div>

            <span className="ml-auto text-xs text-neutral-400">
              {filtered.length} photo{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Image Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-neutral-400 text-sm">No photos found for the selected filters.</p>
              <button
                onClick={() => {
                  setFilterYear("all");
                  setFilterEvent("all");
                }}
                className="mt-4 text-xs text-amber-600 hover:text-amber-700 underline transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {filtered.map((img, i) => (
                <div
                  key={img.id}
                  className="break-inside-avoid group relative overflow-hidden rounded-2xl cursor-pointer"
                  style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
                  onClick={() => openLightbox(i)}
                >
                  <SmartImage
                    src={img.src}
                    alt={img.event}
                    wrapperClassName="w-full"
                    imgClassName="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white text-xs truncate" style={{ fontWeight: 500 }}>
                      {img.event}
                    </p>
                    <p className="text-white/60 text-[11px]">{img.year}</p>
                  </div>
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ZoomIn size={13} className="text-white" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          style={{ outline: "none" }}
        >
          {/* Close */}
          <button
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
          >
            <X size={18} />
          </button>

          {/* Prev */}
          <button
            className="absolute left-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Image */}
          <div
            className="relative max-w-5xl max-h-[85vh] mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filtered[lightboxIndex]?.src}
              alt={filtered[lightboxIndex]?.event}
              className="max-w-full max-h-[80vh] object-contain rounded-xl"
              style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent rounded-b-xl">
              <p className="text-white text-sm text-center" style={{ fontWeight: 500 }}>
                {filtered[lightboxIndex]?.event}
              </p>
              <p className="text-white/50 text-xs text-center mt-0.5">
                {lightboxIndex + 1} / {filtered.length}
              </p>
            </div>
          </div>

          {/* Next */}
          <button
            className="absolute right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
