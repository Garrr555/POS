import {
  ArrowRight,
  BarChart3,
  ShoppingCart,
  Package,
  LogIn,
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Boxes,
  Receipt,
  Clock3,
  CheckCircle2,
  Menu,
  X,
  ChevronRight,
  Store,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { useAuthStore } from "../store/auth.store";

const features = [
  {
    icon: ShoppingCart,
    title: "Point of Sale",
    description:
      "Proses transaksi dengan cepat dan mudah. Semua kebutuhan penjualan tersedia dalam satu halaman.",
    number: "01",
  },
  {
    icon: Package,
    title: "Manajemen Stok",
    description:
      "Pantau jumlah stok produk, kelola persediaan, dan ketahui produk yang mulai menipis.",
    number: "02",
  },
  {
    icon: BarChart3,
    title: "Business Analytics",
    description:
      "Pantau performa bisnis melalui ringkasan penjualan, laporan, dan aktivitas transaksi.",
    number: "03",
  },
];

const LandingPage = () => {
  const { user } = useAuthStore();
  const [mobileMenu, setMobileMenu] = useState(false);

  const dashboardLink = "/login";

  return (
    <div className="min-h-screen overflow-hidden bg-white text-neutral-900 selection:bg-orange-200 selection:text-orange-900">
      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-100/80 bg-white/85 backdrop-blur-xl">
        <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-x shadow-lg shadow-orange-500/20 rounded-full">
              <img src="/Colorful P Logo Icon Set4 noBg.png" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              Peace<span className="text-orange-500"> POS</span>
            </span>
          </Link>

          <div className="hidden items-center gap-9 md:flex">
            <a
              href="#home"
              className="text-sm font-medium text-neutral-600 transition hover:text-orange-500"
            >
              Home
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-neutral-600 transition hover:text-orange-500"
            >
              Fitur
            </a>
            <a
              href="#about"
              className="text-sm font-medium text-neutral-600 transition hover:text-orange-500"
            >
              Tentang
            </a>
          </div>

          <div className="hidden md:block">
            <Link
              to={dashboardLink}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-lg"
            >
              {user ? "Dashboard" : "Login"}
              {user ? <LayoutDashboard size={17} /> : <LogIn size={17} />}
            </Link>
          </div>

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 text-neutral-700 md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileMenu ? <X size={21} /> : <Menu size={21} />}
          </button>
        </nav>

        {mobileMenu && (
          <div className="border-t border-neutral-100 bg-white px-5 py-5 shadow-xl md:hidden">
            <div className="flex flex-col gap-4">
              <a
                onClick={() => setMobileMenu(false)}
                href="#home"
                className="text-sm font-medium"
              >
                Home
              </a>
              <a
                onClick={() => setMobileMenu(false)}
                href="#features"
                className="text-sm font-medium"
              >
                Fitur
              </a>
              <a
                onClick={() => setMobileMenu(false)}
                href="#about"
                className="text-sm font-medium"
              >
                Tentang
              </a>
              <Link
                to={dashboardLink}
                className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white"
              >
                {user ? "Dashboard" : "Login"}
                {user ? <LayoutDashboard size={17} /> : <LogIn size={17} />}
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section
          id="home"
          className="relative overflow-hidden bg-[#fffaf6] pt-32 sm:pt-36 lg:pt-40"
        >
          {/* Background decoration */}
          <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-orange-200/30 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-orange-100/70 blur-[100px]" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 pb-24 sm:px-8 lg:grid-cols-2 lg:px-10 lg:pb-32">
            {/* Hero content */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-xs font-bold tracking-wide text-orange-600 shadow-sm sm:text-sm">
                <Zap size={15} fill="currentColor" />
                POINT OF SALE
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              </div>

              <h1 className="max-w-2xl text-4xl font-black leading-[1.15] tracking-tight text-neutral-900 sm:text-5xl lg:text-[62px]">
                Kelola bisnis dengan{" "}
                <span className="relative inline-block text-orange-500">
                  Peace POS.
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 240 12"
                    fill="none"
                  >
                    <path
                      d="M3 9C65 1 174 1 237 8"
                      stroke="#FDBA74"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-neutral-600 sm:text-lg">
                Satu sistem untuk mengelola transaksi, menu, stok, dan laporan
                bisnis. Lebih terorganisir, lebih efisien, dan mudah digunakan.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={dashboardLink}
                  className="group inline-flex items-center justify-center gap-3 rounded-xl bg-orange-500 px-7 py-4 font-bold text-white shadow-xl shadow-orange-500/25 transition duration-300 hover:-translate-y-1 hover:bg-orange-600"
                >
                  Mulai Sekarang
                  <ArrowRight
                    size={19}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-7 py-4 font-semibold text-neutral-700 transition hover:border-orange-300 hover:bg-orange-50"
                >
                  Jelajahi Fitur
                  <ChevronRight size={18} />
                </a>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-neutral-500">
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-orange-500" />
                  Mudah digunakan
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-orange-500" />
                  Manajemen terintegrasi
                </span>
              </div>
            </motion.div>

            {/* Dashboard preview */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mx-auto w-full max-w-[570px] lg:ml-auto"
            >
              <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-orange-200/50 blur-3xl" />

              <div className="relative rounded-2xl border border-orange-100 bg-white p-3 shadow-2xl shadow-orange-900/10 sm:rounded-3xl sm:p-5">
                {/* Preview header */}
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white">
                      <Store size={19} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Peace POS</p>
                      <p className="text-[10px] text-neutral-400">
                        Business Overview
                      </p>
                    </div>
                  </div>
                  <div className="rounded-lg bg-green-50 px-3 py-1.5 text-[10px] font-bold text-green-600">
                    ● System Online
                  </div>
                </div>

                {/* Dashboard title */}
                <div className="mb-4 mt-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold sm:text-lg">
                      Dashboard
                    </h3>
                    <p className="mt-1 text-[11px] text-neutral-400">
                      Ringkasan aktivitas bisnis
                    </p>
                  </div>
                  <div className="rounded-lg border border-neutral-100 px-3 py-2 text-[10px] text-neutral-500">
                    Hari ini
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-3">
                    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                      <Receipt size={16} />
                    </div>
                    <p className="text-[10px] text-neutral-500">
                      Total Transaksi
                    </p>
                    <p className="mt-1 text-xl font-black">128</p>
                    <p className="mt-1 flex items-center gap-1 text-[9px] font-semibold text-green-600">
                      <TrendingUp size={11} /> +12.5%
                    </p>
                  </div>

                  <div className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-3">
                    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600">
                      <TrendingUp size={16} />
                    </div>
                    <p className="text-[10px] text-neutral-500">
                      Total Pendapatan
                    </p>
                    <p className="mt-1 text-xl font-black">Rp2.4jt</p>
                    <p className="mt-1 flex items-center gap-1 text-[9px] font-semibold text-green-600">
                      <TrendingUp size={11} /> +8.2%
                    </p>
                  </div>

                  <div className="col-span-2 rounded-xl border border-neutral-100 bg-neutral-50/70 p-3 sm:col-span-1">
                    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <Boxes size={16} />
                    </div>
                    <p className="text-[10px] text-neutral-500">Total Produk</p>
                    <p className="mt-1 text-xl font-black">48</p>
                    <p className="mt-1 flex items-center gap-1 text-[9px] font-semibold text-neutral-400">
                      <TrendingDown size={11} /> 3 stok rendah
                    </p>
                  </div>
                </div>

                {/* Chart */}
                <div className="mt-4 rounded-xl border border-neutral-100 p-4">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold">Statistik Penjualan</p>
                      <p className="mt-1 text-[10px] text-neutral-400">
                        Aktivitas mingguan
                      </p>
                    </div>
                    <BarChart3 size={18} className="text-orange-500" />
                  </div>

                  <div className="flex h-28 items-end justify-between gap-2 px-1">
                    {[38, 65, 48, 85, 58, 100, 73].map((height, index) => (
                      <div
                        key={index}
                        className="flex h-full flex-1 flex-col justify-end"
                      >
                        <div
                          style={{ height: `${height}%` }}
                          className={`w-full rounded-t-md transition-all ${
                            index === 5 ? "bg-orange-500" : "bg-orange-200"
                          }`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 flex justify-between text-[9px] text-neutral-400">
                    {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map(
                      (day) => (
                        <span key={day}>{day}</span>
                      ),
                    )}
                  </div>
                </div>

                {/* Bottom information */}
                <div className="mt-4 flex items-center justify-between rounded-xl bg-orange-50 p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                      <Clock3 size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold">Aktivitas bisnis</p>
                      <p className="text-[9px] text-neutral-500">
                        Semua data dalam satu tempat
                      </p>
                    </div>
                  </div>
                  <CheckCircle2 size={20} className="text-green-500" />
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-7 -left-3 flex items-center gap-3 rounded-xl border border-neutral-100 bg-white p-3 shadow-xl sm:-left-10 sm:p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                  <ShieldCheck size={21} />
                </div>
                <div>
                  <p className="text-xs font-bold">Business Made Easy</p>
                  <p className="mt-1 text-[10px] text-neutral-400">
                    Manage everything easily
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="px-5 py-24 sm:px-8 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-2xl text-center"
            >
              <span className="inline-flex rounded-full bg-orange-100 px-4 py-2 text-xs font-bold tracking-widest text-orange-600">
                FITUR UTAMA
              </span>

              <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Semua kebutuhan bisnis,{" "}
                <span className="text-orange-500">satu sistem.</span>
              </h2>

              <p className="mt-5 leading-8 text-neutral-500">
                Dirancang untuk membantu operasional bisnis sehari-hari menjadi
                lebih praktis, terstruktur, dan efisien.
              </p>
            </motion.div>

            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={feature.number}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.12 }}
                    className="group relative overflow-hidden rounded-2xl border border-neutral-100 bg-white p-7 transition duration-300 hover:-translate-y-2 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-900/5 sm:p-8"
                  >
                    <div className="absolute right-5 top-5 text-5xl font-black text-neutral-50 transition group-hover:text-orange-50">
                      {feature.number}
                    </div>

                    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 transition duration-300 group-hover:bg-orange-500 group-hover:text-white">
                      <Icon size={26} />
                    </div>

                    <h3 className="mt-7 text-xl font-bold">{feature.title}</h3>

                    <p className="mt-3 text-sm leading-7 text-neutral-500">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* About / Benefits */}
        <section
          id="about"
          className="bg-[#fffaf6] px-5 py-24 sm:px-8 lg:px-10 lg:py-28"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-orange-500">
                WHY PEACE POS?
              </span>

              <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Fokus pada bisnis.{" "}
                <span className="text-orange-500">
                  Biar sistem yang membantu.
                </span>
              </h2>

              <p className="mt-6 leading-8 text-neutral-600">
                Tidak perlu berpindah-pindah aplikasi untuk mengelola
                operasional. Peace POS menyatukan proses penjualan, pengelolaan
                stok, dan pemantauan bisnis dalam satu platform.
              </p>

              <div className="mt-9 space-y-5">
                {[
                  [
                    "Lebih praktis",
                    "Akses kebutuhan operasional dalam satu sistem.",
                  ],
                  [
                    "Lebih terorganisir",
                    "Data transaksi dan stok tersimpan secara terstruktur.",
                  ],
                  [
                    "Lebih mudah dipantau",
                    "Pantau aktivitas dan performa bisnis melalui dashboard.",
                  ],
                ].map(([title, description]) => (
                  <div key={title} className="flex gap-4">
                    <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                      <CheckCircle2 size={19} />
                    </div>
                    <div>
                      <h3 className="font-bold">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-neutral-500">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-orange-200/40 blur-2xl" />
              <div className="relative overflow-hidden rounded-3xl bg-orange-500 p-8 text-white shadow-2xl shadow-orange-500/20 sm:p-12">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[40px] border-white/10" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full border-[40px] border-white/10" />

                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                    <Store size={28} />
                  </div>

                  <h3 className="mt-9 text-3xl font-black leading-tight sm:text-4xl">
                    Satu langkah menuju pengelolaan bisnis yang lebih baik.
                  </h3>

                  <p className="mt-5 max-w-md leading-7 text-orange-100">
                    Mulai sederhanakan aktivitas bisnis dan kelola semuanya
                    dengan lebih terstruktur menggunakan Peace POS.
                  </p>

                  <Link
                    to={dashboardLink}
                    className="mt-9 inline-flex items-center gap-3 rounded-xl bg-white px-6 py-4 font-bold text-orange-600 transition hover:-translate-y-1 hover:bg-orange-50"
                  >
                    Mulai Sekarang
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 py-24 sm:px-8 lg:px-10">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-neutral-950 px-6 py-16 text-center sm:px-12 sm:py-20">
            <div className="absolute -left-24 -top-32 h-80 w-80 rounded-full bg-orange-500/20 blur-[90px]" />
            <div className="absolute -bottom-40 -right-20 h-80 w-80 rounded-full bg-orange-500/20 blur-[90px]" />

            <div className="relative">
              <span className="inline-flex rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-2 text-xs font-bold tracking-widest text-orange-400">
                PEACE POS
              </span>

              <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Siap mengelola bisnis dengan lebih mudah?
              </h2>

              <p className="mx-auto mt-5 max-w-xl leading-8 text-neutral-400">
                Mulai gunakan Peace POS untuk mengelola transaksi, produk, stok,
                dan laporan bisnis Anda.
              </p>

              <Link
                to={dashboardLink}
                className="mt-9 inline-flex items-center gap-3 rounded-xl bg-orange-500 px-7 py-4 font-bold text-white shadow-xl shadow-orange-500/20 transition hover:-translate-y-1 hover:bg-orange-600"
              >
                {user ? "Masuk ke Dashboard" : "Masuk ke Peace POS"}
                <ArrowRight size={19} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-100 bg-white px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 sm:flex-row">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full">
              <img src="/Colorful P Logo Icon Set4 noBg.png" />
            </div>
            <span className="font-extrabold">
              Peace<span className="text-orange-500"> POS</span>
            </span>
          </Link>

          <p className="text-center text-xs text-neutral-400">
            © 2026 Peace POS. All rights reserved.
          </p>

          <p className="text-xs font-medium text-neutral-500">
            Simple. Fast. Efficient.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
