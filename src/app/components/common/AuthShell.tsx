import type { ReactNode } from "react";
import { Link } from "react-router";
import { ArrowLeft, ShieldCheck, Sparkles, Users } from "lucide-react";
import kmhLogo from "../../../assets/KMH.png";

const highlights = [
  {
    icon: Sparkles,
    title: "Kelola konten dengan mudah",
    desc: "Banner, event, blog, dan galeri dalam satu panel.",
  },
  {
    icon: Users,
    title: "Data keanggotaan terpusat",
    desc: "Anggota, divisi, dan pengurus selalu sinkron.",
  },
  {
    icon: ShieldCheck,
    title: "Akses aman",
    desc: "Autentikasi token dengan sesi yang diperbarui otomatis.",
  },
];

/**
 * Kerangka halaman autentikasi (login / lupa / reset password):
 * panel brand gelap di kiri, form di kanan.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-neutral-50">
      {/* Panel brand */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-2/5 relative flex-col justify-between overflow-hidden bg-neutral-950 text-white p-10">
        {/* Dekorasi */}
        <div
          aria-hidden
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-amber-500/20 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-40 -left-24 w-96 h-96 rounded-full bg-amber-600/10 blur-3xl"
        />

        <div className="relative flex items-center gap-3">
          <img src={kmhLogo} alt="KMH" className="w-10 h-10 object-contain" />
          <div className="leading-tight">
            <div className="font-semibold">KMH Tel-U</div>
            <div className="text-xs text-neutral-400">
              Keluarga Mahasiswa Hindu
            </div>
          </div>
        </div>

        <div className="relative space-y-8 max-w-sm">
          <h1 className="text-3xl font-semibold leading-snug">
            Panel Admin
            <span className="block text-amber-400">Website KMH Tel-U</span>
          </h1>
          <ul className="space-y-5">
            {highlights.map((h) => (
              <li key={h.title} className="flex gap-3.5">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                  <h.icon size={17} className="text-amber-400" />
                </div>
                <div>
                  <div className="text-sm font-medium">{h.title}</div>
                  <div className="text-sm text-neutral-400">{h.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative text-xs text-neutral-500">
          © {new Date().getFullYear()} KMH Telkom University
        </div>
      </div>

      {/* Panel form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm">
          {/* Logo untuk layar kecil */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <img src={kmhLogo} alt="KMH" className="w-14 h-14 object-contain mb-2" />
            <div className="text-sm font-semibold text-neutral-800">
              Admin KMH Tel-U
            </div>
          </div>

          {children}

          <Link
            to="/"
            className="mt-6 flex items-center justify-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <ArrowLeft size={13} /> Kembali ke situs utama
          </Link>
        </div>
      </div>
    </div>
  );
}
