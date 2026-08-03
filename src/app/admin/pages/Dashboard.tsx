import type { ReactNode } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  CalendarPlus,
  FilePlus2,
  FileText,
  Mail,
  MapPin,
  UserPlus,
  UsersRound,
} from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { useBlogPosts } from "../../../lib/api/hooks";
import {
  useAdminEvents,
  useAdminMembers,
  useContactMessages,
} from "../../../lib/api/admin-hooks";
import { useAuth } from "../../../lib/auth/useAuth";

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  to,
  tone,
}: {
  icon: typeof Calendar;
  label: string;
  value: number | string;
  hint?: string;
  to: string;
  tone: "amber" | "blue" | "violet" | "emerald";
}) {
  const tones: Record<string, string> = {
    amber: "bg-amber-100 text-amber-600",
    blue: "bg-sky-100 text-sky-600",
    violet: "bg-violet-100 text-violet-600",
    emerald: "bg-emerald-100 text-emerald-600",
  };
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-neutral-200 bg-white p-5 hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      <div className="flex items-start justify-between">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}
        >
          <Icon size={19} />
        </span>
        <ArrowUpRight
          size={16}
          className="text-neutral-300 group-hover:text-neutral-500 transition-colors"
        />
      </div>
      <div className="mt-4 text-2xl font-semibold text-neutral-900">{value}</div>
      <div className="text-sm text-neutral-500">{label}</div>
      {hint && <div className="mt-1 text-xs text-neutral-400">{hint}</div>}
    </Link>
  );
}

function QuickAction({
  icon: Icon,
  label,
  to,
}: {
  icon: typeof Calendar;
  label: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700 hover:border-amber-300 hover:bg-amber-50/50 transition-colors"
    >
      <Icon size={16} className="text-amber-500" />
      {label}
    </Link>
  );
}

function Panel({
  title,
  to,
  toLabel,
  children,
}: {
  title: string;
  to: string;
  toLabel: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
      <header className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-100">
        <h2 className="text-sm font-semibold text-neutral-800">{title}</h2>
        <Link
          to={to}
          className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-700"
        >
          {toLabel} <ArrowRight size={13} />
        </Link>
      </header>
      {children}
    </section>
  );
}

const dateFmt = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
});

export function Dashboard() {
  const { user } = useAuth();
  const members = useAdminMembers({ limit: 200 });
  const events = useAdminEvents({ limit: 100 });
  const posts = useBlogPosts({ limit: 100 });
  const messages = useContactMessages({ limit: 100 });

  const memberList = members.data ?? [];
  const activeMembers = memberList.filter((m) => m.isActive).length;

  const upcoming = (events.data ?? [])
    .filter((e) => (e.status ?? "").toLowerCase() === "upcoming")
    .sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? ""));

  const postList = posts.data ?? [];
  const publishedCount = postList.filter(
    (p) => (p.status ?? "").toUpperCase() === "PUBLISHED"
  ).length;
  const draftCount = postList.filter(
    (p) => (p.status ?? "").toUpperCase() === "DRAFT"
  ).length;

  const unread = (messages.data ?? []).filter((m) => !m.isRead);
  const recentMessages = (messages.data ?? []).slice(0, 5);

  const firstName = (user?.name || "Admin").split(/\s+/)[0];
  const today = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="space-y-8">
      {/* Sapaan */}
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">
          Selamat datang, {firstName} 👋
        </h1>
        <p className="text-sm text-neutral-500 mt-1">{today}</p>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={UsersRound}
          label="Anggota Aktif"
          value={members.isLoading ? "…" : activeMembers}
          hint={members.isLoading ? undefined : `dari ${memberList.length} total`}
          to="/admin/members"
          tone="amber"
        />
        <StatCard
          icon={Calendar}
          label="Event Mendatang"
          value={events.isLoading ? "…" : upcoming.length}
          to="/admin/events"
          tone="blue"
        />
        <StatCard
          icon={FileText}
          label="Artikel Terbit"
          value={posts.isLoading ? "…" : publishedCount}
          hint={posts.isLoading ? undefined : `${draftCount} draft menunggu`}
          to="/admin/blog"
          tone="violet"
        />
        <StatCard
          icon={Mail}
          label="Pesan Belum Dibaca"
          value={messages.isLoading ? "…" : unread.length}
          to="/admin/contact-messages"
          tone="emerald"
        />
      </div>

      {/* Aksi cepat */}
      <div>
        <h2 className="text-sm font-semibold text-neutral-700 mb-3">
          Aksi Cepat
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickAction icon={CalendarPlus} label="Event Baru" to="/admin/events" />
          <QuickAction icon={FilePlus2} label="Artikel Baru" to="/admin/blog/new" />
          <QuickAction icon={UserPlus} label="Anggota Baru" to="/admin/members" />
          <QuickAction icon={UsersRound} label="Import Anggota" to="/admin/members" />
        </div>
      </div>

      {/* Dua kolom: pesan & event */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Panel
          title="Pesan Kontak Terbaru"
          to="/admin/contact-messages"
          toLabel="Lihat semua"
        >
          {messages.isLoading ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 rounded bg-neutral-100 animate-pulse" />
              ))}
            </div>
          ) : recentMessages.length === 0 ? (
            <p className="p-6 text-sm text-neutral-400 text-center">
              Belum ada pesan masuk.
            </p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {recentMessages.map((m) => (
                <li key={m.id} className="flex items-center gap-3 px-5 py-3">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      m.isRead ? "bg-neutral-200" : "bg-amber-500"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-neutral-800">
                        {m.name || "Tanpa nama"}
                      </span>
                      {!m.isRead && (
                        <Badge className="bg-amber-500 text-[10px] px-1.5 py-0">
                          Baru
                        </Badge>
                      )}
                    </div>
                    <div className="truncate text-xs text-neutral-500">
                      {m.subject || m.message || "—"}
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-neutral-400">
                    {m.createdAt ? dateFmt.format(new Date(m.createdAt)) : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Event Terdekat" to="/admin/events" toLabel="Kelola event">
          {events.isLoading ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 rounded bg-neutral-100 animate-pulse" />
              ))}
            </div>
          ) : upcoming.length === 0 ? (
            <p className="p-6 text-sm text-neutral-400 text-center">
              Tidak ada event mendatang.
            </p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {upcoming.slice(0, 5).map((e) => {
                const d = e.startTime ? new Date(e.startTime) : null;
                return (
                  <li key={e.id} className="flex items-center gap-3.5 px-5 py-3">
                    <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-neutral-50 border border-neutral-200">
                      <span className="text-sm font-semibold text-neutral-900 leading-none">
                        {d ? d.getDate() : "—"}
                      </span>
                      <span className="text-[10px] uppercase text-neutral-500 mt-0.5">
                        {d
                          ? d.toLocaleDateString("id-ID", { month: "short" })
                          : ""}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-neutral-800">
                        {e.title || "—"}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-neutral-500">
                        {e.location && (
                          <>
                            <MapPin size={11} />
                            <span className="truncate">{e.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {e.isPublished ? (
                      <Badge className="bg-emerald-500 shrink-0">Publik</Badge>
                    ) : (
                      <Badge variant="secondary" className="shrink-0">
                        Draft
                      </Badge>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
