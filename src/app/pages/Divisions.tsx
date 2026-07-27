import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { SmartImage } from "../components/common/SmartImage";
import { Seo } from "../components/common/Seo";
import { useDivisionsView } from "../../lib/content";

const HERO_IMAGE = "https://images.unsplash.com/photo-1708578200684-3aa944b73237?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920";

const categoryColor = (cat: string) => {
  if (cat === "Core Management") return "bg-amber-50 text-amber-700 border border-amber-200";
  if (cat === "External Division") return "bg-blue-50 text-blue-700 border border-blue-200";
  return "bg-neutral-100 text-neutral-600 border border-neutral-200";
};

export function Divisions() {
  const { data: divisions } = useDivisionsView();
  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="Divisi"
        description="Kenali divisi-divisi di Keluarga Mahasiswa Hindu Telkom University beserta program dan kegiatannya."
        path="/divisions"
      />
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[320px] flex items-end justify-start overflow-hidden">
        <img src={HERO_IMAGE} alt="Divisions" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/30 to-black/80" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-12 w-full">
          <div className="inline-block text-xs tracking-widest uppercase text-amber-400 mb-3" style={{ fontWeight: 600 }}>
            Organization
          </div>
          <h1
            className="text-white mb-2"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15 }}
          >
            Our Divisions
          </h1>
          <p className="text-white/70 max-w-lg" style={{ fontSize: "1rem" }}>
            Nine specialized divisions working together in harmony to fulfill KMH's mission.
          </p>
        </div>
      </section>

      {/* Divisions Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Category Legend */}
          <div className="flex flex-wrap items-center gap-3 mb-12">
            <span className="text-xs text-neutral-400" style={{ fontWeight: 500 }}>Categories:</span>
            {["Core Management", "Internal Division", "External Division"].map((cat) => (
              <span key={cat} className={`text-xs px-3 py-1 rounded-full ${categoryColor(cat)}`} style={{ fontWeight: 500 }}>
                {cat}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {divisions.map((div) => (
              <Link
                key={div.id}
                to={`/divisions/${div.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:border-amber-200 hover:shadow-xl transition-all duration-300"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
              >
                <div className="relative h-44 overflow-hidden">
                  <SmartImage
                    src={div.image}
                    alt={div.name}
                    wrapperClassName="w-full h-full"
                    imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                  <div className="absolute top-3 left-3 z-20">
                    <span className={`text-xs px-2.5 py-1 rounded-full backdrop-blur-sm ${categoryColor(div.category)}`} style={{ fontWeight: 500 }}>
                      {div.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className="text-neutral-900 group-hover:text-amber-700 transition-colors"
                      style={{ fontSize: "1rem", fontWeight: 600 }}
                    >
                      {div.name}
                    </h3>
                    <ChevronRight
                      size={16}
                      className="text-neutral-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all duration-200 shrink-0 mt-0.5"
                    />
                  </div>
                  <p className="text-neutral-500 text-sm mt-2 leading-relaxed line-clamp-2">
                    {div.shortDescription}
                  </p>
                  <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-xs text-neutral-400">
                      {div.members.length} members
                    </span>
                    <span className="text-xs text-amber-600 group-hover:text-amber-700 transition-colors" style={{ fontWeight: 500 }}>
                      View Details →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
