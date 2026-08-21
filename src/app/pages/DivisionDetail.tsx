import { useParams, Link, Navigate } from "react-router";
import { ArrowLeft, ChevronRight, Star, Users } from "lucide-react";
import { SmartImage } from "../components/common/SmartImage";
import { Seo } from "../components/common/Seo";
import { useDivisionsView, useDivisionTeamView } from "../../lib/content";

const categoryColor = (cat: string) => {
  if (cat === "Core Management") return "bg-amber-50 text-amber-700 border border-amber-200";
  if (cat === "External Division") return "bg-blue-50 text-blue-700 border border-blue-200";
  return "bg-neutral-100 text-neutral-600 border border-neutral-200";
};

const categoryBadgeHero = (cat: string) => {
  if (cat === "Core Management") return "bg-amber-500/20 text-amber-200 border border-amber-400/30";
  if (cat === "External Division") return "bg-blue-500/20 text-blue-200 border border-blue-400/30";
  return "bg-white/10 text-white/80 border border-white/20";
};

const ALIAS_MAP: Record<string, string> = {
  humas: "hubungan-masyarakat",
  pmb: "pengembangan-minat-bakat",
  pengmas: "pengabdian-masyarakat",
  logtrans: "logistik-transportasi",
  "logistik-transport": "logistik-transportasi",
};

