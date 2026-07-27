import { Link } from "react-router";
import { Calendar, FileText, Mail, UsersRound } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { DataTable, type Column } from "../components/DataTable";
import { Badge } from "../../components/ui/badge";
import { useBlogPosts } from "../../../lib/api/hooks";
import {
  useAdminEvents,
  useAdminMembers,
  useContactMessages,
} from "../../../lib/api/admin-hooks";
import type { ContactMessage } from "../../../lib/api/types";

function StatCard({
  icon: Icon,
  label,
  value,
  to,
}: {
  icon: typeof Calendar;
  label: string;
  value: number | string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="rounded-xl border border-neutral-200 bg-white p-5 hover:border-amber-200 hover:shadow-sm transition-all"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-500">{label}</span>
        <Icon size={18} className="text-amber-500" />
      </div>
      <div className="mt-2 text-2xl font-semibold text-neutral-900">{value}</div>
    </Link>
  );
}

export function Dashboard() {
  const members = useAdminMembers();
  const events = useAdminEvents({ limit: 100 });
  const posts = useBlogPosts({ limit: 100 });
  const messages = useContactMessages({ limit: 100 });

  const upcomingCount = (events.data ?? []).filter(
    (e) => (e.status ?? "").toLowerCase() === "upcoming"
  ).length;
  const draftCount = (posts.data ?? []).filter(
    (p) => (p.status ?? "").toUpperCase() === "DRAFT"
  ).length;
  const unreadCount = (messages.data ?? []).filter((m) => !m.isRead).length;

  const recent = (messages.data ?? []).slice(0, 6);

  const columns: Column<ContactMessage>[] = [
    { key: "name", header: "Nama", cell: (m) => m.name || "—" },
    { key: "email", header: "Email", cell: (m) => m.email || "—" },
    { key: "subject", header: "Subjek", cell: (m) => m.subject || "—" },
    {
      key: "isRead",
      header: "Status",
      cell: (m) =>
        m.isRead ? (
          <Badge variant="secondary">Dibaca</Badge>
        ) : (
          <Badge className="bg-amber-500">Baru</Badge>
        ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Ringkasan konten & aktivitas KMH Tel-U"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard
          icon={UsersRound}
          label="Anggota"
          value={members.isLoading ? "…" : (members.data?.length ?? 0)}
          to="/admin/members"
        />
        <StatCard
          icon={Calendar}
          label="Event Mendatang"
          value={events.isLoading ? "…" : upcomingCount}
          to="/admin/events"
        />
        <StatCard
          icon={FileText}
          label="Draft Blog"
          value={posts.isLoading ? "…" : draftCount}
          to="/admin/blog"
        />
        <StatCard
          icon={Mail}
          label="Pesan Belum Dibaca"
          value={messages.isLoading ? "…" : unreadCount}
          to="/admin/contact-messages"
        />
      </div>

      <h2 className="text-sm font-semibold text-neutral-700 mb-3">
        Pesan Kontak Terbaru
      </h2>
      <DataTable
        columns={columns}
        rows={recent}
        isLoading={messages.isLoading}
        emptyText="Belum ada pesan masuk."
        rowKey={(m) => m.id}
      />
    </div>
  );
}
