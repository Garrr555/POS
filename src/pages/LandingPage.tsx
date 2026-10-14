import {
  ArrowRight,
  BarChart3,
  ShoppingCart,
  Package,
  ShoppingCartIcon,
  LogIn,
  LayoutDashboard,
} from "lucide-react";
import { Link } from "react-router";
import { useAuthStore } from "../store/auth.store";

const LandingPage = () => {
  const { user } = useAuthStore();
  return (
    <div className="min-h-screen bg-orange-50 text-gray-900">
      {/* Navbar */}
      <nav className="border-b border-orange-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-white">
              <ShoppingCart size={20} />
            </div>

            <span className="text-xl font-bold text-orange-600">POS App</span>
          </div>

          <Link
            to="/login"
            className="rounded-lg bg-orange-500 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            {user ? (
              <div className="flex justify-center items-center gap-2">
                Dashboard
                <LayoutDashboard />
              </div>
            ) : (
              <div className="flex justify-center items-center gap-2">
                Login
                <LogIn />
              </div>
            )}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main>
        <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-6 py-16">
          <div className="grid w-full items-center gap-12 lg:grid-cols-2">
            {/* Left */}
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-600">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                Simple Point of Sale System
              </div>

              <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Kelola bisnis lebih mudah dengan{" "}
                <span className="text-orange-500">POS yang sederhana.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
                Kelola menu, stok, transaksi, dan pantau aktivitas bisnis dalam
                satu sistem yang mudah digunakan.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/login"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600"
                >
                  Mulai Sekarang
                  <ArrowRight
                    size={19}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <a
                  href="#features"
                  className="inline-flex items-center justify-center rounded-xl border border-orange-200 bg-white px-6 py-3.5 font-semibold text-gray-700 transition hover:bg-orange-50"
                >
                  Lihat Fitur
                </a>
              </div>
            </div>

            {/* Right - Dashboard Preview */}
            <div className="flex items-center justify-center bg-orange-500 rounded-full w-3/4 h-full">
              <ShoppingCartIcon size={300} className="text-orange-50" />
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-white px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-semibold text-orange-500">FITUR</p>

              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                Semua yang dibutuhkan untuk mengelola POS
              </h2>

              <p className="mt-4 text-gray-600">
                Sistem sederhana untuk membantu operasional bisnis sehari-hari.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-orange-100 bg-orange-50 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-white">
                  <ShoppingCart size={23} />
                </div>

                <h3 className="mt-5 text-xl font-bold">Point of Sale</h3>

                <p className="mt-2 leading-relaxed text-gray-600">
                  Proses transaksi dengan cepat dan mudah melalui halaman POS.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-white">
                  <Package size={23} />
                </div>

                <h3 className="mt-5 text-xl font-bold">Manajemen Stok</h3>

                <p className="mt-2 leading-relaxed text-gray-600">
                  Pantau jumlah stok produk dan ketahui produk yang mulai
                  menipis.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-white">
                  <BarChart3 size={23} />
                </div>

                <h3 className="mt-5 text-xl font-bold">Dashboard</h3>

                <p className="mt-2 leading-relaxed text-gray-600">
                  Lihat ringkasan transaksi dan aktivitas bisnis dalam satu
                  dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-5xl rounded-3xl bg-orange-500 px-6 py-14 text-center text-white shadow-xl shadow-orange-200 sm:px-12">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Siap mengelola bisnis dengan lebih mudah?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-orange-100">
              Mulai gunakan sistem POS untuk mengelola transaksi, menu, dan stok
              bisnis Anda.
            </p>

            <Link
              to="/login"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-orange-600 transition hover:bg-orange-50"
            >
              Masuk ke POS
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-orange-100 bg-white px-6 py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-sm text-gray-500">
          <p>© 2026 POS App</p>
          <p>Simple. Fast. Efficient.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
