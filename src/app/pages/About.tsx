import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import kmhLogo from "../../assets/KMH.png";
import { SmartImage } from "../components/common/SmartImage";
import { Seo } from "../components/common/Seo";
import { useOrganizationProfile } from "../../lib/api/hooks";
import { ENABLE_STATIC_FALLBACK, ORG_PROFILE_ID } from "../../lib/config";
import { parseHistoryTimeline } from "../../lib/org-history";

const ABOUT_HERO = "https://images.unsplash.com/photo-1758274539654-23fa349cc090?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920";

const defaultName = "Keluarga Mahasiswa Hindu Telkom University";

const defaultDescription = [
  "Keluarga Mahasiswa Hindu (KMH) Telkom University adalah organisasi kemahasiswaan yang berdiri di bawah naungan Universitas Telkom, Bandung. Organisasi ini merupakan rumah bagi seluruh mahasiswa beragama Hindu yang menimba ilmu di kampus Telkom University.",
  "KMH hadir sebagai sarana untuk mempererat persaudaraan, memperdalam pemahaman dan pengamalan agama Hindu, serta mengembangkan potensi anggota dalam berbagai bidang — mulai dari seni dan budaya, kewirausahaan, hubungan sosial, hingga pengabdian kepada masyarakat.",
  "Dengan sembilan divisi yang masing-masing memiliki fokus dan program kerja tersendiri, KMH berkomitmen untuk menjadi organisasi yang inklusif, aktif, dan berdampak positif bagi seluruh civitas akademika Telkom University maupun masyarakat luas.",
];

const defaultVision =
  '"Menjadi organisasi kemahasiswaan Hindu yang unggul, harmonis, dan berdampak — yang mampu melahirkan generasi penerus bangsa yang beriman, berkarakter, dan berdedikasi berdasarkan nilai-nilai dharma dalam kehidupan bermasyarakat, berbangsa, dan bernegara."';

const defaultMisi = [
  "Menjadi wadah bagi mahasiswa Hindu di Telkom University untuk memperkuat keimanan dan pemahaman agama Hindu.",
  "Menyelenggarakan kegiatan keagamaan, budaya, dan sosial yang mencerminkan nilai-nilai dharma.",
  "Membangun karakter mahasiswa Hindu yang cerdas, berintegritas, dan berdedikasi tinggi.",
  "Menjalin hubungan yang harmonis dengan seluruh civitas akademika dan masyarakat sekitar.",
  "Mengembangkan bakat dan potensi anggota melalui berbagai program kreatif dan inovatif.",
  "Berkontribusi aktif dalam kegiatan sosial dan pengabdian kepada masyarakat.",
];

