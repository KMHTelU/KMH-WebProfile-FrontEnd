import { Link } from "react-router";
import kmhLogo from "../../assets/KMH.png";
import { Instagram, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <img
                src={kmhLogo}
                alt="KMH Logo"
                className="w-10 h-10 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                style={{ filter: "invert(1) brightness(0.85)" }}
              />
              <div className="flex flex-col leading-none">
                <span className="text-[11px] tracking-[0.2em] uppercase font-medium text-neutral-500">
                  KMH
                </span>
                <span className="text-sm tracking-wide text-white" style={{ fontWeight: 600 }}>
                  Telkom University
                </span>
              </div>
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm mt-4">
              Keluarga Mahasiswa Hindu Telkom University — Bersatu dalam Dharma,
              Berkembang dalam Karya, Berbakti kepada Sesama.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-amber-600 flex items-center justify-center transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="mailto:kmh@telkomuniversity.ac.id"
                className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-amber-600 flex items-center justify-center transition-colors duration-200"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white text-sm mb-4" style={{ fontWeight: 600 }}>
              Navigation
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Home", path: "/" },
                { label: "About", path: "/about" },
                { label: "Divisions", path: "/divisions" },
                { label: "Events", path: "/events" },
                { label: "Gallery", path: "/gallery" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-neutral-400 hover:text-white transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm mb-4" style={{ fontWeight: 600 }}>
              Contact
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-neutral-400">
                <MapPin size={14} className="mt-0.5 shrink-0 text-neutral-500" />
                <span>Jl. Telekomunikasi No. 1, Terusan Buah Batu, Bandung, Jawa Barat 40257</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <Mail size={14} className="shrink-0 text-neutral-500" />
                <span>kmh@telkomuniversity.ac.id</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} KMH Telkom University. All rights reserved.
          </p>
          <p className="text-xs text-neutral-600">
            Om Shanti Shanti Shanti Om
          </p>
        </div>
      </div>
    </footer>
  );
}
