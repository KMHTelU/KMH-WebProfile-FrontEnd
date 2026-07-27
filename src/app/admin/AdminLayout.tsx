import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import {
  Calendar,
  FileText,
  Home,
  Image,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  Shield,
  Tags,
  Users,
  UsersRound,
} from "lucide-react";
import kmhLogo from "../../assets/KMH.png";
import { Button } from "../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { useAuth } from "../../lib/auth/useAuth";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/banners", label: "Banner", icon: Image },
  { to: "/admin/divisions", label: "Divisi", icon: LayoutDashboard },
  { to: "/admin/members", label: "Anggota", icon: UsersRound },
  { to: "/admin/events", label: "Events", icon: Calendar },
  { to: "/admin/blog", label: "Blog", icon: Newspaper },
  { to: "/admin/blog-taxonomy", label: "Kategori & Tag", icon: Tags },
  { to: "/admin/galleries", label: "Galeri", icon: Image },
  { to: "/admin/organization", label: "Profil Organisasi", icon: FileText },
  { to: "/admin/contact-messages", label: "Pesan Kontak", icon: Mail },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/roles", label: "Roles", icon: Shield },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-0.5 px-3">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              isActive
                ? "bg-amber-50 text-amber-800 font-medium"
                : "text-neutral-600 hover:bg-neutral-100"
            }`
          }
        >
          <item.icon size={17} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-5 h-16 border-b border-neutral-100">
      <img src={kmhLogo} alt="KMH" className="w-8 h-8 object-contain" />
      <div className="leading-none">
        <div className="text-[11px] tracking-widest uppercase text-neutral-400">
          Admin
        </div>
        <div className="text-sm font-semibold text-neutral-800">KMH Tel-U</div>
      </div>
    </div>
  );
}

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex lg:flex-col w-60 shrink-0 border-r border-neutral-200 bg-white fixed inset-y-0 left-0">
        <Brand />
        <div className="flex-1 overflow-y-auto py-4">
          <NavList />
        </div>
        <div className="border-t border-neutral-100 p-3">
          <Button
            variant="ghost"
            className="w-full justify-start text-neutral-600"
            onClick={handleLogout}
          >
            <LogOut size={17} /> Keluar
          </Button>
        </div>
      </aside>

      {/* Konten */}
      <div className="flex-1 lg:pl-60 min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-8 bg-white/90 backdrop-blur border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <SheetTitle className="sr-only">Menu Admin</SheetTitle>
                <Brand />
                <div className="py-4">
                  <NavList onNavigate={() => setMobileOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
            <span className="text-sm text-neutral-400 hidden sm:inline">
              Panel Pengelolaan Konten
            </span>
          </div>
          <div className="flex items-center gap-3">
            <NavLink
              to="/"
              className="text-sm text-neutral-500 hover:text-neutral-800 inline-flex items-center gap-1.5"
            >
              <Home size={15} /> <span className="hidden sm:inline">Lihat Situs</span>
            </NavLink>
            <div className="text-sm text-neutral-700 hidden sm:block">
              {user?.name || user?.email || "Admin"}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={handleLogout}
            >
              <LogOut size={15} />
            </Button>
          </div>
        </header>

        <main className="p-4 lg:p-8 max-w-6xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
