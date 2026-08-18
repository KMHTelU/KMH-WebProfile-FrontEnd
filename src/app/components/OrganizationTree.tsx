import React, { useState, useRef, useLayoutEffect, useCallback } from "react";
import { Link } from "react-router";
import { X, ExternalLink, Sparkles, ChevronDown } from "lucide-react";
import { SmartImage } from "./common/SmartImage";

export interface OrgNode {
  id: string;
  title: string;
  name: string;
  nim: string;
  category: "Pengurus Inti" | "Internal Division" | "External Division";
  photo: string;
  description: string;
  responsibilities?: string[];
  divisionSlug: string;
}

export const orgNodes: OrgNode[] = [
  {
    id: "ketua",
    title: "Ketua",
    name: "Komang Antara Wijana",
    nim: "103012012345",
    category: "Pengurus Inti",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    description: "Ketua bertugas dalam mengurus kebersamaan hidup mahasiswa Hindu, memimpin jalannya organisasi, serta menjaga keharmonisan dan visi bersama KMH Telkom University.",
    responsibilities: ["Memimpin dan mengoordinasikan seluruh jajaran pengurus", "Bertanggung jawab atas visi dan kebijakan strategis KMH", "Mewakili KMH Telkom University dalam forum internal & eksternal"],
    divisionSlug: "inti",
  },
  {
    id: "wakil-internal",
    title: "Wakil Ketua Internal",
    name: "Sari Dewi",
    nim: "103012012346",
    category: "Pengurus Inti",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    description: "Wakil Ketua Internal bertanggung jawab mengoordinasikan divisi-divisi internal demi terciptanya sinergi dan keharmonisan organisasi.",
    responsibilities: ["Mengawasi kinerja divisi internal KMH", "Menjaga iklim persaudaraan dan kekeluargaan antaranggota"],
    divisionSlug: "inti",
  },
  {
    id: "wakil-external",
    title: "Wakil Ketua External",
    name: "Bagus Mahendra",
    nim: "103012012347",
    category: "Pengurus Inti",
    photo: "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?w=400&h=400&fit=crop",
    description: "Wakil Ketua Eksternal memimpin dan mengarahkan divisi-divisi eksternal dalam menjalin hubungan dengan stakeholder luar.",
    responsibilities: ["Mengonsep jejaring dan kemitraan dengan organisasi eksternal", "Mengoordinasikan divisi eksternal dalam setiap aksi publik"],
    divisionSlug: "inti",
  },
  {
    id: "sekretaris-1",
    title: "Sekretaris 1",
    name: "Rama Wijaya",
    nim: "103012012348",
    category: "Pengurus Inti",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    description: "Mengelola administrasi utama, persuratan resmi organisasi, serta pengarsipan dokumen penting KMH Telkom University.",
    responsibilities: ["Menyusun dan mengelola surat keluar/masuk resmi", "Mengelola database keanggotaan dan administrasi pusat"],
    divisionSlug: "inti",
  },
  {
    id: "sekretaris-2",
    title: "Sekretaris 2",
    name: "Ni Made Ayu",
    nim: "103012012349",
    category: "Pengurus Inti",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    description: "Mendampingi Sekretaris 1 dalam pembuatan notulensi rapat rutin, penjadwalan agenda internal, dan inventarisasi data keanggotaan.",
    responsibilities: ["Mencatat notulensi rapat bulanan dan rapat kerja", "Menyusun laporan bulanan kinerja kesekretariatan"],
    divisionSlug: "inti",
  },
  {
    id: "bendahara-1",
    title: "Bendahara 1",
    name: "Citra Lestari",
    nim: "103012012350",
    category: "Pengurus Inti",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    description: "Mengatur alokasi keuangan organisasi, penyusunan anggaran tahunan, dan pencatatan keuangan masuk-keluar KMH.",
    responsibilities: ["Menyusun Rancangan Anggaran Pendapatan & Belanja Organisasi", "Mengelola kas utama dan pembukuan keuangan bulanan"],
    divisionSlug: "inti",
  },
  {
    id: "bendahara-2",
    title: "Bendahara 2",
    name: "Putu Arjuna",
    nim: "103012012351",
    category: "Pengurus Inti",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    description: "Mengurus verifikasi keuangan dari setiap divisi serta pembayaran operasional kegiatan program kerja.",
    responsibilities: ["Memeriksa LPJ Keuangan setiap kepanitiaan event", "Membantu pencatatan nota dan kuitansi transaksi harian"],
    divisionSlug: "inti",
  },
  {
    id: "kaderisasi",
    title: "Kaderisasi",
    name: "Ngurah Agung",
    nim: "103012012352",
    category: "Internal Division",
    photo: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop",
    description: "Merancang pelatihan kepemimpinan, proses rekrutmen anggota baru (Open Recruitment), serta pembinaan karakter anggota KMH.",
    responsibilities: ["Penyelenggaraan penerimaan mahasiswa baru Hindu (DIKSAR)", "Pengembangan kurikulum kepemimpinan kader KMH"],
    divisionSlug: "kaderisasi",
  },
  {
    id: "pengembangan-minat-bakat",
    title: "Pengembangan Minat dan Bakat",
    name: "Komang Putri",
    nim: "103012012353",
    category: "Internal Division",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
    description: "Wadah pengasahan bakat seni, tari Bali, musik gamelan, olahraga, dan kreativitas mahasiswa Hindu Telkom University.",
    responsibilities: ["Latihan rutin Tari Bali dan Gamelan", "Pentas seni budaya Hindu & kompetisi minat bakat"],
    divisionSlug: "pmb",
  },
  {
    id: "rohani",
    title: "Rohani",
    name: "Ida Bagus Oka",
    nim: "103012012354",
    category: "Internal Division",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    description: "Menyelenggarakan kegiatan keagamaan rutin (persembahyangan), perayaan hari besar Hindu, serta pemahaman Dharma Wacana.",
    responsibilities: ["Persembahyangan rutin dan tirta yatra", "Penyelenggaraan perayaan Nyepi & Galungan/Kuningan"],
    divisionSlug: "rohani",
  },
  {
    id: "media",
    title: "Media",
    name: "Gede Arya",
    nim: "103012012355",
    category: "Internal Division",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    description: "Mengelola seluruh publikasi digital, desain grafis, fotografi, videografi, dan branding media sosial KMH.",
    responsibilities: ["Pengelolaan media sosial dan website resmi KMH", "Dokumentasi foto/video seluruh kegiatan organisasi"],
    divisionSlug: "media",
  },
  {
    id: "pengabdian-masyarakat",
    title: "Pengabdian Masyarakat",
    name: "Ni Putu Sari",
    nim: "103012012356",
    category: "External Division",
    photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop",
    description: "Melaksanakan kegiatan bakti sosial, aksi kemanusiaan, program desa binaan, dan kontribusi nyata kepada masyarakat.",
    responsibilities: ["Program bakti sosial & donasi kemanusiaan", "Pengabdian di desa binaan & Pura sekitar Bandung"],
    divisionSlug: "pengmas",
  },
  {
    id: "hubungan-masyarakat",
    title: "Hubungan Masyarakat",
    name: "Luh Gede",
    nim: "103012012357",
    category: "External Division",
    photo: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop",
    description: "Menjadi jembatan komunikasi antara KMH dengan pihak rektorat, UKM lain, dan lembaga Hindu di luar kampus.",
    responsibilities: ["Jejaring antarkampus & aliansi mahasiswa Hindu", "Kunjungan kelembagaan & hubungan alumni"],
    divisionSlug: "humas",
  },
  {
    id: "kewirausahaan",
    title: "Kewirausahaan",
    name: "Made Surya",
    nim: "103012012358",
    category: "External Division",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
    description: "Mengembangkan jiwa kewirausahaan anggota melalui bursa usaha, penjualan merchandise resmi, serta penggalian dana mandiri.",
    responsibilities: ["Penjualan official merchandise KMH Telkom University", "Bazaar & wirausaha mandiri penyokong dana organisasi"],
    divisionSlug: "kewirausahaan",
  },
  {
    id: "logistik-transportasi",
    title: "Logistik dan Transportasi",
    name: "Putu Nanda",
    nim: "103012012359",
    category: "External Division",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    description: "Menyiapkan perlengkapan, operasional venue, pengadaan barang, serta armada transportasi untuk seluruh kegiatan KMH.",
    responsibilities: ["Pengelolaan inventaris barang & alat ritual/seni", "Mobilisasi armada transportasi kegiatan luar kampus"],
    divisionSlug: "logtrans",
  },
];

