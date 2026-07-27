import { useParams, Link, Navigate } from "react-router";
import { ArrowLeft, Calendar, MapPin, Users } from "lucide-react";
import { SmartImage } from "../components/common/SmartImage";
import { Seo } from "../components/common/Seo";
import { useDivisionsView, useEventsView } from "../../lib/content";

const statusStyle = (status: string) =>
  status === "Upcoming"
    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
    : "bg-neutral-100 text-neutral-500 border border-neutral-200";

const statusDot = (status: string) =>
  status === "Upcoming" ? "bg-emerald-400" : "bg-neutral-400";

export function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: events } = useEventsView();
  const { data: divisions } = useDivisionsView();
  const event = events.find((e) => e.id === id);

  if (!event) return <Navigate to="/events" replace />;

  const relatedDivision = divisions.find((d) => d.id === event.divisionId);
  const relatedEvents = events.filter((e) => e.id !== id).slice(0, 3);

  const eventJsonLd = event.startISO
    ? {
        "@context": "https://schema.org",
        "@type": "Event",
        name: event.name,
        startDate: event.startISO,
        ...(event.endISO ? { endDate: event.endISO } : {}),
        eventStatus:
          event.status === "Upcoming"
            ? "https://schema.org/EventScheduled"
            : "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        ...(event.location
          ? { location: { "@type": "Place", name: event.location } }
          : {}),
        ...(event.image ? { image: [event.image] } : {}),
        description: event.description,
        organizer: {
          "@type": "Organization",
          name: "Keluarga Mahasiswa Hindu Telkom University",
        },
      }
    : undefined;

  return (
    <div className="min-h-screen bg-white">
      <Seo
        title={event.name}
        description={(event.description || "").slice(0, 160)}
        image={event.image}
        type="article"
        path={`/events/${event.id}`}
        jsonLd={eventJsonLd}
      />
      {/* Hero Image */}
      <section className="relative h-[55vh] min-h-[380px] flex items-end justify-start overflow-hidden">
        <SmartImage
          src={event.image}
          alt={event.name}
          priority
          wrapperClassName="absolute inset-0 w-full h-full"
          imgClassName="w-full h-full object-cover"
          placeholderClassName="bg-neutral-800"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/85 z-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-14 w-full">
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Events
          </Link>

          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full backdrop-blur-sm ${statusStyle(
                event.status
              )}`}
              style={{ fontWeight: 500 }}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusDot(event.status)}`} />
              {event.status}
            </span>
            <span
              className="text-xs px-3 py-1.5 rounded-full bg-white/10 text-white/80 border border-white/20 backdrop-blur-sm"
              style={{ fontWeight: 500 }}
            >
              {event.year}
            </span>
          </div>

          <h1
            className="text-white mb-4"
            style={{
              fontSize: "clamp(1.75rem, 5vw, 3rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            {event.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 text-white/70 text-sm">
              <Calendar size={14} />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/70 text-sm">
              <MapPin size={14} />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 py-16">
          {/* Main */}
          <div className="lg:col-span-2 space-y-14">
            {/* Event Info */}
            <section>
              <div
                className="inline-block text-xs tracking-widest uppercase text-amber-600 mb-3"
                style={{ fontWeight: 600 }}
              >
                Event Information
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg, #fde68a, #fbbf24)" }}
                  >
                    <Calendar size={15} className="text-amber-800" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 mb-0.5" style={{ fontWeight: 500 }}>
                      Date
                    </p>
                    <p className="text-neutral-800 text-sm" style={{ fontWeight: 600 }}>
                      {event.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg, #fde68a, #fbbf24)" }}
                  >
                    <MapPin size={15} className="text-amber-800" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 mb-0.5" style={{ fontWeight: 500 }}>
                      Location
                    </p>
                    <p className="text-neutral-800 text-sm" style={{ fontWeight: 600 }}>
                      {event.location}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Description */}
            <section>
              <div
                className="inline-block text-xs tracking-widest uppercase text-amber-600 mb-3"
                style={{ fontWeight: 600 }}
              >
                Description
              </div>
              <h2
                className="text-neutral-900 mb-5"
                style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.01em" }}
              >
                About This Event
              </h2>
              <p className="text-neutral-600 leading-relaxed">{event.description}</p>
            </section>

            {/* Gallery Preview */}
            {event.gallery && event.gallery.length > 0 && (
              <>
                <div className="h-px bg-neutral-100" />
                <section>
                  <div
                    className="inline-block text-xs tracking-widest uppercase text-amber-600 mb-3"
                    style={{ fontWeight: 600 }}
                  >
                    Gallery
                  </div>
                  <h2
                    className="text-neutral-900 mb-6"
                    style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.01em" }}
                  >
                    Event Gallery
                  </h2>
                  <div
                    className={`grid gap-3 ${
                      event.gallery.length === 1
                        ? "grid-cols-1"
                        : event.gallery.length === 2
                        ? "grid-cols-2"
                        : "grid-cols-2 md:grid-cols-3"
                    }`}
                  >
                    {event.gallery.map((img, i) => (
                      <div
                        key={i}
                        className={`relative overflow-hidden rounded-2xl group cursor-pointer ${
                          i === 0 && event.gallery.length >= 3 ? "col-span-2 md:col-span-1 md:row-span-1" : ""
                        }`}
                      >
                        <div className="aspect-[4/3]">
                          <img
                            src={img}
                            alt={`${event.name} ${i + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/gallery"
                    className="inline-flex items-center gap-1.5 mt-6 text-sm text-amber-600 hover:text-amber-700 transition-colors"
                    style={{ fontWeight: 500 }}
                  >
                    View Full Gallery →
                  </Link>
                </section>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Division */}
            {relatedDivision && (
              <div
                className="rounded-2xl overflow-hidden border border-neutral-100"
                style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
              >
                <div className="relative h-28 overflow-hidden">
                  <img
                    src={relatedDivision.image}
                    alt={relatedDivision.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <p className="text-white text-[10px] tracking-widest uppercase" style={{ fontWeight: 600 }}>
                      Organized by
                    </p>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "linear-gradient(135deg, #fde68a, #f59e0b)" }}
                    >
                      <Users size={14} className="text-amber-800" />
                    </div>
                    <div>
                      <p className="text-neutral-900 text-sm" style={{ fontWeight: 600 }}>
                        {relatedDivision.name}
                      </p>
                      <p className="text-neutral-400 text-xs mt-0.5">{relatedDivision.category}</p>
                    </div>
                  </div>
                  <Link
                    to={`/divisions/${relatedDivision.id}`}
                    className="block mt-4 w-full text-center py-2.5 rounded-full text-xs border border-neutral-200 text-neutral-600 hover:border-amber-300 hover:text-amber-700 transition-all duration-200"
                    style={{ fontWeight: 500 }}
                  >
                    View Division →
                  </Link>
                </div>
              </div>
            )}

            {/* More Events */}
            <div>
              <h3
                className="text-neutral-900 mb-4 px-1"
                style={{ fontSize: "0.875rem", fontWeight: 700 }}
              >
                More Events
              </h3>
              <div className="space-y-3">
                {relatedEvents.map((e) => (
                  <Link
                    key={e.id}
                    to={`/events/${e.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl border border-neutral-100 hover:border-amber-200 hover:shadow-sm transition-all duration-200 group"
                  >
                    <img
                      src={e.image}
                      alt={e.name}
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-neutral-800 text-xs truncate group-hover:text-amber-700 transition-colors"
                        style={{ fontWeight: 600 }}
                      >
                        {e.name}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span
                          className={`inline-block w-1.5 h-1.5 rounded-full ${statusDot(e.status)}`}
                        />
                        <p className="text-neutral-400 text-[11px]">{e.status}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                to="/events"
                className="block text-center mt-4 text-xs text-amber-600 hover:text-amber-700 transition-colors"
                style={{ fontWeight: 600 }}
              >
                View All Events →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
