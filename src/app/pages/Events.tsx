import { useState } from "react";
import { Link } from "react-router";
import { Calendar, MapPin, ChevronRight, Filter } from "lucide-react";
import { SmartImage } from "../components/common/SmartImage";
import { Seo } from "../components/common/Seo";
import { useEventsView } from "../../lib/content";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1735713212111-e39b9cbcdbea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920";

const statusStyle = (status: string) =>
  status === "Upcoming"
    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
    : "bg-neutral-100 text-neutral-500 border border-neutral-200";

const statusDot = (status: string) =>
  status === "Upcoming" ? "bg-emerald-400" : "bg-neutral-400";

export function Events() {
  const { data: events } = useEventsView();
  const years = [...new Set(events.map((e) => e.year))].sort((a, b) => b - a);
  const [filterYear, setFilterYear] = useState<number | "all">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "Upcoming" | "Completed">("all");

  const filtered = events.filter((e) => {
    const yearMatch = filterYear === "all" || e.year === filterYear;
    const statusMatch = filterStatus === "all" || e.status === filterStatus;
    return yearMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="Event"
        description="Dokumentasi dan agenda kegiatan Keluarga Mahasiswa Hindu Telkom University — dari acara keagamaan, budaya, hingga sosial."
        path="/events"
      />
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[320px] flex items-end justify-start overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Events"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/30 to-black/85" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-12 w-full">
          <div
            className="inline-block text-xs tracking-widest uppercase text-amber-400 mb-3"
            style={{ fontWeight: 600 }}
          >
            Activities
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
            Events
          </h1>
          <p className="text-white/70 max-w-lg" style={{ fontSize: "1rem" }}>
            Explore KMH's spiritual, cultural, and community events — past and upcoming.
          </p>
        </div>
      </section>

      {/* Filter */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-neutral-400 mr-1">
              <Filter size={13} />
              <span style={{ fontWeight: 500 }}>Filter</span>
            </div>

            {/* Year filter */}
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

            {/* Divider */}
            <div className="w-px h-4 bg-neutral-200" />

            {/* Status filter */}
            <div className="flex items-center gap-2">
              {(["all", "Upcoming", "Completed"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all duration-150 ${
                    filterStatus === s
                      ? s === "Upcoming"
                        ? "bg-emerald-600 text-white"
                        : s === "Completed"
                        ? "bg-neutral-700 text-white"
                        : "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                  }`}
                  style={{ fontWeight: 500 }}
                >
                  {s === "all" ? "All Status" : s}
                </button>
              ))}
            </div>

            <span className="ml-auto text-xs text-neutral-400">
              {filtered.length} event{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-neutral-400 text-sm">No events found for the selected filters.</p>
              <button
                onClick={() => {
                  setFilterYear("all");
                  setFilterStatus("all");
                }}
                className="mt-4 text-xs text-amber-600 hover:text-amber-700 underline transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:border-amber-200 hover:shadow-xl transition-all duration-300"
                  style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <SmartImage
                      src={event.image}
                      alt={event.name}
                      wrapperClassName="w-full h-full"
                      imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                    <div className="absolute top-3 left-3 z-20">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full backdrop-blur-sm ${statusStyle(
                          event.status
                        )}`}
                        style={{ fontWeight: 500 }}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${statusDot(event.status)}`}
                        />
                        {event.status}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 z-20">
                      <span
                        className="text-xs px-2.5 py-1 rounded-full bg-black/40 text-white backdrop-blur-sm"
                        style={{ fontWeight: 500 }}
                      >
                        {event.year}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3
                      className="text-neutral-900 group-hover:text-amber-700 transition-colors mb-3"
                      style={{ fontSize: "1rem", fontWeight: 600, lineHeight: 1.35 }}
                    >
                      {event.name}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-neutral-400">
                        <Calendar size={12} className="shrink-0" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-400">
                        <MapPin size={12} className="shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-xs text-amber-600 group-hover:text-amber-700 transition-colors" style={{ fontWeight: 500 }}>
                        View Details
                      </span>
                      <ChevronRight
                        size={14}
                        className="text-neutral-300 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all duration-200"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
