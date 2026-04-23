export const WHATSAPP_NUMBER = "6281400715402";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const NAV_LINKS = [
  { label: "Tentang", href: "#tentang" },
  { label: "Produk", href: "#produk" },
  { label: "Paket", href: "#paket" },
  { label: "Blog", href: "#blog" },
  { label: "Testimoni", href: "#testimonial" },
];

export const FAQ_ITEMS = [
  {
    question: "Berapa minimum order untuk snack box?",
    answer:
      "Minimum order kami adalah 20 pax per pesanan. Untuk pesanan di bawah 20 pax, silakan hubungi kami untuk konsultasi lebih lanjut.",
  },
  {
    question: "Berapa lama waktu pemesanan sebelum acara?",
    answer:
      "Kami rekomendasikan pemesanan minimal H-3 sebelum acara. Untuk pesanan dalam jumlah besar (100+ pax), sebaiknya minimal H-7 agar kami bisa memastikan ketersediaan bahan premium.",
  },
  {
    question: "Apakah bisa custom menu sesuai keinginan?",
    answer:
      "Tentu! Kami sangat terbuka untuk custom menu. Anda bisa memilih kombinasi jajanan sesuai selera atau berkonsultasi dengan tim kami untuk rekomendasi menu terbaik untuk acara Anda.",
  },
  {
    question: "Area mana saja yang dilayani pengiriman?",
    answer:
      "Saat ini kami melayani area Jabodetabek (Tangerang Selatan, Jakarta, Bogor, Depok, Tangerang, Bekasi ) dan sekitarnya. Untuk area di luar Jabodetabek, silakan hubungi kami untuk diskusi lebih lanjut.",
  },
  {
    question: "Apakah ada jaminan kualitas dan keamanan makanan?",
    answer:
      "Absolut! Semua produk kami diproduksi di dapur yang higienis dan terstandar. Bahan baku segar dipilih setiap hari, tanpa pengawet, dan dikemas secara food-grade untuk menjaga kualitas dan keamanan. Kami juga dapat mengirimkan sampel tester jika diperlukan, agar Anda bisa memastikan langsung kualitas rasa dan produk kami sebelum melakukan pemesanan.",
  },
  {
    question: "Bagaimana cara pembayaran?",
    answer:
      "Kami menerima pembayaran via transfer bank (BCA, Mandiri, BNI) dan e-wallet (GoPay, OVO, Dana). Untuk pesanan pertama, kami meminta DP 50% dan pelunasan sebelum pengiriman.",
  },
  {
    question: "Apakah bisa memesan hanya produk yang spesifik?",
    answer:
      "Tentu. Anda dapat memesan produk secara spesifik sesuai dengan kebutuhan acara Anda. Sebagai contoh, Anda dapat melakukan pemesanan 100 buah Risol Mayo dan 50 buah Bolu Kukus. Andrawina Kuliner siap melayani permintaan Anda dengan profesional dan menyesuaikan pesanan sesuai kebutuhan.",
  },
];

const BASE_DATE = new Date("2025-01-01").getTime();
const BASE_ORDERS = 10000;
const DAILY_MIN = 3;
const DAILY_MAX = 8;

function getDailyOrders(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysSinceBase = Math.floor((today.getTime() - BASE_DATE) / 86_400_000);

  let orders = BASE_ORDERS;
  const rng = (seed: number) => {
    const x = Math.sin(seed + 1) * 10000;
    return x - Math.floor(x);
  };

  for (let i = 0; i < daysSinceBase; i++) {
    orders += DAILY_MIN + Math.floor(rng(i) * (DAILY_MAX - DAILY_MIN + 1));
  }
  return orders;
}

export const STATS: { num: string; label: string; target: number }[] = [
  { num: "9+", label: "Tahun Berpengalaman", target: 9 },
  {
    num: `${getDailyOrders()}`,
    label: "Pesanan Terlayani",
    target: getDailyOrders(),
  },
  { num: "30+", label: "Mitra Institusi", target: 30 },
];

export const PRODUCTS = [
  {
    emoji: "🍃",
    name: "Lemper Ayam",
    desc: "Ketan pulen berbungkus daun pisang dengan isian ayam suwir berbumbu rempah autentik.",
    tag: "Best Seller",
    bg: "from-red-50 to-orange-50",
  },
  {
    emoji: "🥐",
    name: "Risol Mayo",
    desc: "Kulit risol renyah berisi ayam, sayuran segar, dan mayo creamy yang lezat.",
    tag: "Favorit",
    bg: "from-amber-50 to-orange-50",
  },
  {
    emoji: "🌯",
    name: "Sosis Solo",
    desc: "Kulit dadar tipis berisi daging sapi berbumbu khas Solo dengan aroma yang menggugah selera.",
    tag: "Tradisional",
    bg: "from-orange-50 to-red-50",
  },
  {
    emoji: "🧆",
    name: "Tahu Isi",
    desc: "Tahu goreng crispy berisi tumisan sayuran segar dengan taburan bawang goreng.",
    tag: "Populer",
    bg: "from-yellow-50 to-amber-50",
  },
  {
    emoji: "🎂",
    name: "Bolu Kukus",
    desc: "Bolu kukus lembut aneka varian rasa dengan tekstur ringan dan wangi yang khas.",
    tag: "Varian Baru",
    bg: "from-red-50 to-pink-50",
  },
  {
    emoji: "🍡",
    name: "Jajanan Pasar",
    desc: "Aneka jajanan pasar tradisional pilihan — klepon, onde-onde, wingko, dan masih banyak lagi.",
    tag: "Tradisional",
    bg: "from-green-50 to-emerald-50",
  },
];

