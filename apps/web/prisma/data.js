const categories = [
  {
    name: "Akademik",
    description: "Diskusi dan informasi seputar akademik",
  },
  {
    name: "Beasiswa",
    description: "Diskusi dan informasi seputar beasiswa",
  },
  {
    name: "Kegiatan Kampus",
    description: "Diskusi dan informasi seputar kegiatan kampus",
  },
  {
    name: "Organisasi Mahasiswa",
    description: "Diskusi dan informasi seputar organisasi mahasiswa",
  },
  {
    name: "Kehidupan di Kampus",
    description: "Diskusi dan informasi seputar kehidupan di kampus",
  },
  {
    name: "Lowongan Kerja & Magang",
    description: "Diskusi dan informasi seputar lowongan kerja & magang",
  },
  {
    name: "Event & Seminar",
    description: "Diskusi dan informasi seputar event & seminar",
  },
  {
    name: "Teknologi & Startup",
    description: "Diskusi dan informasi seputar teknologi & startup",
  },
  {
    name: "Hiburan & Hobi",
    description: "Diskusi dan informasi seputar hiburan & hobi",
  },
  {
    name: "Olahraga",
    description: "Diskusi dan informasi seputar olahraga",
  },
  {
    name: "Kesehatan Mental & Fisik",
    description: "Diskusi dan informasi seputar kesehatan mental & fisik",
  },
  {
    name: "Akomodasi & Kos",
    description: "Diskusi dan informasi seputar akomodasi & kos",
  },
  {
    name: "Jual Beli Barang Mahasiswa",
    description: "Diskusi dan informasi seputar jual beli barang mahasiswa",
  },
  {
    name: "Opini & Diskusi Umum",
    description: "Diskusi dan informasi seputar opini & diskusi umum",
  },
  {
    name: "Keluh Kesah Mahasiswa",
    description: "Diskusi dan informasi seputar keluh kesah mahasiswa",
  },
  {
    name: "Tips & Trik Kuliah",
    description: "Diskusi dan informasi seputar tips & trik kuliah",
  },
  {
    name: "Bimbingan Skripsi & Tugas Akhir",
    description:
      "Diskusi dan informasi seputar bimbingan skripsi & tugas akhir",
  },
  {
    name: "Materi Kuliah & Referensi",
    description: "Diskusi dan informasi seputar materi kuliah & referensi",
  },
  {
    name: "Diskusi Mata Kuliah",
    description: "Diskusi dan informasi seputar diskusi mata kuliah",
  },
  {
    name: "Lomba & Kompetisi",
    description: "Diskusi dan informasi seputar lomba & kompetisi",
  },
  {
    name: "Relawan & Pengabdian Masyarakat",
    description:
      "Diskusi dan informasi seputar relawan & pengabdian masyarakat",
  },
  {
    name: "Bahasa & Literasi",
    description: "Diskusi dan informasi seputar bahasa & literasi",
  },
  {
    name: "Sains & Riset",
    description: "Diskusi dan informasi seputar sains & riset",
  },
  {
    name: "Keuangan & Manajemen Uang",
    description: "Diskusi dan informasi seputar keuangan & manajemen uang",
  },
  {
    name: "Peluang Bisnis Mahasiswa",
    description: "Diskusi dan informasi seputar peluang bisnis mahasiswa",
  },
  {
    name: "Kuliner & Resep",
    description: "Diskusi dan informasi seputar kuliner & resep",
  },
  {
    name: "Komunitas Pecinta Buku",
    description: "Diskusi dan informasi seputar komunitas pecinta buku",
  },
  {
    name: "Fotografi & Videografi",
    description: "Diskusi dan informasi seputar fotografi & videografi",
  },
  {
    name: "Gaming & E-Sports",
    description: "Diskusi dan informasi seputar gaming & e-sports",
  },
  {
    name: "Seni & Kreativitas",
    description: "Diskusi dan informasi seputar seni & kreativitas",
  },
  {
    name: "Musik & Band Kampus",
    description: "Diskusi dan informasi seputar musik & band kampus",
  },
  {
    name: "Travel & Backpacking",
    description: "Diskusi dan informasi seputar travel & backpacking",
  },
  {
    name: "Pengalaman Exchange & Kuliah di Luar Negeri",
    description:
      "Diskusi dan informasi seputar pengalaman exchange & kuliah di luar negeri",
  },
  {
    name: "Diskusi Politik & Sosial",
    description: "Diskusi dan informasi seputar diskusi politik & sosial",
  },
  {
    name: "Ekonomi & Bisnis",
    description: "Diskusi dan informasi seputar ekonomi & bisnis",
  },
  {
    name: "Lingkungan & Keberlanjutan",
    description: "Diskusi dan informasi seputar lingkungan & keberlanjutan",
  },
  {
    name: "Crypto & Investasi",
    description: "Diskusi dan informasi seputar crypto & investasi",
  },
  {
    name: "Keamanan & Keselamatan Kampus",
    description: "Diskusi dan informasi seputar keamanan & keselamatan kampus",
  },
  {
    name: "Startup Mahasiswa",
    description: "Diskusi dan informasi seputar startup mahasiswa",
  },
  {
    name: "Coding & Pengembangan Software",
    description: "Diskusi dan informasi seputar coding & pengembangan software",
  },
  {
    name: "Freelancing & Side Hustle",
    description: "Diskusi dan informasi seputar freelancing & side hustle",
  },
  {
    name: "Psikologi & Pengembangan Diri",
    description: "Diskusi dan informasi seputar psikologi & pengembangan diri",
  },
  {
    name: "Spiritualitas & Agama di Kampus",
    description:
      "Diskusi dan informasi seputar spiritualitas & agama di kampus",
  },
  {
    name: "Filosofi & Pemikiran Kritis",
    description: "Diskusi dan informasi seputar filosofi & pemikiran kritis",
  },
  {
    name: "Alumni & Networking",
    description: "Diskusi dan informasi seputar alumni & networking",
  },
  {
    name: "Persiapan Pascakampus",
    description: "Diskusi dan informasi seputar persiapan pascakampus",
  },
  {
    name: "Karier di Akademik & Penelitian",
    description:
      "Diskusi dan informasi seputar karier di akademik & penelitian",
  },
  {
    name: "Pendidikan & Inovasi Kurikulum",
    description: "Diskusi dan informasi seputar pendidikan & inovasi kurikulum",
  },
  {
    name: "Artificial Intelligence & Data Science",
    description:
      "Diskusi dan informasi seputar artificial intelligence & data science",
  },
  {
    name: "Cybersecurity & Hacking Etis",
    description: "Diskusi dan informasi seputar cybersecurity & hacking etis",
  },
  {
    name: "Robotika & IoT",
    description: "Diskusi dan informasi seputar robotika & iot",
  },
  {
    name: "Astronomi & Ruang Angkasa",
    description: "Diskusi dan informasi seputar astronomi & ruang angkasa",
  },
  {
    name: "Ilmu Sosial & Budaya",
    description: "Diskusi dan informasi seputar ilmu sosial & budaya",
  },
  {
    name: "Fiksi & Karya Sastra",
    description: "Diskusi dan informasi seputar fiksi & karya sastra",
  },
  {
    name: "Film & Review",
    description: "Diskusi dan informasi seputar film & review",
  },
  {
    name: "Anime, Manga & Webtoon",
    description: "Diskusi dan informasi seputar anime, manga & webtoon",
  },
  {
    name: "Desain Grafis & UI/UX",
    description: "Diskusi dan informasi seputar desain grafis & ui/ux",
  },
  {
    name: "3D Modeling & Animasi",
    description: "Diskusi dan informasi seputar 3d modeling & animasi",
  },
  {
    name: "Jaringan & Infrastruktur IT",
    description: "Diskusi dan informasi seputar jaringan & infrastruktur it",
  },
  {
    name: "Pengembangan Game",
    description: "Diskusi dan informasi seputar pengembangan game",
  },
  {
    name: "Edukasi Seks & Kesehatan Reproduksi",
    description:
      "Diskusi dan informasi seputar edukasi seks & kesehatan reproduksi",
  },
  {
    name: "Hak & Hukum Mahasiswa",
    description: "Diskusi dan informasi seputar hak & hukum mahasiswa",
  },
  {
    name: "Sosiologi & Antropologi",
    description: "Diskusi dan informasi seputar sosiologi & antropologi",
  },
  {
    name: "Sejarah & Peradaban",
    description: "Diskusi dan informasi seputar sejarah & peradaban",
  },
  {
    name: "Matematika & Statistika",
    description: "Diskusi dan informasi seputar matematika & statistika",
  },
  {
    name: "Fisika & Teknik",
    description: "Diskusi dan informasi seputar fisika & teknik",
  },
  {
    name: "Kimia & Bioteknologi",
    description: "Diskusi dan informasi seputar kimia & bioteknologi",
  },
  {
    name: "Kedokteran & Ilmu Kesehatan",
    description: "Diskusi dan informasi seputar kedokteran & ilmu kesehatan",
  },
  {
    name: "Farmasi & Obat-obatan",
    description: "Diskusi dan informasi seputar farmasi & obat-obatan",
  },
  {
    name: "Peternakan & Agribisnis",
    description: "Diskusi dan informasi seputar peternakan & agribisnis",
  },
  {
    name: "Perikanan & Kelautan",
    description: "Diskusi dan informasi seputar perikanan & kelautan",
  },
  {
    name: "Arsitektur & Perencanaan Kota",
    description: "Diskusi dan informasi seputar arsitektur & perencanaan kota",
  },
  {
    name: "Transportasi & Mobilitas",
    description: "Diskusi dan informasi seputar transportasi & mobilitas",
  },
  {
    name: "Machine Learning & Big Data",
    description: "Diskusi dan informasi seputar machine learning & big data",
  },
  {
    name: "Virtual Reality & Augmented Reality",
    description:
      "Diskusi dan informasi seputar virtual reality & augmented reality",
  },
  {
    name: "Podcasting & Konten Kreator",
    description: "Diskusi dan informasi seputar podcasting & konten kreator",
  },
  {
    name: "Stand Up Comedy & Humor",
    description: "Diskusi dan informasi seputar stand up comedy & humor",
  },
  {
    name: "Pendidikan Anak & Remaja",
    description: "Diskusi dan informasi seputar pendidikan anak & remaja",
  },
  {
    name: "Pengaruh Media Sosial",
    description: "Diskusi dan informasi seputar pengaruh media sosial",
  },
  {
    name: "Budaya Pop & Tren",
    description: "Diskusi dan informasi seputar budaya pop & tren",
  },
  {
    name: "DIY & Kerajinan Tangan",
    description: "Diskusi dan informasi seputar diy & kerajinan tangan",
  },
  {
    name: "E-commerce & Marketplace",
    description: "Diskusi dan informasi seputar e-commerce & marketplace",
  },
  {
    name: "Automotif & Modifikasi Kendaraan",
    description:
      "Diskusi dan informasi seputar automotif & modifikasi kendaraan",
  },
  {
    name: "Energi Terbarukan & Teknologi Hijau",
    description:
      "Diskusi dan informasi seputar energi terbarukan & teknologi hijau",
  },
  {
    name: "Teknik Sipil & Konstruksi",
    description: "Diskusi dan informasi seputar teknik sipil & konstruksi",
  },
  {
    name: "Keamanan Siber & Forensik Digital",
    description:
      "Diskusi dan informasi seputar keamanan siber & forensik digital",
  },
  {
    name: "E-Sport Management & Streaming",
    description: "Diskusi dan informasi seputar e-sport management & streaming",
  },
  {
    name: "Startup & Kewirausahaan Digital",
    description:
      "Diskusi dan informasi seputar startup & kewirausahaan digital",
  },
  {
    name: "Pemasaran Digital & SEO",
    description: "Diskusi dan informasi seputar pemasaran digital & seo",
  },
  {
    name: "Periklanan & Branding",
    description: "Diskusi dan informasi seputar periklanan & branding",
  },
  {
    name: "Hubungan Internasional & Diplomasi",
    description:
      "Diskusi dan informasi seputar hubungan internasional & diplomasi",
  },
  {
    name: "Manajemen Acara & Event Organizer",
    description:
      "Diskusi dan informasi seputar manajemen acara & event organizer",
  },
  {
    name: "Pariwisata & Industri Kreatif",
    description: "Diskusi dan informasi seputar pariwisata & industri kreatif",
  },
  {
    name: "Jurnalisme & Media",
    description: "Diskusi dan informasi seputar jurnalisme & media",
  },
  {
    name: "Gaya Hidup Minimalis & Produktivitas",
    description:
      "Diskusi dan informasi seputar gaya hidup minimalis & produktivitas",
  },
  {
    name: "Self-Improvement & Kebiasaan Positif",
    description:
      "Diskusi dan informasi seputar self-improvement & kebiasaan positif",
  },
  {
    name: "Mahasiswa Difabel & Inklusivitas",
    description:
      "Diskusi dan informasi seputar mahasiswa difabel & inklusivitas",
  },
  {
    name: "Karier di Perusahaan Multinasional",
    description:
      "Diskusi dan informasi seputar karier di perusahaan multinasional",
  },
  {
    name: "Investasi Properti & Real Estate",
    description:
      "Diskusi dan informasi seputar investasi properti & real estate",
  },
];

module.exports = { categories };