export function DivisionDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: divisions } = useDivisionsView();
  const realId = ALIAS_MAP[id || ""] || id;
  const division = divisions.find((d) => d.id === realId || d.id === id);

  // Seluruh anggota tertaut (member-divisi) + koordinator, bukan hanya
  // koordinator. Hook harus dipanggil sebelum early-return.
  const teamMembers = useDivisionTeamView(division);

  if (!division) return <Navigate to="/divisions" replace />;

  const otherDivisions = divisions.filter((d) => d.id !== id).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <Seo
        title={division.name}
        description={(division.shortDescription || division.description || "").slice(0, 160)}
        image={division.image}
        path={`/divisions/${division.id}`}
      />
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[380px] flex items-end justify-start overflow-hidden">
        <SmartImage
          src={division.image}
          alt={division.name}
          priority
          wrapperClassName="absolute inset-0 w-full h-full"
          imgClassName="w-full h-full object-cover"
          placeholderClassName="bg-neutral-800"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/85 z-10" />
        {/* Subtle amber glow at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40"
          style={{ background: "linear-gradient(to top, rgba(120,53,15,0.2), transparent)" }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-14 w-full">
          <Link
            to="/divisions"
            className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-6 transition-colors"
            style={{ fontWeight: 400 }}
          >
            <ArrowLeft size={14} />
            Back to Divisions
          </Link>
          <div className="mb-3">
            <span
              className={`text-xs px-3 py-1.5 rounded-full backdrop-blur-sm ${categoryBadgeHero(division.category)}`}
              style={{ fontWeight: 500 }}
            >
              {division.category}
            </span>
          </div>
          <h1
            className="text-white mb-3"
            style={{
              fontSize: "clamp(1.75rem, 5vw, 3rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            {division.name}
          </h1>
          <p className="text-white/70 max-w-xl" style={{ fontSize: "1rem", lineHeight: 1.6 }}>
            {division.shortDescription}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 py-16">
          {/* Left: Main content */}
          <div className="lg:col-span-2 space-y-14">
            {/* About */}
            <section>
              <div
                className="inline-block text-xs tracking-widest uppercase text-amber-600 mb-3"
                style={{ fontWeight: 600 }}
              >
                About the Division
              </div>
              <h2
                className="text-neutral-900 mb-5"
                style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.01em" }}
              >
                Who We Are
              </h2>
              <p className="text-neutral-600 leading-relaxed">{division.description}</p>
            </section>

            {/* Responsibilities (hanya tampil bila datanya ada) */}
            {division.responsibilities.length > 0 && (
              <>
            {/* Divider */}
            <div className="h-px bg-neutral-100" />

            <section>
              <div
                className="inline-block text-xs tracking-widest uppercase text-amber-600 mb-3"
                style={{ fontWeight: 600 }}
              >
                Responsibilities
              </div>
              <h2
                className="text-neutral-900 mb-6"
                style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.01em" }}
              >
                Core Responsibilities
              </h2>
              <div className="space-y-3">
                {division.responsibilities.map((resp, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-xl bg-neutral-50 border border-neutral-100 hover:border-amber-200 hover:bg-amber-50/30 transition-colors duration-200"
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 text-amber-800"
                      style={{
                        background: "linear-gradient(135deg, #fde68a, #fbbf24)",
                        fontWeight: 700,
                      }}
                    >
                      {i + 1}
                    </div>
                    <p className="text-neutral-700 text-sm leading-relaxed">{resp}</p>
                  </div>
                ))}
              </div>
            </section>
              </>
            )}

            {/* Programs (hanya tampil bila datanya ada) */}
            {division.programs.length > 0 && (
              <>
            {/* Divider */}
            <div className="h-px bg-neutral-100" />

            <section>
              <div
                className="inline-block text-xs tracking-widest uppercase text-amber-600 mb-3"
                style={{ fontWeight: 600 }}
              >
                Programs
              </div>
              <h2
                className="text-neutral-900 mb-6"
                style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.01em" }}
              >
                Main Programs
              </h2>
              <div className="space-y-4">
                {division.programs.map((prog, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl border border-neutral-100 hover:border-amber-200 hover:shadow-md transition-all duration-200"
                    style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: "linear-gradient(135deg, #fde68a, #f59e0b)" }}
                      >
                        <Star size={14} className="text-amber-800" />
                      </div>
                      <div>
                        <h3
                          className="text-neutral-900 mb-1"
                          style={{ fontSize: "0.9375rem", fontWeight: 600 }}
                        >
                          {prog.name}
                        </h3>
                        <p className="text-neutral-500 text-sm leading-relaxed">
                          {prog.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
              </>
            )}

            {/* Divider */}
            <div className="h-px bg-neutral-100" />

            {/* Members */}
            <section>
              <div
                className="inline-block text-xs tracking-widest uppercase text-amber-600 mb-3"
                style={{ fontWeight: 600 }}
              >
                Team
              </div>
              <h2
                className="text-neutral-900 mb-6"
                style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.01em" }}
              >
                Division Members
              </h2>
              {teamMembers.length === 0 && (
                <p className="text-sm text-neutral-400">
                  Belum ada anggota yang tercatat di divisi ini.
                </p>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {teamMembers.map((member, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center text-center p-5 rounded-2xl border border-neutral-100 hover:border-amber-200 hover:shadow-md transition-all duration-200"
                    style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
                  >
                    <div className="relative mb-3">
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-16 h-16 rounded-full object-cover"
                        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                      />
                      <div
                        className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)" }}
                      >
                        <Users size={9} className="text-white" />
                      </div>
                    </div>
                    <p className="text-neutral-900 text-sm" style={{ fontWeight: 600 }}>
                      {member.name}
                    </p>
                    <p className="text-neutral-400 text-xs mt-0.5">{member.role}</p>
                    {member.academic && (
                      <p
                        className="text-amber-700/80 text-[11px] mt-1"
                        title={member.faculty}
                      >
                        {member.academic}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right: Sidebar (sticky sebagai satu blok di layar besar) */}
          <div className="space-y-6 self-start lg:sticky lg:top-24">
            {/* Quick Info Card */}
            <div
              className="rounded-2xl p-6 border border-neutral-100 bg-white"
              style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
            >
              <h3
                className="text-neutral-900 mb-4"
                style={{ fontSize: "0.9375rem", fontWeight: 700 }}
              >
                Division Info
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-neutral-50">
                  <span className="text-xs text-neutral-400" style={{ fontWeight: 500 }}>
                    Category
                  </span>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full ${categoryColor(division.category)}`}
                    style={{ fontWeight: 500 }}
                  >
                    {division.category}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-neutral-50">
                  <span className="text-xs text-neutral-400" style={{ fontWeight: 500 }}>
                    Members
                  </span>
                  <span className="text-xs text-neutral-700" style={{ fontWeight: 600 }}>
                    {teamMembers.length} listed
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-neutral-50">
                  <span className="text-xs text-neutral-400" style={{ fontWeight: 500 }}>
                    Programs
                  </span>
                  <span className="text-xs text-neutral-700" style={{ fontWeight: 600 }}>
                    {division.programs.length} active
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6 space-y-3">
                <Link
                  to="/contact"
                  className="block w-full text-center py-3 rounded-full text-sm text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                    fontWeight: 600,
                    boxShadow: "0 4px 16px rgba(180,83,9,0.25)",
                  }}
                >
                  Join This Division
                </Link>
                <a
                  href="mailto:kmh@telkomuniversity.ac.id"
                  className="block w-full text-center py-3 rounded-full text-sm text-neutral-700 border border-neutral-200 hover:border-amber-300 hover:text-amber-700 transition-all duration-200"
                  style={{ fontWeight: 500 }}
                >
                  Contact Us
                </a>
              </div>
            </div>

            {/* Other Divisions */}
            <div>
              <h3
                className="text-neutral-900 mb-4 px-1"
                style={{ fontSize: "0.875rem", fontWeight: 700 }}
              >
                Other Divisions
              </h3>
              <div className="space-y-2">
                {otherDivisions.map((d) => (
                  <Link
                    key={d.id}
                    to={`/divisions/${d.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl border border-neutral-100 hover:border-amber-200 hover:shadow-sm transition-all duration-200 group"
                  >
                    <img
                      src={d.image}
                      alt={d.name}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-neutral-800 text-xs truncate group-hover:text-amber-700 transition-colors"
                        style={{ fontWeight: 600 }}
                      >
                        {d.name}
                      </p>
                      <p className="text-neutral-400 text-[11px] truncate">{d.category}</p>
                    </div>
                    <ChevronRight
                      size={14}
                      className="text-neutral-300 group-hover:text-amber-400 transition-colors shrink-0"
                    />
                  </Link>
                ))}
              </div>
              <Link
                to="/divisions"
                className="block text-center mt-4 text-xs text-amber-600 hover:text-amber-700 transition-colors"
                style={{ fontWeight: 600 }}
              >
                View All Divisions →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
