import { Link } from "react-router";
import { ArrowRight, Calendar, ChevronRight, Landmark, Sparkles } from "lucide-react";
import { HALL_OF_FAME_URL } from "../../lib/config";
import kmhLogo from "../../assets/KMH.png";
import { SmartImage } from "../components/common/SmartImage";
import { Aurora, BlurText, CountUp, GradientText, Reveal } from "../components/common/motion";
import { Seo } from "../components/common/Seo";
import { OrganizationTree } from "../components/OrganizationTree";
import {
  useBannersView,
  useDivisionsView,
  useEventsView,
  useGalleryView,
} from "../../lib/content";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1667133000547-36edda79f81d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920";
const ABOUT_IMAGE =
  "https://images.unsplash.com/photo-1708578200684-3aa944b73237?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900";

const categoryColor = (cat: string) => {
  if (cat === "Core Management") return "bg-amber-50 text-amber-700 border border-amber-200";
  if (cat === "External Division") return "bg-blue-50 text-blue-700 border border-blue-200";
  return "bg-neutral-100 text-neutral-600 border border-neutral-200";
};

const statusStyle = (status: string) =>
  status === "Upcoming"
    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
    : "bg-neutral-100 text-neutral-500 border border-neutral-200";

export function Home() {
  const { primary } = useBannersView();
  const { data: divisions } = useDivisionsView();
  const { data: events } = useEventsView();
  const { data: galleryImages } = useGalleryView();

  const heroImage = primary?.media?.url || HERO_IMAGE;
  const heroTitle = primary?.title || "One Family,";
  const heroSubtitle =
    primary?.subtitle ||
    "A community of Hindu students at Telkom University, growing together through spiritual practice, cultural expression, and meaningful service.";

  const upcomingEvents = events.slice(0, 3);
  const highlightImages = galleryImages.slice(0, 6);

  const FOUNDED_YEAR = 2005;
  const yearsActive = Math.max(0, new Date().getFullYear() - FOUNDED_YEAR);

  return (
    <div className="min-h-screen bg-white">
      <Seo path="/" />
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image (SmartImage: placeholder + fade-in agar tidak terkesan lemot) */}
        <div className="absolute inset-0">
          <SmartImage
            src={heroImage}
            alt="KMH Hero"
            priority
            fallbackSrc={HERO_IMAGE}
            wrapperClassName="w-full h-full"
            imgClassName="w-full h-full object-cover object-center"
            placeholderClassName="bg-gradient-to-br from-neutral-800 to-neutral-900"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          <Aurora className="mix-blend-screen opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/20 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <img src={kmhLogo} alt="KMH Logo" className="w-20 h-20 object-contain" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-white/80 text-xs tracking-widest uppercase mb-6">
            {/* <Sparkles size={12} /> */}
            Keluarga Mahasiswa Hindu · Telkom University
          </div>
          <h1
            className="text-white mb-6"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            <BlurText as="span" text={heroTitle} />
            <br />
            <GradientText delay={0.35}>United in Dharma</GradientText>
          </h1>
          <p
            className="text-white/75 max-w-xl mx-auto mb-10"
            style={{ fontSize: "1.125rem", lineHeight: 1.7 }}
          >
            {heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={primary?.ctaUrl || "/about"}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                fontWeight: 600,
                boxShadow: "0 4px 20px rgba(180,83,9,0.35)",
              }}
            >
              {primary?.ctaText || "Discover KMH"} <ArrowRight size={16} />
            </Link>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm text-white border border-white/30 hover:bg-white/10 transition-all duration-200"
              style={{ fontWeight: 500 }}
            >
              View Events <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-white/40" />
        </div>
      </section>

      {/* ── About Preview ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div className="inline-block text-xs tracking-widest uppercase text-amber-600 mb-4" style={{ fontWeight: 600 }}>
                About KMH
              </div>
              <h2
                className="text-neutral-900 mb-6"
                style={{ fontSize: "2.25rem", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.02em" }}
              >
                Bersama Membangun
                <br />
                Generasi Berkarakter
              </h2>
              <p className="text-neutral-600 mb-4 leading-relaxed">
                Keluarga Mahasiswa Hindu (KMH) Telkom University adalah organisasi kemahasiswaan yang menjadi wadah bagi
                mahasiswa beragama Hindu untuk bersatu, berkembang, dan berbakti dalam lingkungan kampus.
              </p>
              <p className="text-neutral-600 mb-8 leading-relaxed">
                Berdiri atas dasar nilai-nilai dharma, KMH hadir untuk memfasilitasi pertumbuhan spiritual, pengembangan
                bakat, semangat kewirausahaan, serta pengabdian kepada masyarakat di lingkungan Telkom University dan sekitarnya.
              </p>
              {/* Quick stats (count-up saat masuk viewport) */}
              <div className="grid grid-cols-3 gap-4 mb-8 max-w-md">
                {[
                  { value: yearsActive, suffix: "+", label: "Tahun Berkarya" },
                  { value: divisions.length, suffix: "", label: "Divisi" },
                  { value: events.length, suffix: "", label: "Event" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-neutral-100 bg-neutral-50/60 px-4 py-4 text-center"
                  >
                    <div
                      className="text-neutral-900"
                      style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em" }}
                    >
                      <CountUp to={s.value} suffix={s.suffix} />
                    </div>
                    <div className="text-[11px] tracking-wide uppercase text-neutral-500 mt-1" style={{ fontWeight: 500 }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800 transition-colors"
                style={{ fontWeight: 600 }}
              >
                Learn More <ArrowRight size={16} />
              </Link>
            </Reveal>
            <Reveal delay={0.15} className="relative">
              <div
                className="absolute -inset-4 rounded-3xl opacity-60"
                style={{ background: "radial-gradient(ellipse at center, rgba(251,191,36,0.15) 0%, transparent 70%)" }}
              />
              <SmartImage
                src={ABOUT_IMAGE}
                alt="KMH Community"
                wrapperClassName="relative w-full h-80 rounded-2xl shadow-xl"
                imgClassName="w-full h-full object-cover rounded-2xl"
                placeholderClassName="bg-neutral-200 rounded-2xl"
              />
              <div
                className="absolute -bottom-4 -right-4 w-28 h-28 rounded-2xl bg-amber-500 flex flex-col items-center justify-center text-white shadow-lg z-10"
                style={{ boxShadow: "0 8px 24px rgba(180,83,9,0.3)" }}
              >
                <span className="text-2xl" style={{ fontWeight: 700 }}>
                  <CountUp to={divisions.length} />
                </span>
                <span className="text-[10px] tracking-wide text-amber-100 mt-0.5" style={{ fontWeight: 500 }}>DIVISIONS</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Organization Structure (Divisions) Section ── */}
      <section className="py-16 px-6 bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 gap-4">
            <div>
              <div className="inline-block text-xs tracking-widest uppercase text-amber-500 mb-2 font-semibold">
                Divisions & Structure
              </div>
              <h2 className="text-white text-3xl font-bold tracking-tight">
                Struktur Divisi Organisasi
              </h2>
            </div>
            <Link
              to="/divisions"
              className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 font-semibold transition-colors"
            >
              Lihat Selengkapnya <ChevronRight size={16} />
            </Link>
          </div>

          <OrganizationTree />
        </div>
      </section>

      {/* ── Hall of Fame CTA (museum 3D, aplikasi terpisah — tab baru) ── */}
      <section className="relative py-24 px-6 bg-neutral-950 overflow-hidden">
        {/* Glow emas lembut */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 70% at 50% 100%, rgba(212,175,55,0.12), transparent 70%)",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.04] pointer-events-none" />

        <Reveal as="div" className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-amber-500 mb-4 font-semibold">
            <Landmark size={14} /> KMH Hall of Fame
          </div>
          <h2
            className="text-white mb-4"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Berjalanlah Menembus Sejarah KMH
          </h2>
          <p className="text-neutral-400 leading-relaxed mb-3 max-w-xl mx-auto">
            Museum digital 3D interaktif: susuri koridor generasi demi generasi,
            temui para tokoh, saksikan prestasi mereka, dan lihat bagaimana satu
            generasi mewariskan tongkatnya ke generasi berikutnya.
          </p>
          <p
            className="text-amber-200/70 italic mb-10"
            style={{ fontFamily: "Georgia, serif" }}
          >
            “People build generations. Generations build legacies.”
          </p>
          <a
            href={HALL_OF_FAME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm text-neutral-950 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #f0d97a 0%, #d4af37 55%, #b8863b 100%)",
              fontWeight: 700,
              letterSpacing: "0.06em",
              boxShadow: "0 4px 30px rgba(212,175,55,0.35)",
            }}
          >
            MASUK MUSEUM <ArrowRight size={16} />
          </a>
          <p className="text-neutral-600 text-xs mt-4">Dibuka di tab baru</p>
        </Reveal>
      </section>

      {/* ── Events Preview ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-block text-xs tracking-widest uppercase text-amber-600 mb-3" style={{ fontWeight: 600 }}>
                Events
              </div>
              <h2 className="text-neutral-900" style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
                Upcoming Events
              </h2>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
              style={{ fontWeight: 500 }}
            >
              View All Events <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, i) => (
              <Reveal as="div" key={event.id} delay={i * 0.08}>
                <Link
                  to={`/events/${event.id}`}
                  className="group block bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:shadow-xl transition-all duration-300"
                  style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <SmartImage
                      src={event.image}
                      alt={event.name}
                      wrapperClassName="w-full h-full"
                      imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 z-10">
                      <span className={`text-xs px-2.5 py-1 rounded-full backdrop-blur-sm ${statusStyle(event.status)}`} style={{ fontWeight: 500 }}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-2">
                      <Calendar size={12} />
                      <span>{event.date}</span>
                      <span className="text-neutral-300">·</span>
                      <span>{event.year}</span>
                    </div>
                    <h3 className="text-neutral-900 group-hover:text-amber-700 transition-colors" style={{ fontSize: "1rem", fontWeight: 600, lineHeight: 1.3 }}>
                      {event.name}
                    </h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery Highlights ── */}
      <section className="py-24 px-6 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-block text-xs tracking-widest uppercase text-amber-600 mb-3" style={{ fontWeight: 600 }}>
                Gallery
              </div>
              <h2 className="text-neutral-900" style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
                Gallery Highlights
              </h2>
            </div>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
              style={{ fontWeight: 500 }}
            >
              View Gallery <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {highlightImages.map((img, i) => (
              <div
                key={img.id}
                className={`relative overflow-hidden rounded-2xl group cursor-pointer ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
              >
                <div className={i === 0 ? "h-full min-h-[300px]" : "aspect-square"}>
                  <SmartImage
                    src={img.src}
                    alt={img.event}
                    wrapperClassName="w-full h-full"
                    imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <p className="text-white text-xs truncate" style={{ fontWeight: 500 }}>{img.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      {/* <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="relative rounded-3xl px-8 py-16 overflow-hidden"
            style={{ background: "linear-gradient(135deg, #1c1917 0%, #292524 100%)", boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}
          >
            <div
              className="absolute inset-0 opacity-30"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(251,191,36,0.4) 0%, transparent 60%)" }}
            />
            <div className="relative z-10">
              <img src={kmhLogo} alt="KMH" className="w-14 h-14 mx-auto mb-6 object-contain opacity-80" style={{ filter: "invert(1) brightness(0.8)" }} />
              <h2 className="text-white mb-4" style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                Be Part of KMH
              </h2>
              <p className="text-neutral-400 mb-8 max-w-md mx-auto leading-relaxed">
                Join a family of Hindu students united by faith, creativity, and the spirit of service.
                Together, we grow — in dharma, in knowledge, and in community.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)", fontWeight: 600, boxShadow: "0 4px 20px rgba(180,83,9,0.4)" }}
              >
                Join Now <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
}
