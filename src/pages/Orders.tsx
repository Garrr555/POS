/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import {
  Search,
  X,
  Eye,
  ShoppingBag,
  ReceiptText,
  CalendarDays,
  CreditCard,
} from "lucide-react";
import { toast } from "react-toastify";
import useOrders from "../hooks/useOrders";
import CustomFetch from "../config/db";
import type { OrderType } from "../types/type";

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDate = (value: string) => {
  if (!value) return "-";

  const date = new Date(value);

  if (isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const formatPaymentMethod = (method: string) => {
  const methods: Record<string, string> = {
    cash: "Cash / Tunai",
    qris: "QRIS",
    transfer: "Transfer Bank",
    debit: "Kartu Debit",
    credit: "Kartu Kredit",
  };

  return methods[method?.toLowerCase()] || method || "-";
};

const Orders = () => {
  const {
    orders,
    ordersLength,
    loading,
    error,
  } = useOrders();

  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return orders;

    return orders.filter((order) => {
      const orderNumber = order.orderNumber?.toLowerCase() || "";
      const customerName = order.user?.name?.toLowerCase() || "";
      const paymentMethod = order.paymentMethod?.toLowerCase() || "";

      return (
        orderNumber.includes(keyword) ||
        customerName.includes(keyword) ||
        paymentMethod.includes(keyword)
      );
    });
  }, [orders, search]);

  const totalRevenue = useMemo(
    () =>
      orders.reduce((total, order) => {
        if (order.status?.toLowerCase() !== "completed") return total;
        return total + Number(order.total || 0);
      }, 0),
    [orders],
  );

  const totalItems = useMemo(
    () =>
      orders.reduce(
        (total, order) =>
          total +
          (order.items || []).reduce(
            (itemTotal, item) => itemTotal + Number(item.quantity || 0),
            0,
          ),
        0,
      ),
    [orders],
  );

  const handleShowDetail = async (order: OrderType) => {
    setLoadingDetail(true);

    try {
      const response = await CustomFetch.get(`/orders/${order.ID}`);
      setSelectedOrder(response.data.order || null);

      if (!response.data.order) {
        toast.error("Detail order tidak ditemukan");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Gagal mengambil detail order",
      );
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeDetail = () => {
    if (loadingDetail) return;
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen animate-fade-in space-y-6 pb-8">

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Order
              </p>
              <h3 className="mt-3 text-3xl font-bold text-slate-900">
                {ordersLength}
              </h3>
              <p className="mt-2 text-xs text-slate-400">
                Semua transaksi yang dapat diakses
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <ShoppingBag size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Item Terjual
              </p>
              <h3 className="mt-3 text-3xl font-bold text-slate-900">
                {totalItems}
              </h3>
              <p className="mt-2 text-xs text-slate-400">
                Akumulasi kuantitas item dalam order
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ReceiptText size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Pendapatan
              </p>
              <h3 className="mt-3 text-2xl font-bold text-slate-900">
                {formatRupiah(totalRevenue)}
              </h3>
              <p className="mt-2 text-xs text-slate-400">
                Dari order berstatus completed
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <CreditCard size={23} />
            </div>
          </div>
        </div>
      </section>

      {/* Order Table */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h2 className="font-bold text-slate-900">
              Riwayat Transaksi
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {filteredOrders.length} order ditampilkan
            </p>
          </div>

          <div className="relative w-full sm:max-w-sm">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nomor order atau pelanggan..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
          </div>
        ) : error ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
            <p className="font-semibold text-slate-800">
              Gagal memuat order
            </p>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">
                    Nomor Order
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Pelanggan
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Tanggal
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Pembayaran
                  </th>
                  <th className="px-5 py-4 text-right font-semibold">
                    Total
                  </th>
                  <th className="px-5 py-4 text-center font-semibold">
                    Status
                  </th>
                  <th className="px-5 py-4 text-center font-semibold">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.ID}
                    className="transition hover:bg-slate-50/80"
                  >
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="font-semibold text-slate-800">
                        {order.orderNumber || `Order #${order.ID}`}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800">
                        {order.user?.name || `User #${order.userId}`}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        ID: {order.userId}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                      {formatDate(order.CreatedAt)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {formatPaymentMethod(order.paymentMethod)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-slate-800">
                      {formatRupiah(Number(order.total))}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          order.status?.toLowerCase() === "completed"
                            ? "bg-green-50 text-green-700"
                            : order.status?.toLowerCase() === "cancelled"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {order.status || "Unknown"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleShowDetail(order)}
                        disabled={loadingDetail}
                        title="Lihat detail order"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-600 transition hover:bg-orange-100 disabled:opacity-50"
                      >
                        <Eye size={15} />
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <ShoppingBag size={26} />
            </div>

            <h3 className="font-semibold text-slate-800">
              {search ? "Order tidak ditemukan" : "Belum ada order"}
            </h3>

            <p className="mt-1 max-w-sm text-sm text-slate-500">
              {search
                ? "Coba gunakan kata kunci pencarian yang berbeda."
                : "Order yang berhasil dibuat akan muncul di halaman ini."}
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-3 text-sm font-semibold text-orange-600 hover:text-orange-700"
              >
                Reset pencarian
              </button>
            )}
          </div>
        )}
      </section>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          onClick={closeDetail}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="my-8 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Detail Order
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedOrder.orderNumber || `Order #${selectedOrder.ID}`}
                </p>
              </div>

              <button
                type="button"
                onClick={closeDetail}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Tutup detail order"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              {/* Order Information */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-400">
                    <CalendarDays size={16} />
                    <span className="text-xs font-medium">
                      Tanggal Transaksi
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    {formatDate(selectedOrder.CreatedAt)}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-400">
                    <CreditCard size={16} />
                    <span className="text-xs font-medium">
                      Metode Pembayaran
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    {formatPaymentMethod(selectedOrder.paymentMethod)}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="mb-2 text-xs font-medium text-slate-400">
                    Pelanggan
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    {selectedOrder.user?.name ||
                      `User #${selectedOrder.userId}`}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    ID: {selectedOrder.userId}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="mb-2 text-xs font-medium text-slate-400">
                    Status Order
                  </p>
                  <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    {selectedOrder.status || "Unknown"}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="mb-3 font-semibold text-slate-800">
                  Item Pesanan
                </h3>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full min-w-[460px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs text-slate-500">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Produk</th>
                        <th className="px-4 py-3 text-center font-semibold">
                          Qty
                        </th>
                        <th className="px-4 py-3 text-right font-semibold">
                          Harga
                        </th>
                        <th className="px-4 py-3 text-right font-semibold">
                          Subtotal
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {(selectedOrder.items || []).map((item) => (
                        <tr key={item.ID}>
                          <td className="px-4 py-3 font-medium text-slate-800">
                            {item.event?.name || `Produk #${item.eventId}`}
                          </td>
                          <td className="px-4 py-3 text-center text-slate-600">
                            {item.quantity}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-right text-slate-600">
                            {formatRupiah(Number(item.price))}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-slate-800">
                            {formatRupiah(Number(item.subtotal))}
                          </td>
                        </tr>
                      ))}

                      {(!selectedOrder.items ||
                        selectedOrder.items.length === 0) && (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-4 py-8 text-center text-slate-500"
                          >
                            Tidak ada detail item.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total */}
              <div className="rounded-xl bg-orange-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-600">
                    Total Pembayaran
                  </span>
                  <span className="text-xl font-bold text-orange-600">
                    {formatRupiah(Number(selectedOrder.total))}
                  </span>
                </div>
              </div>

              <div className="flex justify-end border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={closeDetail}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;