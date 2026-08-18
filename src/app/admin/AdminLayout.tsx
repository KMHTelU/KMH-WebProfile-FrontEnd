import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import {
  Boxes,
  Building2,
  Calendar,
  ChevronsUpDown,
  ExternalLink,
  Image,
  Images,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  Shield,
  Tags,
  Trophy,
  Users,
  UsersRound,
} from "lucide-react";
import kmhLogo from "../../assets/KMH.png";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { ChangePasswordDialog } from "./components/ChangePasswordDialog";
import { useAuth } from "../../lib/auth/useAuth";
import { useContactMessages } from "../../lib/api/admin-hooks";

interface NavItem {
  to: string;
  label: string;
  icon: typeof Calendar;
  end?: boolean;
  badge?: number;
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Utama",
    items: [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true }],
  },
  {
    label: "Konten",
    items: [
      { to: "/admin/banners", label: "Banner", icon: Image },
      { to: "/admin/events", label: "Events", icon: Calendar },
      { to: "/admin/blog", label: "Blog", icon: Newspaper },
      { to: "/admin/blog-taxonomy", label: "Kategori & Tag", icon: Tags },
      { to: "/admin/galleries", label: "Galeri", icon: Images },
    ],
  },
  {
    label: "Organisasi",
    items: [
      { to: "/admin/divisions", label: "Divisi", icon: Boxes },
      { to: "/admin/members", label: "Anggota", icon: UsersRound },
      { to: "/admin/hall-of-fame", label: "Hall of Fame", icon: Trophy },
      { to: "/admin/organization", label: "Profil Organisasi", icon: Building2 },
      { to: "/admin/contact-messages", label: "Pesan Kontak", icon: Mail },
    ],
  },
  {
    label: "Sistem",
    items: [
      { to: "/admin/users", label: "Users", icon: Users },
      { to: "/admin/roles", label: "Roles", icon: Shield },
    ],
  },
];

const allNavItems = navGroups.flatMap((g) => g.items);

function initials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "A"
  );
}

function NavList({
  unreadCount,
  onNavigate,
}: {
  unreadCount: number;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-5 px-3">
      {navGroups.map((group) => (
        <div key={group.label}>
          <div className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
            {group.label}
          </div>
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-amber-500/10 text-amber-400 font-medium"
                      : "text-neutral-400 hover:bg-white/5 hover:text-neutral-100"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-amber-400" />
                    )}
                    <item.icon size={17} />
                    <span className="flex-1">{item.label}</span>
                    {item.to === "/admin/contact-messages" && unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-amber-500 text-[11px] font-semibold text-neutral-950">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/5">
      <img src={kmhLogo} alt="KMH" className="w-8 h-8 object-contain" />
      <div className="leading-none">
        <div className="text-sm font-semibold text-white">KMH Tel-U</div>
        <div className="text-[11px] tracking-wider uppercase text-neutral-500 mt-1">
          Admin Panel
        </div>
      </div>
    </div>
  );
}

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);

  // Sinkron dengan query Dashboard (key sama) sehingga tidak menambah fetch.
  const { data: messages } = useContactMessages({ limit: 100 });
  const unreadCount = (messages ?? []).filter((m) => !m.isRead).length;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // Judul halaman aktif untuk topbar (prefix path terpanjang yang cocok).
  const current = allNavItems
    .filter((i) =>
      i.end ? location.pathname === i.to : location.pathname.startsWith(i.to)
    )
    .sort((a, b) => b.to.length - a.to.length)[0];

  const displayName = user?.name || user?.email || "Admin";
  const roleName = user?.role?.name || "Pengguna";

  const userMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 hover:bg-white/5 transition-colors text-left"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-neutral-950">
            {initials(displayName)}
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-sm font-medium text-white">
              {displayName}
            </span>
            <span className="block truncate text-xs text-neutral-500">
              {roleName}
            </span>
          </span>
          <ChevronsUpDown size={14} className="text-neutral-500" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-56">
        <DropdownMenuLabel className="truncate">
          {user?.email || displayName}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setPwdOpen(true)}>
          <KeyRound size={15} /> Ganti Password
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/")}>
          <ExternalLink size={15} /> Lihat Situs
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={handleLogout}
        >
          <LogOut size={15} /> Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="min-h-screen bg-neutral-100/70 flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 bg-neutral-950 fixed inset-y-0 left-0 z-40">
        <Brand />
        <div className="flex-1 overflow-y-auto py-5">
          <NavList unreadCount={unreadCount} />
        </div>
        <div className="border-t border-white/5 p-2.5">{userMenu}</div>
      </aside>

      {/* Konten */}
      <div className="flex-1 lg:pl-64 min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-8 bg-white/85 backdrop-blur border-b border-neutral-200">
          <div className="flex items-center gap-2.5">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="p-0 w-72 bg-neutral-950 border-neutral-800 [&>button]:text-neutral-400"
              >
                <SheetTitle className="sr-only">Menu Admin</SheetTitle>
                <div className="flex h-full flex-col">
                  <Brand />
                  <div className="flex-1 overflow-y-auto py-5">
                    <NavList
                      unreadCount={unreadCount}
                      onNavigate={() => setMobileOpen(false)}
                    />
                  </div>
                  <div className="border-t border-white/5 p-2.5">{userMenu}</div>
                </div>
              </SheetContent>
            </Sheet>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-neutral-900">
                {current?.label ?? "Admin"}
              </div>
              <div className="text-xs text-neutral-400 hidden sm:block">
                Panel pengelolaan konten & data KMH Tel-U
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex"
              onClick={() => window.open("/", "_blank")}
            >
              <ExternalLink size={14} /> Lihat Situs
            </Button>
            {/* Avatar cepat di topbar untuk layar kecil */}
            <div className="lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-neutral-950"
                    aria-label="Menu akun"
                  >
                    {initials(displayName)}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="truncate">
                    {user?.email || displayName}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setPwdOpen(true)}>
                    <KeyRound size={15} /> Ganti Password
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/")}>
                    <ExternalLink size={15} /> Lihat Situs
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                    <LogOut size={15} /> Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 max-w-6xl">
          <Outlet />
        </main>
      </div>

      <ChangePasswordDialog open={pwdOpen} onOpenChange={setPwdOpen} />
    </div>
  );
}
