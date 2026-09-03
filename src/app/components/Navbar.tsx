import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import kmhLogo from "../../assets/KMH.png";
import { Menu, X, Lock, Landmark } from "lucide-react";
import { SHOW_ADMIN_LOGIN_LINK, HALL_OF_FAME_URL } from "../../lib/config";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Divisions", path: "/divisions" },
  { label: "Events", path: "/events" },
  { label: "Blog", path: "/blog" },
  { label: "Gallery", path: "/gallery" },
  { label: "Contact", path: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  // Saat belum scroll, navbar transparan menumpuk di atas hero gelap → pakai teks terang.
  // Saat sudah scroll (bg putih), pakai teks gelap.
  const onDark = !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-100"
          : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={kmhLogo}
              alt="KMH Logo"
              className="w-9 h-9 object-contain transition-opacity duration-200 group-hover:opacity-80"

            />
            <div className="flex flex-col leading-none">
              <span
                className={`text-[11px] tracking-[0.2em] uppercase font-medium transition-colors duration-300 ${onDark ? "text-white/70" : "text-neutral-500"
                  }`}
                style={{ fontWeight: 500 }}
              >
                KMH
              </span>
              <span
                className={`text-[13px] tracking-wide transition-colors duration-300 ${onDark ? "text-white" : "text-neutral-800"
                  }`}
                style={{ fontWeight: 600, letterSpacing: "0.02em" }}
              >
                Telkom University
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-sm transition-colors duration-200 rounded-full ${isActive(link.path)
                    ? onDark
                      ? "text-white"
                      : "text-neutral-900"
                    : onDark
                      ? "text-white/70 hover:text-white"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                style={{ fontWeight: isActive(link.path) ? 500 : 400 }}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500" />
                )}
              </Link>
            ))}
            {/* Museum 3D — aplikasi terpisah, dibuka di tab baru */}
            <a
              href={HALL_OF_FAME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-full transition-colors duration-200 ${onDark
                  ? "text-amber-300/90 hover:text-amber-200"
                  : "text-amber-700 hover:text-amber-800"
                }`}
              style={{ fontWeight: 500 }}
            >
              <Landmark size={14} /> Hall of Fame
            </a>
          </div>

          {/* CTA + Mobile */}
          <div className="flex items-center gap-3">
            {/*
              Entri Login admin. Sengaja disembunyikan: kelas `hidden` aktif saat
              SHOW_ADMIN_LOGIN_LINK=false. Untuk memunculkan: set VITE_SHOW_ADMIN_LOGIN=true
              atau hapus penambahan " hidden" di baris className ini. /login tetap
              bisa diakses langsung via URL.
            */}
            {/* <Link
              to="/login"
              data-admin-login
              className={`md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-colors ${
                onDark ? "text-white/70 hover:text-white" : "text-neutral-500 hover:text-neutral-900"
              } ${SHOW_ADMIN_LOGIN_LINK ? "hidden md:inline-flex" : "hidden"}`}
            >
              <Lock size={14} /> Login
            </Link> */}
            <button
              className={`md:hidden p-2 rounded-full transition-colors ${onDark
                  ? "text-white hover:bg-white/10"
                  : "text-neutral-700 hover:bg-neutral-100"
                }`}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          } bg-white/98 backdrop-blur-md border-b border-neutral-100`}
      >
        <div className="px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-3 rounded-xl text-sm transition-colors duration-150 ${isActive(link.path)
                  ? "bg-amber-50 text-amber-800"
                  : "text-neutral-600 hover:bg-neutral-50"
                }`}
              style={{ fontWeight: isActive(link.path) ? 500 : 400 }}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={HALL_OF_FAME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded-xl text-sm text-amber-700 hover:bg-amber-50 transition-colors duration-150 inline-flex items-center gap-2"
            style={{ fontWeight: 500 }}
          >
            <Landmark size={15} /> Hall of Fame
          </a>
          {/* <Link
            to="/login"
            data-admin-login
            className={`px-4 py-3 rounded-xl text-sm text-center text-neutral-500 hover:bg-neutral-50 ${
              SHOW_ADMIN_LOGIN_LINK ? "" : "hidden"
            }`}
          >
            Login
          </Link> */}
        </div>
      </div>
    </nav>
  );
}