// Pisah teks multi-baris menjadi paragraf/daftar. Mendukung pemisah baris ganda
// atau tunggal, serta bullet "- " / "• " di awal baris.
function splitLines(text: string | null | undefined): string[] {
  if (!text) return [];
  return text
    .split(/\r?\n+/)
    .map((s) => s.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
}

const timeline = [
  {
    year: "2005",
    title: "Berdirinya KMH",
    description:
      "KMH Telkom University resmi didirikan oleh sekelompok mahasiswa Hindu sebagai wadah persaudaraan dan kegiatan keagamaan di lingkungan kampus Institut Teknologi Telkom.",
  },
  {
    year: "2009",
    title: "Pengakuan Resmi",
    description:
      "KMH mendapatkan pengakuan resmi sebagai Unit Kegiatan Mahasiswa (UKM) oleh pihak Institut Teknologi Telkom, menandai babak baru dalam perjalanan organisasi.",
  },
  {
    year: "2013",
    title: "Transformasi Menjadi Telkom University",
    description:
      "Seiring transformasi Institut Teknologi Telkom menjadi Telkom University, KMH turut berkembang dengan memperluas jangkauan keanggotaan ke seluruh fakultas universitas.",
  },
  {
    year: "2016",
    title: "Pembentukan Divisi Lengkap",
    description:
      "KMH menyempurnakan struktur organisasi dengan membentuk sembilan divisi yang masing-masing memiliki fungsi dan program kerja yang jelas dan terarah.",
  },
  {
    year: "2019",
    title: "Program Pengabdian Masyarakat",
    description:
      "KMH meluncurkan program Desa Binaan sebagai wujud nyata komitmen organisasi dalam pengabdian kepada masyarakat, menjangkau komunitas di sekitar Bandung.",
  },
  {
    year: "2022",
    title: "Era Digital KMH",
    description:
      "KMH memasuki era digital dengan meluncurkan platform media sosial yang aktif, newsletter digital, dan berbagai konten kreatif yang menjangkau audiens lebih luas.",
  },
  {
    year: "2025",
    title: "KMH Hari Ini",
    description:
      "KMH terus tumbuh dan berkembang dengan ratusan anggota aktif, program kerja yang beragam, dan semangat dharma yang tak pernah padam.",
  },
];

export function About() {
  const { data: org } = useOrganizationProfile(ORG_PROFILE_ID);
  const fb = ENABLE_STATIC_FALLBACK;

  // Untuk tiap field: pakai data API bila ada, jika kosong -> konten statis (bila fallback aktif).
  const pick = <T,>(apiValue: T | null | undefined, fallback: T, empty: T): T =>
    apiValue != null && apiValue !== ("" as unknown as T)
      ? apiValue
      : fb
      ? fallback
      : empty;
  const pickList = (apiText: string | null | undefined, fallback: string[]): string[] => {
    const arr = splitLines(apiText);
    return arr.length > 0 ? arr : fb ? fallback : [];
  };

  const orgName = org?.name || defaultName;
  const description = pickList(org?.description, defaultDescription);
  const vision = pick(org?.vision, defaultVision, "");
  const misi = pickList(org?.mission, defaultMisi);
  // Sejarah: kolom teks bisa berisi JSON timeline (tahun/judul/deskripsi) dari
  // admin, teks paragraf lama, atau kosong (→ timeline statis bawaan).
  const historyTimeline = parseHistoryTimeline(org?.history);
  const history = historyTimeline ? [] : splitLines(org?.history);
  const timelineItems =
    historyTimeline && historyTimeline.length > 0 ? historyTimeline : timeline;
  const heroSrc = org?.logo?.url || ABOUT_HERO;
  const visionLogo = org?.logo?.url || kmhLogo;

  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="Tentang KMH"
        description={description[0]?.slice(0, 160)}
        path="/about"
      />
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[360px] flex items-end justify-start overflow-hidden">
        <SmartImage
          src={heroSrc}
          alt={`About ${orgName}`}
          priority
          wrapperClassName="absolute inset-0 w-full h-full"
          imgClassName="w-full h-full object-cover"
          placeholderClassName="bg-neutral-800"
          fallbackSrc={ABOUT_HERO}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/30 to-black/80 z-10" />
        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 pb-12 w-full">
          <div className="inline-block text-xs tracking-widest uppercase text-amber-400 mb-3" style={{ fontWeight: 600 }}>
            About
          </div>
          <h1
            className="text-white"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15 }}
          >
            About KMH
          </h1>
        </div>
      </section>

      {/* Organizational Overview */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block text-xs tracking-widest uppercase text-amber-600 mb-4" style={{ fontWeight: 600 }}>
            Profil Organisasi
          </div>
          <h2 className="text-neutral-900 mb-6" style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            {orgName}
          </h2>
          <div className="space-y-4 text-neutral-600 leading-relaxed">
            {description.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="h-px bg-neutral-100" />
      </div>

      {/* Vision */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block text-xs tracking-widest uppercase text-amber-600 mb-4" style={{ fontWeight: 600 }}>
            Visi
          </div>
          <h2 className="text-neutral-900 mb-6" style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Visi Organisasi
          </h2>
          <div
            className="relative rounded-2xl p-8 overflow-hidden"
            style={{ background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)", border: "1px solid #fde68a" }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-amber-200/30 -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex items-start gap-4">
              <img
                src={visionLogo}
                alt={orgName}
                className="w-10 h-10 object-contain shrink-0 opacity-50 mt-1"
              />
              <p
                className="text-neutral-800 italic"
                style={{ fontSize: "1.125rem", lineHeight: 1.7, fontWeight: 400 }}
              >
                {vision}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="h-px bg-neutral-100" />
      </div>

      {/* Mission */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block text-xs tracking-widest uppercase text-amber-600 mb-4" style={{ fontWeight: 600 }}>
            Misi
          </div>
          <h2 className="text-neutral-900 mb-8" style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Misi Organisasi
          </h2>
          <div className="space-y-3">
            {misi.map((item: string, i: number) => (
              <div
                key={i}
                className="flex items-start gap-4 p-5 rounded-xl bg-neutral-50 border border-neutral-100 hover:border-amber-200 hover:bg-amber-50/30 transition-colors duration-200"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5 text-amber-800"
                  style={{
                    background: "linear-gradient(135deg, #fde68a, #fbbf24)",
                    fontWeight: 700,
                  }}
                >
                  {i + 1}
                </div>
                <p className="text-neutral-700 leading-relaxed text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="h-px bg-neutral-100" />
      </div>

      {/* History Timeline */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block text-xs tracking-widest uppercase text-amber-600 mb-4" style={{ fontWeight: 600 }}>
            Sejarah
          </div>
          <h2 className="text-neutral-900 mb-12" style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Perjalanan KMH
          </h2>
          {history.length > 0 ? (
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              {history.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-2 bottom-2 w-px bg-neutral-200" />
            <div className="space-y-8">
              {timelineItems.map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="relative shrink-0">
                    <div
                      className="w-10 h-10 rounded-full border-2 border-amber-400 bg-white flex items-center justify-center z-10 relative"
                      style={{ boxShadow: "0 0 0 4px rgba(251,191,36,0.15)" }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    </div>
                  </div>
                  <div className="pb-2 pt-1">
                    {item.year && (
                      <div className="text-xs text-amber-600 mb-1" style={{ fontWeight: 700 }}>
                        {item.year}
                      </div>
                    )}
                    {item.title && (
                      <h3 className="text-neutral-900 mb-1.5" style={{ fontSize: "1rem", fontWeight: 600 }}>
                        {item.title}
                      </h3>
                    )}
                    {item.description && (
                      <p className="text-neutral-500 text-sm leading-relaxed">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>
      </section>

      {/* Join Section */}
      <section id="join" className="py-20 px-6 bg-neutral-950">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block text-xs tracking-widest uppercase text-amber-500 mb-4" style={{ fontWeight: 600 }}>
            Bergabung
          </div>
          <h2
            className="text-white mb-4"
            style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em" }}
          >
            Jadilah Bagian dari KMH
          </h2>
          <p className="text-neutral-400 mb-8 leading-relaxed max-w-md mx-auto">
            Kami membuka pintu bagi seluruh mahasiswa Hindu di Telkom University untuk bergabung dan berkembang bersama.
            Temukan divisi yang sesuai dengan minat dan bakatmu.
          </p>
          <Link
            to="/divisions"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm text-white transition-all duration-200 hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
              fontWeight: 600,
              boxShadow: "0 4px 20px rgba(180,83,9,0.35)",
            }}
          >
            Explore Divisions <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