// Grouped edge definitions — children per parent share ONE bus just below parent
const EDGE_GROUPS: Array<{ parent: string; children: string[] }> = [
  // Ketua → ALL level-2 + bendahara in ONE group so they share the same horizontal bus
  { parent: "ketua", children: ["wakil-internal", "sekretaris-1", "bendahara-1", "bendahara-2", "sekretaris-2", "wakil-external"] },
  { parent: "wakil-internal", children: ["kaderisasi", "pengembangan-minat-bakat"] },
  { parent: "wakil-external", children: ["pengabdian-masyarakat", "hubungan-masyarakat"] },
  { parent: "kaderisasi", children: ["rohani"] },
  { parent: "pengembangan-minat-bakat", children: ["media"] },
  { parent: "pengabdian-masyarakat", children: ["kewirausahaan"] },
  { parent: "hubungan-masyarakat", children: ["logistik-transportasi"] },
];

interface NodeRect {
  id: string;
  cx: number;
  cy: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**
 * Builds an elbow path for one parent → many children.
 * Bus sits at a FIXED distance (18px) below the parent bottom — never at midpoint —
 * so cross-row visual bleeding is eliminated.
 */
function buildGroupPath(parent: NodeRect, children: NodeRect[]): string {
  const busY = parent.bottom + 18;
  const sortedX = [...children.map((c) => c.cx)].sort((a, b) => a - b);

  // Drop from parent center down to bus
  let d = `M ${parent.cx} ${parent.bottom} L ${parent.cx} ${busY}`;

  // Horizontal bus spanning all children
  if (sortedX.length > 1) {
    d += ` M ${sortedX[0]} ${busY} L ${sortedX[sortedX.length - 1]} ${busY}`;
  }

  // Vertical drop from bus to top-center of each child
  for (const child of children) {
    d += ` M ${child.cx} ${busY} L ${child.cx} ${child.top}`;
  }

  return d;
}

export function OrganizationTree() {
  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [paths, setPaths] = useState<Array<{ id: string; d: string }>>([]);

  const recalcPaths = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();

    const rects: Record<string, NodeRect> = {};
    for (const [id, el] of Object.entries(nodeRefs.current)) {
      if (!el) continue;
      const r = el.getBoundingClientRect();
      rects[id] = {
        id,
        cx: r.left - containerRect.left + r.width / 2,
        cy: r.top - containerRect.top + r.height / 2,
        top: r.top - containerRect.top,
        bottom: r.bottom - containerRect.top,
        left: r.left - containerRect.left,
        right: r.right - containerRect.left,
      };
    }

    const newPaths = EDGE_GROUPS.map(({ parent, children }) => {
      const parentRect = rects[parent];
      if (!parentRect) return null;
      const childRects = children.map((c) => rects[c]).filter(Boolean) as NodeRect[];
      if (childRects.length === 0) return null;
      return { id: `group-${parent}`, d: buildGroupPath(parentRect, childRects) };
    }).filter(Boolean) as Array<{ id: string; d: string }>;

    setPaths(newPaths);
  }, []);

  useLayoutEffect(() => {
    // Initial measure + on resize
    recalcPaths();
    const ro = new ResizeObserver(recalcPaths);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", recalcPaths);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recalcPaths);
    };
  }, [recalcPaths]);

  const setRef = (id: string) => (el: HTMLButtonElement | null) => {
    nodeRefs.current[id] = el;
  };

  const categoryBadgeClass = (category: string) => {
    if (category === "Pengurus Inti") return "bg-amber-100 text-amber-900 border border-amber-300";
    if (category === "External Division") return "bg-blue-100 text-blue-900 border border-blue-300";
    return "bg-amber-50 text-amber-800 border border-amber-200";
  };


  return (
    <section className="relative py-8 px-4 overflow-hidden rounded-3xl bg-[#121214] border border-amber-500/25 shadow-2xl my-4">
      {/* ── Background Glow ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-[650px] h-[320px] rounded-full opacity-30 blur-3xl animate-pulse"
          style={{ background: "radial-gradient(circle, rgba(255,191,0,0.5) 0%, rgba(255,165,0,0.15) 50%, transparent 75%)", animationDuration: "6s" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(#FFBF00_1px,transparent_1px)] [background-size:28px_28px] opacity-10" />
      </div>

      {/* ── Header ── */}
      <div className="relative z-10 text-center mb-6">
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-[#FFD700] via-[#FFBF00] to-[#FFA500] text-neutral-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/30 mb-2 animate-bounce-subtle">
          <Sparkles size={16} />
          Organization Structure
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Our Tree Branch</h2>
      </div>

      {/* ── Desktop Tree (DOM-measured SVG connectors) ── */}
      <div
        ref={containerRef}
        className="relative z-10 max-w-6xl mx-auto hidden lg:block select-none py-4"
      >
        {/* SVG connector layer — absolutely positioned over the same container */}
        <svg
          className="absolute inset-0 w-full pointer-events-none z-0 overflow-visible"
          style={{ height: "100%" }}
        >
          <defs>
            <filter id="glowFilter" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Glow layer (amber, thick, blurred) */}
          {paths.map(({ id, d }) => (
            <path key={`g-${id}`} d={d} stroke="#FFBF00" strokeWidth="5" strokeOpacity="0.8" fill="none" filter="url(#glowFilter)" />
          ))}
          {/* Core white line — no arrowheads */}
          {paths.map(({ id, d }) => (
            <path key={`l-${id}`} d={d} stroke="#FFFFFF" strokeWidth="2" fill="none" />
          ))}
        </svg>

        {/* Node grid (z-10 above SVG) */}
        <div className="relative z-10 flex flex-col gap-10 items-center pb-4">
          {/* Level 1: Ketua */}
          <div className="flex justify-center w-full">
            <NodePill
              node={orgNodes.find((n) => n.id === "ketua")!}
              onSelect={setSelectedNode}
              refCb={setRef("ketua")}
              isMain
            />
          </div>

          {/* Level 2: 4 columns */}
          <div className="grid grid-cols-4 gap-4 w-full px-2">
            {["wakil-internal", "sekretaris-1", "sekretaris-2", "wakil-external"].map((id) => (
              <div key={id} className="flex justify-center">
                <NodePill
                  node={orgNodes.find((n) => n.id === id)!}
                  onSelect={setSelectedNode}
                  refCb={setRef(id)}
                />
              </div>
            ))}
          </div>

          {/* Level 2.5: Bendahara pair */}
          <div className="flex justify-center gap-16">
            {["bendahara-1", "bendahara-2"].map((id) => (
              <NodePill
                key={id}
                node={orgNodes.find((n) => n.id === id)!}
                onSelect={setSelectedNode}
                refCb={setRef(id)}
              />
            ))}
          </div>

          {/* Level 3: 4 columns */}
          <div className="grid grid-cols-4 gap-4 w-full px-2">
            {["kaderisasi", "pengembangan-minat-bakat", "pengabdian-masyarakat", "hubungan-masyarakat"].map((id) => (
              <div key={id} className="flex justify-center">
                <NodePill
                  node={orgNodes.find((n) => n.id === id)!}
                  onSelect={setSelectedNode}
                  refCb={setRef(id)}
                />
              </div>
            ))}
          </div>

          {/* Level 4: 4 columns */}
          <div className="grid grid-cols-4 gap-4 w-full px-2">
            {["rohani", "media", "kewirausahaan", "logistik-transportasi"].map((id) => (
              <div key={id} className="flex justify-center">
                <NodePill
                  node={orgNodes.find((n) => n.id === id)!}
                  onSelect={setSelectedNode}
                  refCb={setRef(id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile Card List ── */}
      <div className="block lg:hidden relative z-10 max-w-lg mx-auto space-y-2.5">
        <div className="text-xs text-amber-400 text-center font-medium mb-3 flex items-center justify-center gap-1.5">
          <ChevronDown size={14} className="animate-bounce" /> Tap mana saja untuk melihat detail
        </div>
        {orgNodes.map((node) => (
          <button
            key={node.id}
            onClick={() => setSelectedNode(node)}
            className="w-full text-left p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-500/30 hover:border-amber-400 transition-all duration-200 flex items-center justify-between group active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400 shrink-0">
                <img src={node.photo} alt={node.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFBF00] text-neutral-950 uppercase tracking-wider mb-0.5">
                  {node.title}
                </span>
                <div className="text-white text-sm font-semibold group-hover:text-amber-300 transition-colors">{node.name}</div>
              </div>
            </div>
            <span className="text-amber-400 text-xs font-semibold group-hover:translate-x-1 transition-transform">Detail →</span>
          </button>
        ))}
      </div>

      {/* ── Modal ── */}
      {selectedNode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedNode(null)}
        >
          <div
            className="relative w-full max-w-md bg-neutral-900/95 border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(255,191,0,0.4)] text-center text-white overflow-hidden animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-30 blur-2xl pointer-events-none" style={{ background: "radial-gradient(circle, #FFBF00 0%, transparent 70%)" }} />
            <button onClick={() => setSelectedNode(null)} className="absolute top-4 right-4 p-2 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors z-20" aria-label="Close">
              <X size={18} />
            </button>
            <div className="flex justify-center mb-5">
              <span className="inline-block px-8 py-2.5 rounded-full font-extrabold text-sm sm:text-base text-neutral-950 shadow-lg" style={{ background: "linear-gradient(135deg, #FFE066 0%, #FFBF00 50%, #FF9E00 100%)", boxShadow: "0 4px 20px rgba(255,191,0,0.45)" }}>
                {selectedNode.title}
              </span>
            </div>
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-4 rounded-full p-1 bg-gradient-to-tr from-[#FFD700] via-[#FFBF00] to-[#FF9E00] shadow-[0_0_25px_rgba(255,191,0,0.5)]">
              <div className="w-full h-full rounded-full overflow-hidden bg-neutral-950">
                <SmartImage src={selectedNode.photo} alt={selectedNode.name} wrapperClassName="w-full h-full" imgClassName="w-full h-full object-cover" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 tracking-tight">{selectedNode.name}</h3>
            <div className="text-amber-400 font-mono text-xs sm:text-sm tracking-wider mb-3">{selectedNode.nim}</div>
            <div className="flex justify-center mb-4">
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${categoryBadgeClass(selectedNode.category)}`}>{selectedNode.category}</span>
            </div>
            <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-5 px-2">{selectedNode.description}</p>
            {selectedNode.responsibilities && selectedNode.responsibilities.length > 0 && (
              <div className="text-left bg-neutral-950/70 rounded-2xl p-3.5 border border-amber-500/20 mb-5 space-y-1.5 text-xs text-neutral-300">
                <div className="text-amber-400 font-bold text-[11px] uppercase tracking-wider mb-1">Tugas Utama:</div>
                {selectedNode.responsibilities.map((task, i) => (
                  <div key={i} className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">•</span><span>{task}</span></div>
                ))}
              </div>
            )}
            <div className="flex items-center justify-center gap-3">
              <Link
                to={`/divisions/${selectedNode.divisionSlug}`}
                onClick={() => setSelectedNode(null)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-neutral-950 transition-all duration-200 hover:scale-105"
                style={{ background: "linear-gradient(135deg, #FFD700 0%, #FFBF00 100%)", boxShadow: "0 4px 15px rgba(255,191,0,0.4)" }}
              >
                Lihat Halaman Divisi <ExternalLink size={14} />
              </Link>
              <button onClick={() => setSelectedNode(null)} className="px-5 py-2.5 rounded-full text-xs font-semibold text-neutral-400 hover:text-white border border-neutral-700 hover:border-neutral-500 transition-colors">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ── NodePill ──
interface NodePillProps {
  node: OrgNode;
  onSelect: (node: OrgNode) => void;
  refCb: (el: HTMLButtonElement | null) => void;
  isMain?: boolean;
}

function NodePill({ node, onSelect, refCb, isMain }: NodePillProps) {
  if (!node) return null;
  return (
    <button
      ref={refCb}
      onClick={() => onSelect(node)}
      className={`relative group inline-flex items-center justify-center transition-all duration-300 transform active:scale-95 z-10 ${isMain ? "px-10 py-3 text-base" : "px-5 py-2 text-xs sm:text-sm"}`}
      style={{
        borderRadius: "9999px",
        background: "linear-gradient(135deg, #FFE066 0%, #FFBF00 50%, #FF9E00 100%)",
        color: "#1a1200",
        fontWeight: 800,
        boxShadow: "0 4px 20px rgba(255,191,0,0.45)",
      }}
    >
      <span className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      </span>
      <span className="relative z-10 tracking-tight">{node.title}</span>
    </button>
  );
}