export const PACKAGES = [
  {
    name: "Paket Essential",
    price: "Rp 19K",
    note: "per pax · min. 20 pax",
    featured: false,
    badge: null,
    items: [
      "3 item jajanan pasar pilihan",
      "1 air mineral 220 ml",
      "Kotak snack box standar",
      "Label nama & acara",
      "Pengiriman area Jabodetabek",
    ],
    waText: "Halo, saya ingin pesan Paket Essential",
  },
  {
    name: "Paket Deluxe",
    price: "Rp 23K",
    note: "per pax · min. 20 pax",
    featured: true,
    badge: "Terpopuler",
    items: [
      "4 item jajanan pasar pilihan",
      "1 air mineral 220 ml",
      "Kotak snack box premium",
      "Label nama & acara custom",
      "Pengiriman area Jabodetabek",
    ],
    waText: "Halo, saya ingin pesan Paket Deluxe",
  },
  {
    name: "Paket Signature",
    price: "Rp 32K",
    note: "per pax · min. 20 pax",
    featured: false,
    badge: null,
    items: [
      "5 item jajanan pasar premium",
      "1 air mineral 220 ml",
      "Kotak & paper bag eksklusif",
      "Branding acara full custom",
      "Free konsultasi menu",
      "Pengiriman area Jabodetabek",
    ],
    waText: "Halo, saya ingin pesan Paket Signature",
  },
];

export const EVENT_TYPES = [
  "Rapat / Meeting Kantor",
  "Seminar / Workshop",
  "Arisan / Pengajian",
  "Ulang Tahun",
  "Pernikahan / Resepsi",
  "Lainnya",
];

export const PACKAGE_OPTIONS = [
  "Paket Essential – Rp 19.000/pax",
  "Paket Deluxe – Rp 23.000/pax (Terpopuler)",
  "Paket Signature – Rp 32.000/pax",
  "Custom / Konsultasi dulu",
];

export const WHY_FEATURES = [
  {
    emoji: "🏆",
    title: "Kualitas Autentik Terjaga",
    desc: "Resep terstandarisasi dengan kontrol kualitas bahan baku ketat di setiap produksi.",
  },
  {
    emoji: "⏱️",
    title: "9 Tahun Pengalaman",
    desc: "Melayani ratusan acara instansi dan personal sejak 2017 dengan rekam jejak terpercaya.",
  },
  {
    emoji: "🤝",
    title: "Layanan Profesional",
    desc: "Penanganan pesanan sistematis, komunikasi responsif, dan pengiriman tepat waktu.",
  },
  {
    emoji: "🏢",
    title: "Dipercaya Institusi",
    desc: "Mitra langganan 50+ perusahaan dan instansi pemerintah untuk kebutuhan rutin.",
  },
];

export const WHY_IMAGES = [
  { emoji: "🍃", bg: "from-red-100 to-orange-100", mt: "mt-8" },
  { emoji: "🎁", bg: "from-amber-100 to-orange-100", mt: "" },
  { emoji: "🫕", bg: "from-orange-100 to-red-100", mt: "" },
  { emoji: "⭐", bg: "from-red-100 to-pink-100", mt: "-mt-8" },
];

export const TESTIMONIALS = [
  {
    text: "Sudah berlangganan selama 2 tahun untuk kebutuhan snack box rapat kantor. Rasa konsisten, pengiriman selalu tepat waktu, dan harga sangat worth it!",
    name: "Rina Kusumawati",
    role: "HR Manager, PT. Nusantara Jaya",
    initial: "R",
  },
  {
    text: "Lemper dan risol-nya beneran enak banget! Pesan untuk arisan keluarga 100 pax, semua tamu puas. Pasti order lagi buat acara berikutnya.",
    name: "Siti Rahayu",
    role: "Pelanggan Personal",
    initial: "S",
  },
  {
    text: "Kami percayakan kebutuhan snack seminar tahunan ke Andrawina. Profesional, responsif, dan produknya selalu fresh. Sangat direkomendasikan!",
    name: "Budi Santoso",
    role: "Panitia Seminar, Universitas Terbuka",
    initial: "B",
  },
];

export const CONTACT_INFO = [
  {
    emoji: "📱",
    label: "WhatsApp",
    value: "+62 814-0071-5402",
    href: WHATSAPP_URL,
  },
  {
    emoji: "⏰",
    label: "Jam Operasional",
    value: "Senin – Sabtu, 07.00 – 18.00 WIB",
    href: null,
  },
  {
    emoji: "📦",
    label: "Minimum Order",
    value: "20 pax per pesanan",
    href: null,
  },
  {
    emoji: "🚚",
    label: "Area Layanan",
    value: "Jabodetabek & sekitarnya",
    href: null,
  },
];

export const FOOTER_LINKS = [
  { label: "Tentang", href: "#tentang" },
  { label: "Produk", href: "#produk" },
  { label: "Paket", href: "#paket" },
  { label: "Blog", href: "#blog" },
  { label: "Testimoni", href: "#testimonial" },
  { label: "Kontak", href: "#kontak" },
];
