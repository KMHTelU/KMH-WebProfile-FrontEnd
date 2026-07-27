// KMH Telkom University - Data

export const divisions = [
  {
    id: "pengurus-inti",
    name: "Pengurus Inti",
    shortDescription: "The core leadership body responsible for overall organizational governance and strategic direction.",
    description:
      "Pengurus Inti is the central governing body of KMH Telkom University. Responsible for establishing the organization's direction, overseeing all divisions, and ensuring alignment with the values and mission of KMH.",
    category: "Core Management",
    responsibilities: [
      "Establish organizational vision and direction",
      "Coordinate all division activities",
      "Represent KMH in official university functions",
      "Facilitate inter-division collaboration",
      "Oversee budgeting and resource allocation",
    ],
    programs: [
      { name: "Leadership Summit", description: "Annual leadership development retreat for all division heads." },
      { name: "Internal Review Sessions", description: "Quarterly performance and planning reviews across all divisions." },
      { name: "KMH General Assembly", description: "Open forum for all members to discuss organizational matters." },
    ],
    image: "https://images.unsplash.com/photo-1708578200684-3aa944b73237?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    members: [
      { name: "Aditya Pratama", role: "Ketua Umum", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" },
      { name: "Sari Dewi", role: "Wakil Ketua", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop" },
      { name: "Rama Wijaya", role: "Sekretaris", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop" },
      { name: "Citra Lestari", role: "Bendahara", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop" },
    ],
  },
  {
    id: "rohani",
    name: "Rohani",
    shortDescription: "Fostering spiritual growth and religious practice through prayers, teachings, and devotional activities.",
    description:
      "The Rohani division is the spiritual heart of KMH. It nurtures the religious and spiritual development of all members through consistent practice of dharma, meditation, prayers, and Hindu teachings.",
    category: "Internal Division",
    responsibilities: [
      "Organize daily and weekly prayers (persembahyangan)",
      "Facilitate spiritual study sessions",
      "Coordinate Hindu holiday observances",
      "Manage pura (temple) activities",
      "Provide spiritual guidance to members",
    ],
    programs: [
      { name: "Persembahyangan Rutin", description: "Regular collective prayer sessions on auspicious Hindu days." },
      { name: "Dharma Wacana", description: "Monthly spiritual discourse and teachings from invited speakers." },
      { name: "Meditasi & Yoga", description: "Weekly meditation and yoga sessions for inner development." },
    ],
    image: "https://images.unsplash.com/photo-1758274539654-23fa349cc090?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    members: [
      { name: "Ida Bagus Oka", role: "Kepala Divisi", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop" },
      { name: "Ni Made Ayu", role: "Wakil Kepala", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop" },
      { name: "Putu Arjuna", role: "Koordinator Doa", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop" },
    ],
  },
  {
    id: "pengembangan-minat-bakat",
    name: "Pengembangan Minat Bakat",
    shortDescription: "Discovering and developing members' talents through arts, culture, and creative expressions.",
    description:
      "Pengembangan Minat Bakat (PMB) nurtures the diverse talents of KMH members through workshops, competitions, and performances. It celebrates Hindu arts, traditional dance, music, and contemporary creative expression.",
    category: "Internal Division",
    responsibilities: [
      "Organize talent workshops and training",
      "Coordinate cultural performances",
      "Represent KMH in university arts competitions",
      "Develop members' artistic and creative skills",
      "Preserve and promote Hindu cultural heritage",
    ],
    programs: [
      { name: "Tari Bali Workshop", description: "Regular Balinese traditional dance training for all skill levels." },
      { name: "KMH Cultural Night", description: "Annual showcase of Hindu arts, music, dance, and drama." },
      { name: "Gamelan Practice", description: "Weekly sessions for traditional Balinese gamelan music." },
    ],
    image: "https://images.unsplash.com/photo-1766783419102-d5b5cae7d238?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    members: [
      { name: "Komang Putri", role: "Kepala Divisi", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop" },
      { name: "Wayan Darma", role: "Koordinator Tari", photo: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop" },
      { name: "Kadek Sari", role: "Koordinator Musik", photo: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=200&h=200&fit=crop" },
    ],
  },
  {
    id: "kaderisasi",
    name: "Kaderisasi",
    shortDescription: "Building the next generation of leaders through structured training and mentorship programs.",
    description:
      "Kaderisasi is responsible for recruiting, developing, and retaining members. It designs the onboarding experience, mentorship frameworks, and leadership pipelines for KMH's future leaders.",
    category: "Internal Division",
    responsibilities: [
      "Design and execute member recruitment",
      "Develop member training and orientation programs",
      "Establish mentorship pairings",
      "Track member development progress",
      "Coordinate member retention initiatives",
    ],
    programs: [
      { name: "Open Recruitment", description: "Semester-based recruitment drive welcoming new Hindu students." },
      { name: "DIKSAR (Pendidikan Dasar)", description: "Foundational training for all new KMH members." },
      { name: "Leadership Training Camp", description: "Annual multi-day camp focused on leadership and team building." },
    ],
    image: "https://images.unsplash.com/photo-1764599952551-2840e83fa5f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    members: [
      { name: "Ngurah Agung", role: "Kepala Divisi", photo: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop" },
      { name: "Ayu Pratiwi", role: "Koordinator Rekrutmen", photo: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=200&fit=crop" },
    ],
  },
  {
    id: "hubungan-masyarakat",
    name: "Hubungan Masyarakat",
    shortDescription: "Bridging KMH with the broader campus community and external stakeholders through strategic communication.",
    description:
      "Hubungan Masyarakat (Humas) manages KMH's public relations and external communications. It builds partnerships, represents the organization externally, and ensures strong community presence on and off campus.",
    category: "External Division",
    responsibilities: [
      "Manage external partnerships and collaborations",
      "Handle official correspondence",
      "Represent KMH at inter-organizational events",
      "Build relationships with Hindu community organizations",
      "Coordinate press releases and public statements",
    ],
    programs: [
      { name: "Campus Partnership Program", description: "Collaboration initiatives with other Telkom University student organizations." },
      { name: "Community Visit", description: "Regular visits to Hindu communities near the campus." },
      { name: "Inter-Organization Forum", description: "Annual gathering of Hindu student organizations from multiple universities." },
    ],
    image: "https://images.unsplash.com/photo-1708578200684-3aa944b73237?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    members: [
      { name: "Bagus Mahendra", role: "Kepala Divisi", photo: "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?w=200&h=200&fit=crop" },
      { name: "Luh Gede", role: "Koordinator Eksternal", photo: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop" },
    ],
  },
  {
    id: "kewirausahaan",
    name: "Kewirausahaan",
    shortDescription: "Empowering members with entrepreneurial skills through business initiatives and financial literacy programs.",
    description:
      "Kewirausahaan develops the entrepreneurial spirit of KMH members. Through workshops, business projects, and revenue-generating activities, the division teaches practical skills and funds organizational activities.",
    category: "Internal Division",
    responsibilities: [
      "Develop and run organizational business initiatives",
      "Organize entrepreneurship workshops",
      "Manage KMH merchandise and fundraising",
      "Coach members in business and finance",
      "Coordinate with sponsors and donors",
    ],
    programs: [
      { name: "KMH Bazaar", description: "Semester-based marketplace showcasing member products and services." },
      { name: "Entrepreneur Workshop Series", description: "Monthly workshops on business fundamentals and digital marketing." },
      { name: "KMH Store", description: "Online and offline store selling KMH-branded merchandise." },
    ],
    image: "https://images.unsplash.com/photo-1698502250310-fcee55f8e197?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    members: [
      { name: "Made Surya", role: "Kepala Divisi", photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop" },
      { name: "Ni Wayan Tari", role: "Manajer Produk", photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop" },
    ],
  },
  {
    id: "media",
    name: "Media",
    shortDescription: "Creating compelling content and managing KMH's digital presence across all platforms.",
    description:
      "The Media division is KMH's creative and communication engine. It manages social media, produces visual and written content, documents events, and builds the organization's digital identity.",
    category: "Internal Division",
    responsibilities: [
      "Manage KMH social media accounts",
      "Produce photography and videography for events",
      "Design visual content and branding materials",
      "Write and publish organizational newsletters",
      "Maintain the KMH website and digital assets",
    ],
    programs: [
      { name: "KMH Monthly Magazine", description: "Digital newsletter featuring member stories, events, and spiritual content." },
      { name: "Photography Workshop", description: "Skills training for member photographers and content creators." },
      { name: "Social Media Campaign", description: "Creative campaigns to raise awareness about Hindu culture and KMH activities." },
    ],
    image: "https://images.unsplash.com/photo-1758613655378-89bb3d122c57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    members: [
      { name: "Gede Arya", role: "Kepala Divisi", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" },
      { name: "Dewi Ratna", role: "Lead Designer", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop" },
      { name: "Kadek Yoga", role: "Fotografer", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop" },
    ],
  },
  {
    id: "logistik-transportasi",
    name: "Logistik & Transportasi",
    shortDescription: "Ensuring seamless operations by managing equipment, logistics, and transportation for all KMH activities.",
    description:
      "Logistik & Transportasi handles the operational backbone of KMH. From coordinating event logistics and managing equipment inventories to arranging transportation for spiritual trips, this division ensures everything runs smoothly.",
    category: "Internal Division",
    responsibilities: [
      "Manage organizational equipment and inventory",
      "Coordinate transportation for events and trips",
      "Handle event setup and breakdown",
      "Maintain safety protocols during activities",
      "Procure materials for events and programs",
    ],
    programs: [
      { name: "Equipment Audit", description: "Regular inventory review and maintenance of all organizational assets." },
      { name: "Spiritual Trip Coordination", description: "Organized pilgrimage trips to Hindu temples and sacred sites." },
      { name: "Event Operations Training", description: "Training for members on event setup and operational best practices." },
    ],
    image: "https://images.unsplash.com/photo-1769837230054-7f3a7356dde1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    members: [
      { name: "Putu Nanda", role: "Kepala Divisi", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop" },
      { name: "Made Aris", role: "Koordinator Transportasi", photo: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop" },
    ],
  },
  {
    id: "pengabdian-masyarakat",
    name: "Pengabdian Masyarakat",
    shortDescription: "Giving back to the community through social service programs inspired by Hindu values of compassion.",
    description:
      "Pengabdian Masyarakat channels the Hindu value of seva (selfless service) into meaningful community action. Through social programs, donations, and outreach, the division creates positive impact in the lives of others.",
    category: "External Division",
    responsibilities: [
      "Plan and execute community service programs",
      "Coordinate charity and donation drives",
      "Partner with local communities and NGOs",
      "Organize educational outreach initiatives",
      "Document and report social impact activities",
    ],
    programs: [
      { name: "Bakti Sosial", description: "Seasonal community service events including health checks and food donations." },
      { name: "Beasiswa Hindu", description: "Scholarship program supporting underprivileged Hindu students." },
      { name: "Desa Binaan", description: "Long-term community development program in partner villages." },
    ],
    image: "https://images.unsplash.com/photo-1769837230054-7f3a7356dde1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    members: [
      { name: "Ni Putu Sari", role: "Kepala Divisi", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop" },
      { name: "Wayan Budi", role: "Koordinator Sosial", photo: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop" },
    ],
  },
];

export const events = [
  {
    id: "nyepi-2025",
    name: "Perayaan Nyepi 2025",
    year: 2025,
    status: "Upcoming" as const,
    date: "March 29, 2025",
    location: "Telkom University Campus, Bandung",
    description:
      "Perayaan Hari Raya Nyepi adalah salah satu perayaan terpenting dalam kalender Hindu Bali. KMH Telkom University menyelenggarakan serangkaian kegiatan spiritual termasuk malam pengerupukan, persembahyangan bersama, dan refleksi diri dalam suasana hening dan penuh khidmat.",
    divisionId: "rohani",
    image: "https://images.unsplash.com/photo-1775551666383-06def6c9a753?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    gallery: [
      "https://images.unsplash.com/photo-1667133000547-36edda79f81d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1758274539654-23fa349cc090?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1747409020055-1c0228855371?w=400&h=300&fit=crop",
    ],
  },
  {
    id: "cultural-night-2025",
    name: "KMH Cultural Night 2025",
    year: 2025,
    status: "Upcoming" as const,
    date: "April 20, 2025",
    location: "Gedung Serba Guna, Telkom University",
    description:
      "KMH Cultural Night adalah malam seni dan budaya tahunan yang menampilkan pertunjukan tari tradisional Bali, musik gamelan, drama, dan berbagai ekspresi seni Hindu. Acara ini terbuka untuk seluruh civitas akademika Telkom University.",
    divisionId: "pengembangan-minat-bakat",
    image: "https://images.unsplash.com/photo-1766783419102-d5b5cae7d238?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    gallery: [
      "https://images.unsplash.com/photo-1766783419102-d5b5cae7d238?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1764599952551-2840e83fa5f8?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1708578200684-3aa944b73237?w=400&h=300&fit=crop",
    ],
  },
  {
    id: "bakti-sosial-2025",
    name: "Bakti Sosial KMH 2025",
    year: 2025,
    status: "Upcoming" as const,
    date: "May 10, 2025",
    location: "Desa Ciburial, Bandung",
    description:
      "Program pengabdian masyarakat tahunan KMH yang melibatkan kegiatan pemeriksaan kesehatan gratis, pembagian sembako, dan penyuluhan pendidikan di komunitas sekitar Bandung. Kegiatan ini adalah wujud nyata nilai seva dalam ajaran Hindu.",
    divisionId: "pengabdian-masyarakat",
    image: "https://images.unsplash.com/photo-1769837230054-7f3a7356dde1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    gallery: [
      "https://images.unsplash.com/photo-1769837230054-7f3a7356dde1?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1708578200684-3aa944b73237?w=400&h=300&fit=crop",
    ],
  },
  {
    id: "open-recruitment-2025",
    name: "Open Recruitment Semester Genap 2025",
    year: 2025,
    status: "Completed" as const,
    date: "February 1–14, 2025",
    location: "Telkom University Campus, Bandung",
    description:
      "Rekrutmen anggota baru KMH untuk semester genap tahun 2025. Membuka kesempatan bagi seluruh mahasiswa Hindu di Telkom University untuk bergabung dan berkontribusi dalam kegiatan organisasi.",
    divisionId: "kaderisasi",
    image: "https://images.unsplash.com/photo-1764599952551-2840e83fa5f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    gallery: [
      "https://images.unsplash.com/photo-1764599952551-2840e83fa5f8?w=400&h=300&fit=crop",
    ],
  },
  {
    id: "kmh-bazaar-2024",
    name: "KMH Bazaar 2024",
    year: 2024,
    status: "Completed" as const,
    date: "November 15, 2024",
    location: "Plaza Telkom University, Bandung",
    description:
      "Pasar kewirausahaan tahunan KMH yang menampilkan produk dan kreasi anggota, mulai dari makanan khas Bali, kerajinan tangan, hingga produk digital. Acara ini sekaligus menjadi wadah mengembangkan jiwa wirausaha anggota KMH.",
    divisionId: "kewirausahaan",
    image: "https://images.unsplash.com/photo-1698502250310-fcee55f8e197?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    gallery: [
      "https://images.unsplash.com/photo-1698502250310-fcee55f8e197?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1708578200684-3aa944b73237?w=400&h=300&fit=crop",
    ],
  },
  {
    id: "galungan-2024",
    name: "Perayaan Galungan & Kuningan 2024",
    year: 2024,
    status: "Completed" as const,
    date: "October 2, 2024",
    location: "Pura Agung Jagatnatha, Bandung",
    description:
      "Peringatan Hari Raya Galungan dan Kuningan yang merupakan salah satu hari suci terpenting bagi umat Hindu. KMH mengadakan persembahyangan bersama, pembuatan penjor, dan berbagai kegiatan keagamaan untuk mempererat persaudaraan.",
    divisionId: "rohani",
    image: "https://images.unsplash.com/photo-1775551666383-06def6c9a753?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    gallery: [
      "https://images.unsplash.com/photo-1667133000547-36edda79f81d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1775551666383-06def6c9a753?w=400&h=300&fit=crop",
    ],
  },
];

export const galleryImages = [
  { id: "g1", src: "https://images.unsplash.com/photo-1667133000547-36edda79f81d?w=600&h=450&fit=crop", event: "Perayaan Nyepi 2024", year: 2024 },
  { id: "g2", src: "https://images.unsplash.com/photo-1766783419102-d5b5cae7d238?w=600&h=450&fit=crop", event: "Cultural Night 2024", year: 2024 },
  { id: "g3", src: "https://images.unsplash.com/photo-1758274539654-23fa349cc090?w=600&h=450&fit=crop", event: "Rohani Retreat 2024", year: 2024 },
  { id: "g4", src: "https://images.unsplash.com/photo-1764599952551-2840e83fa5f8?w=600&h=450&fit=crop", event: "Open Recruitment 2025", year: 2025 },
  { id: "g5", src: "https://images.unsplash.com/photo-1747409020055-1c0228855371?w=600&h=450&fit=crop", event: "Galungan 2024", year: 2024 },
  { id: "g6", src: "https://images.unsplash.com/photo-1769837230054-7f3a7356dde1?w=600&h=450&fit=crop", event: "Bakti Sosial 2024", year: 2024 },
  { id: "g7", src: "https://images.unsplash.com/photo-1698502250310-fcee55f8e197?w=600&h=450&fit=crop", event: "KMH Bazaar 2024", year: 2024 },
  { id: "g8", src: "https://images.unsplash.com/photo-1758613655378-89bb3d122c57?w=600&h=450&fit=crop", event: "Media Workshop 2025", year: 2025 },
  { id: "g9", src: "https://images.unsplash.com/photo-1775551666383-06def6c9a753?w=600&h=450&fit=crop", event: "Galungan 2024", year: 2024 },
  { id: "g10", src: "https://images.unsplash.com/photo-1708578200684-3aa944b73237?w=600&h=450&fit=crop", event: "Leadership Summit 2025", year: 2025 },
  { id: "g11", src: "https://images.unsplash.com/photo-1667133000547-36edda79f81d?w=600&h=800&fit=crop", event: "Perayaan Nyepi 2025", year: 2025 },
  { id: "g12", src: "https://images.unsplash.com/photo-1766783419102-d5b5cae7d238?w=600&h=800&fit=crop", event: "Cultural Night 2025", year: 2025 },
];
