/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  Package,
  Search,
  RefreshCw,
  Trash2,
  X,
  AlertTriangle,
  Plus,
} from "lucide-react";

import { toast } from "react-toastify";

import CustomFetch from "../config/db";
import Loading from "../components/Loading";
import StockCard from "../components/StockCard";
import EventForm from "../components/EventForm";
import EventDetail from "../components/EventDetail";

import type { EventType } from "../types/type";
import useEvents from "../hooks/useEvents";
import { useAuthStore } from "../store/auth.store";

const STOCK_DEBOUNCE_MS = 500;

type PendingStockChange = {
  baseCount: number;
  difference: number;
  employee: EventType;
};

export default function Stock() {
  const { user } = useAuthStore();
  const { events, tagEvent, loading, getEvents, myEvent, saveEvents } =
    useEvents("1000", "1", "", "10");

  const [employees, setEmployees] = useState<EventType[]>([]);
  const [search, setSearch] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState<EventType | null>(
    null,
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [updatingStockId, setUpdatingStockId] = useState<number | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Timer dan perubahan stok disimpan per produk.
  const stockTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const pendingStockChanges = useRef<Record<number, PendingStockChange>>({});

  // Mencegah request stok bersamaan untuk produk yang sama.
  const updatingStockIds = useRef<Set<number>>(new Set());

  // Menyimpan stok terbaru, termasuk perubahan yang belum dikirim ke BE.
  const latestStock = useRef<Record<number, number>>({});

  // Ambil hanya produk bertipe stock.
  useEffect(() => {
    const stockProducts = (tagEvent ?? []).filter(
      (item) => item.type?.trim().toLowerCase() === "stock",
    );

    setEmployees((previous) => {
      const updatedProducts = stockProducts.map((item) => {
        const pending = pendingStockChanges.current[item.ID];

        // Jangan menimpa stok optimistis dengan data lama dari BE.
        if (pending) {
          return {
            ...item,
            count: Math.max(0, pending.baseCount + pending.difference),
          };
        }

        if (updatingStockIds.current.has(item.ID)) {
          return {
            ...item,
            count:
              latestStock.current[item.ID] ??
              Math.max(0, Number(item.count) || 0),
          };
        }

        return item;
      });

      updatedProducts.forEach((item) => {
        if (
          !pendingStockChanges.current[item.ID] &&
          !updatingStockIds.current.has(item.ID)
        ) {
          latestStock.current[item.ID] = Math.max(0, Number(item.count) || 0);
        }
      });

      // Mempertahankan referensi state jika data tidak berubah.
      if (
        previous.length === updatedProducts.length &&
        previous.every((oldItem) => {
          const newItem = updatedProducts.find(
            (item) => item.ID === oldItem.ID,
          );

          return (
            newItem &&
            Number(newItem.count) === Number(oldItem.count) &&
            newItem.UpdatedAt === oldItem.UpdatedAt
          );
        })
      ) {
        return previous;
      }

      return updatedProducts;
    });
  }, [events, tagEvent, myEvent, saveEvents]);

  // Pencarian produk.
  const filteredMenus = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return employees.filter(
      (item) =>
        (item.name ?? "").toLowerCase().includes(keyword) ||
        (item.description ?? "").toLowerCase().includes(keyword),
    );
  }, [employees, search]);

  // Simpan perubahan stok ke BE.
  const saveStockChange = useCallback(
    async (id: number) => {
      const pending = pendingStockChanges.current[id];

      if (!pending || updatingStockIds.current.has(id)) return;

      // Hentikan timer dan ambil perubahan yang sudah terkumpul.
      if (stockTimers.current[id]) {
        clearTimeout(stockTimers.current[id]);
        delete stockTimers.current[id];
      }

      delete pendingStockChanges.current[id];

      const nextCount = Math.max(0, pending.baseCount + pending.difference);

      // Tidak perlu mengirim request jika stok tidak berubah.
      if (nextCount === pending.baseCount) return;

      updatingStockIds.current.add(id);
      setUpdatingStockId(id);

      const payload = new FormData();
      payload.append("count", String(nextCount));

      try {
        await CustomFetch.put(`/events/${id}`, payload);

        latestStock.current[id] = nextCount;

        setEmployees((previous) =>
          previous.map((product) =>
            product.ID === id ? { ...product, count: nextCount } : product,
          ),
        );

        toast.success("Jumlah stok berhasil diperbarui");

        await getEvents();
      } catch (error: any) {
        // Kembalikan stok ke nilai sebelum perubahan yang gagal.
        latestStock.current[id] = pending.baseCount;

        setEmployees((previous) =>
          previous.map((product) =>
            product.ID === id
              ? { ...product, count: pending.baseCount }
              : product,
          ),
        );

        toast.error(
          error?.response?.data?.error ||
            error?.response?.data?.message ||
            "Gagal memperbarui jumlah stok",
        );

        try {
          await getEvents();
        } catch {
          // Stok lokal sudah dikembalikan ke nilai sebelumnya.
        }
      } finally {
        updatingStockIds.current.delete(id);
        setUpdatingStockId((current) => (current === id ? null : current));

        // Jika ada perubahan baru yang menunggu, proses kembali.
        if (pendingStockChanges.current[id]) {
          stockTimers.current[id] = setTimeout(() => {
            void saveStockChange(id);
          }, STOCK_DEBOUNCE_MS);
        }
      }
    },
    [getEvents],
  );

  // Tambah atau kurangi stok dengan debounce.
  const handleStockChange = (item: EventType, difference: number) => {
    const id = item.ID;

    // Hindari perubahan saat request produk yang sama sedang berjalan.
    if (updatingStockIds.current.has(id)) return;

    const existingPending = pendingStockChanges.current[id];

    const currentCount = existingPending
      ? Math.max(0, existingPending.baseCount + existingPending.difference)
      : (latestStock.current[id] ?? Math.max(0, Number(item.count) || 0));

    const nextCount = Math.max(0, currentCount + difference);

    if (nextCount === currentCount) return;

    // Simpan stok dasar sekali saja, lalu akumulasikan perubahan.
    pendingStockChanges.current[id] = {
      baseCount: existingPending ? existingPending.baseCount : currentCount,
      difference: existingPending
        ? existingPending.difference + difference
        : difference,
      employee: item,
    };

    latestStock.current[id] = nextCount;

    // Perbarui UI tanpa menunggu BE.
    setEmployees((previous) =>
      previous.map((product) =>
        product.ID === id ? { ...product, count: nextCount } : product,
      ),
    );

    // Reset timer setiap ada klik baru pada produk yang sama.
    if (stockTimers.current[id]) {
      clearTimeout(stockTimers.current[id]);
    }

    stockTimers.current[id] = setTimeout(() => {
      void saveStockChange(id);
    }, STOCK_DEBOUNCE_MS);
  };

  // Bersihkan semua timer saat komponen dilepas.
  useEffect(() => {
    return () => {
      Object.values(stockTimers.current).forEach((timer) => {
        clearTimeout(timer);
      });
    };
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);

    try {
      await getEvents();
      toast.success("Data stok berhasil diperbarui");
    } catch {
      toast.error("Gagal memperbarui data stok");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Buka modal detail.
  const handleDetail = (item: EventType) => {
    setSelectedEmployee(item);
    setIsDetailOpen(true);
  };

  // Buka modal edit.
  const handleEdit = (item: EventType) => {
    setSelectedEmployee(item);
    setIsFormOpen(true);
  };

  // Buka modal konfirmasi hapus.
  const handleDelete = (item: EventType) => {
    setSelectedEmployee(item);
    setIsDeleteOpen(true);
  };

  // Jalankan penghapusan setelah konfirmasi.
  const confirmDelete = async () => {
    if (!selectedEmployee || isDeleting) return;

    const id = selectedEmployee.ID;

    // Batalkan perubahan stok tertunda sebelum menghapus produk.
    if (stockTimers.current[id]) {
      clearTimeout(stockTimers.current[id]);
      delete stockTimers.current[id];
    }

    delete pendingStockChanges.current[id];
    delete latestStock.current[id];

    setIsDeleting(true);

    try {
      await CustomFetch.delete(`/events/${id}`);

      setEmployees((previous) => previous.filter((item) => item.ID !== id));

      toast.success("Produk berhasil dihapus");

      setIsDeleteOpen(false);
      setSelectedEmployee(null);

      await getEvents();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Gagal menghapus produk",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const closeEditModal = () => {
    setIsFormOpen(false);
    setSelectedEmployee(null);
  };

  const closeDetailModal = () => {
    setIsDetailOpen(false);
    setSelectedEmployee(null);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;

    setIsDeleteOpen(false);
    setSelectedEmployee(null);
  };

  if (loading && employees.length === 0) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Search */}
        <div className="rounded-2xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari nama atau deskripsi..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={isRefreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>

              <div className={`${user?.role === "admin" ? "" : "hidden"}`}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedEmployee(null);
                    setIsFormOpen(true);
                  }}
                  aria-label="Tambah stok"
                  title="Tambah stok"
                  className={`${user?.role === "admin" ? "" : "hidden"} inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-[0.98]`}
                >
                  <Plus size={18} />
                  Add Stock
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product list */}
        {filteredMenus.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredMenus.map((menu) => (
              <StockCard
                key={menu.ID}
                employee={menu}
                onDetail={handleDetail}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStockChange={handleStockChange}
                isUpdating={updatingStockId === menu.ID}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Package size={27} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-800">
              {search ? "Produk tidak ditemukan" : "Belum ada produk stok"}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {search
                ? "Coba gunakan kata kunci pencarian yang berbeda."
                : 'Produk dengan type "stock" akan ditampilkan di sini.'}
            </p>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isFormOpen && (
        <div
          onClick={closeEditModal}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="my-8 w-full max-w-3xl rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {selectedEmployee ? "Edit Produk Stok" : "Tambah Produk Stok"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedEmployee
                    ? "Perbarui informasi produk stok."
                    : "Masukkan informasi produk yang akan ditambahkan ke stok."}
                </p>
              </div>

              <button
                type="button"
                aria-label="Tutup form"
                onClick={closeEditModal}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <EventForm
                initialData={selectedEmployee}
                onSuccess={async () => {
                  closeEditModal();
                  await getEvents();
                }}
                onCancel={closeEditModal}
              />
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailOpen && selectedEmployee && (
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

      {/* Delete confirmation modal */}
      {isDeleteOpen && selectedEmployee && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDeleteModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <AlertTriangle size={24} />
              </div>

              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                aria-label="Tutup modal"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <h2
              id="delete-modal-title"
              className="mt-4 text-lg font-bold text-slate-900"
            >
              Hapus produk?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Apakah Anda yakin ingin menghapus produk{" "}
              <span className="font-semibold text-slate-800">
                {selectedEmployee.name}
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 size={16} />
                {isDeleting ? "Menghapus..." : "Ya, hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
