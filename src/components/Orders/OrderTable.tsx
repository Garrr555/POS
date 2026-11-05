import type { ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import { formatRupiah } from "../../utils/orderHelpers";

import type { OrderType } from "../../types/type";
import StatusBadge from "../StatusBadge";
import { useAuthStore } from "../../store/auth.store";

type ActionButtonProps = {
  title: string;
  hoverClassName?: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
};

/** Tombol ikon polos; warna baru muncul saat hover. */
const ActionButton = ({
  title,
  hoverClassName = "hover:bg-slate-100 hover:text-slate-700",
  disabled,
  onClick,
  children,
}: ActionButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`rounded-lg p-2 text-slate-400 transition disabled:opacity-50 ${hoverClassName}`}
  >
    {children}
  </button>
);

const HEADERS: { label: string; className: string }[] = [
  { label: "Nomor Order", className: "hidden md:table-cell" },
  { label: "Pelanggan", className: "text-left" },
  { label: "Kasir", className: "text-left hidden md:table-cell" },
  { label: "Total", className: "text-center hidden md:table-cell" },
  { label: "Status", className: "text-center hidden sm:table-cell" },
  { label: "Aksi", className: "text-center" },
];

type OrderTableProps = {
  orders: OrderType[];
  actionsDisabled: boolean;
  onShowDetail: (order: OrderType) => void;
  onEdit: (order: OrderType) => void;
  onDelete: (order: OrderType) => void;

  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  startItem: number;
  endItem: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: number) => void;
};

const OrderTable = ({
  orders,
  actionsDisabled,
  onShowDetail,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  startItem,
  endItem,
  onPageChange,
  onItemsPerPageChange,
}: OrderTableProps) => {
  const { user } = useAuthStore();
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-100 text-xs text-slate-500">
          <tr>
            {HEADERS.map(({ label, className }) => (
              <th key={label} className={`px-5 py-3 font-medium ${className}`}>
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {orders.map((order) => (
            <tr key={order.ID} className="transition hover:bg-slate-50">
              <td className="whitespace-nowrap px-5 py-3.5 font-medium text-slate-900 hidden md:table-cell">
                {order.orderNumber || `Order #${order.ID}`}
              </td>

              <td className="px-5 py-3.5 text-slate-700">
                {order.name || "-"}
              </td>

              <td className="px-5 py-3.5 text-slate-700">
                {order.user.name || "-"}
              </td>

              <td className="whitespace-nowrap px-5 py-3.5 font-medium text-slate-900 text-center hidden md:table-cell">
                {formatRupiah(Number(order.total))}
              </td>

              <td className="px-5 py-3.5 text-center hidden sm:table-cell">
                <StatusBadge status={order.status} />
              </td>

              <td className="px-5 py-3.5">
                <div className="flex items-center justify-center">
                  <ActionButton
                    title="Lihat detail"
                    hoverClassName="hover:bg-green-50 hover:text-green-600"
                    disabled={actionsDisabled}
                    onClick={() => onShowDetail(order)}
                  >
                    <Eye size={16} />
                  </ActionButton>

                  <ActionButton
                    title="Edit order"
                    hoverClassName="hover:bg-blue-50 hover:text-blue-600"
                    disabled={actionsDisabled}
                    onClick={() => onEdit(order)}
                  >
                    <Pencil size={16} />
                  </ActionButton>

                  <div className={`${user?.role === "admin" ? "" : "hidden"}`}>
                    <ActionButton
                      title="Hapus order"
                      hoverClassName="hover:bg-red-50 hover:text-red-600"
                      onClick={() => onDelete(order)}
                    >
                      <Trash2 size={16} />
                    </ActionButton>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Informasi jumlah data */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>
            Menampilkan {startItem}-{endItem} dari {totalItems} order
          </span>
        </div>

        {/* Kontrol pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-600 outline-none focus:border-orange-400"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-lg px-3 py-1.5 text-xs text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft />
            </button>

            <span className="px-2 text-xs font-medium text-slate-600">
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-lg px-3 py-1.5 text-xs text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTable;
