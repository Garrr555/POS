/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */

import {
  Plus,
  Search,
  Trash2,
  X,
  UtensilsCrossed,
  Package,
  Coffee,
  Soup,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Loading from "../components/Loading";
import type { BookingType, EventType } from "../types/type";
import CustomFetch from "../config/db";
import { toast } from "react-toastify";
import useEvents from "../hooks/useEvents";
import EventDetail from "../components/EventDetail";
import EventForm from "../components/EventForm";
import DataCard from "../components/DataCard";
import useOrders from "../hooks/useOrders";
import OrderForm from "../components/OrderForm";

const Menus = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Food");

  const { events, tagEvent, loading, getEvents, myEvent, saveEvents } =
    useEvents("1000", "1", search, "10");

  const { createOrder, loadingCreate } = useOrders();

  const [showOrderModal, setShowOrderModal] = useState(false);

  const [employees, setEmployees] = useState<EventType[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EventType | null>(
    null,
  );
  const [selectedSaveEmployee, setSelectedSaveEmployee] =
    useState<BookingType | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setEmployees(tagEvent);
  }, [events, tagEvent, myEvent, saveEvents]);

  const categories = useMemo(() => {
    const types = employees
      .map((item) => item.type?.trim())
      .filter((type): type is string => Boolean(type));

    return [...new Set(types)];
  }, [employees]);

  const filteredMenus = useMemo(() => {
    return employees.filter((item) => item.type?.trim() === selectedCategory);
  }, [employees, selectedCategory]);

  // Statistik berdasarkan data menu yang tersedia.
  const menuStats = useMemo(() => {
    const food = employees.filter(
      (item) => item.type?.trim().toLowerCase() === "food",
    ).length;
    const drink = employees.filter(
      (item) => item.type?.trim().toLowerCase() === "drink",
    ).length;

    return { food, drink, total: food + drink };
  }, [employees]);

  const closeFormModal = () => {
    setShowCreateModal(false);
    setSelectedEmployee(null);
    setSelectedSaveEmployee(null);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedEmployee(null);
    setSelectedSaveEmployee(null);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;

    setShowDeleteModal(false);
    setSelectedEmployee(null);
    setSelectedSaveEmployee(null);
  };

  const handleDeleteMenu = async () => {
    if (!selectedEmployee || isDeleting) return;

    setIsDeleting(true);

    try {
      await CustomFetch.delete(`/events/${selectedEmployee.ID}`);

      setShowDeleteModal(false);
      setSelectedEmployee(null);

      await getEvents();
      toast.success("Menu berhasil dihapus");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Gagal menghapus menu",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen animate-fade-in space-y-6 pb-8">
      {/* Dashboard Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {/* Total Menu */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Menu</p>
              <h3 className="mt-3 text-3xl font-bold text-slate-900">
                {menuStats.total}
              </h3>
              <p className="mt-2 text-xs text-slate-400">
                Semua produk terdaftar
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <Package size={23} />
            </div>
          </div>
        </div>

        {/* Food */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Food</p>
              <h3 className="mt-3 text-3xl font-bold text-slate-900">
                {menuStats.food}
              </h3>
              <p className="mt-2 text-xs text-slate-400">Produk makanan</p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Soup size={23} />
            </div>
          </div>
        </div>

        {/* Drink */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Drink</p>
              <h3 className="mt-3 text-3xl font-bold text-slate-900">
                {menuStats.drink}
              </h3>
              <p className="mt-2 text-xs text-slate-400">Produk minuman</p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Coffee size={23} />
            </div>
          </div>
        </div>
      </section>

      {/* Search and Categories */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="w-full">
          <div className="flex min-w-full items-center justify-between gap-1 sm:w-1/2">
            <div className="relative w-full sm:max-w-md">
              <Search
                size={19}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari makanan atau minuman..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-10 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
              />

              {search && (
                <button
                  type="button"
                  aria-label="Hapus pencarian"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedEmployee(null);
                  setSelectedSaveEmployee(null);
                  setShowCreateModal(true);
                }}
                aria-label="Tambah menu"
                title="Tambah menu"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-50 border border-orange-500 px-5 py-3 text-sm font-semibold text-orange-500 shadow-sm transition hover:bg-orange-100 active:scale-[0.98]"
              >
                <Plus size={18} />
                Add Menu
              </button>

              <button
                type="button"
                onClick={() => setShowOrderModal(true)}
                aria-label="Tambah Order"
                title="Tambah Order"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-[0.98]"
              >
                <Plus size={18} />
                Add Order
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Kategori
          </p>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${category === "Stock" && "hidden"} ${
                  selectedCategory === category
                    ? "bg-orange-500 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Catalog */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">Katalog Menu</h2>
          <p className="mt-1 text-sm text-slate-500">
            Daftar produk makanan dan minuman.
          </p>
        </div>

        {loading ? (
          <Loading />
        ) : filteredMenus.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredMenus.map((menu) => (
              <DataCard
                key={menu.ID}
                employee={menu}
                onDelete={(item) => {
                  setSelectedEmployee(item);
                  setShowDeleteModal(true);
                }}
                onEdit={(item) => {
                  setSelectedEmployee(item);
                  setSelectedSaveEmployee(null);
                  setShowCreateModal(true);
                }}
                onDetail={(item) => {
                  setSelectedEmployee(item);
                  setShowDetailModal(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-5 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
              <UtensilsCrossed size={30} />
            </div>

            <h3 className="text-base font-semibold text-slate-800">
              Menu tidak ditemukan
            </h3>

            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Tidak ada menu yang sesuai dengan pencarian atau kategori.
            </p>

            {(search || selectedCategory !== "Semua") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("Semua");
                }}
                className="mt-4 text-sm font-semibold text-orange-600 hover:text-orange-700"
              >
                Reset filter
              </button>
            )}
          </div>
        )}
      </section>

      {/* Detail Modal */}
      {showDetailModal && (
        <div
          onClick={closeDetailModal}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="my-8 w-full max-w-3xl rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Detail Menu
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Informasi lengkap produk.
                </p>
              </div>

              <button
                type="button"
                aria-label="Tutup detail"
                onClick={closeDetailModal}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <EventDetail
                initialData={selectedEmployee}
                onCancel={closeDetailModal}
              />
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showCreateModal && (
        <div
          onClick={closeFormModal}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="my-8 w-full max-w-3xl rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {selectedEmployee || selectedSaveEmployee
                    ? "Edit Menu"
                    : "Tambah Menu Baru"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedEmployee || selectedSaveEmployee
                    ? "Perbarui informasi produk."
                    : "Masukkan informasi makanan atau minuman."}
                </p>
              </div>

              <button
                type="button"
                aria-label="Tutup form"
                onClick={closeFormModal}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <EventForm
                initialData={
                  selectedEmployee || selectedSaveEmployee?.event || null
                }
                onSuccess={async () => {
                  closeFormModal();
                  await getEvents();
                }}
                onCancel={closeFormModal}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteModal && selectedEmployee && (
        <div
          onClick={closeDeleteModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
                  <Trash2 size={21} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">Hapus Menu</h2>
                  <p className="text-xs text-slate-500">
                    Konfirmasi penghapusan produk
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Tutup konfirmasi"
                disabled={isDeleting}
                onClick={closeDeleteModal}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            <div className="p-5">
              <p className="text-sm leading-6 text-slate-600">
                Apakah Anda yakin ingin menghapus menu{" "}
                <strong className="text-slate-900">
                  {selectedEmployee.name}
                </strong>
                ?
              </p>

              <p className="mt-2 text-xs text-slate-400">
                Tindakan ini tidak dapat dibatalkan.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={closeDeleteModal}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Batal
                </button>

                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDeleteMenu}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2 size={16} />
                  {isDeleting ? "Menghapus..." : "Hapus Menu"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Order Modal */}
      {showOrderModal && (
        <div
          onClick={() => {
            if (!loadingCreate) setShowOrderModal(false);
          }}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="my-8 w-full max-w-5xl rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Buat Order Baru
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Pilih produk, tentukan jumlah, dan metode pembayaran.
                </p>
              </div>

              <button
                type="button"
                aria-label="Tutup form order"
                disabled={loadingCreate}
                onClick={() => setShowOrderModal(false)}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <OrderForm
                products={employees}
                createOrder={createOrder}
                loadingCreate={loadingCreate}
                onSuccess={() => {
                  setShowOrderModal(false);
                  setSelectedEmployee(null);
                  setSelectedSaveEmployee(null);
                }}
                onCancel={() => setShowOrderModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menus;
