import type { ReactNode } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";

import {
  formatPaymentMethod,
  formatRupiah,
} from "../../utils/orderHelpers";

import type { OrderType } from "../../types/type";
import StatusBadge from "../StatusBadge";

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
  { label: "Nomor Order", className: "" },
  { label: "Pelanggan", className: "text-left" },
  { label: "Pembayaran", className: "text-center" },
  { label: "Total", className: "text-center" },
  { label: "Status", className: "text-center" },
  { label: "Aksi", className: "text-center" },
];

type OrderTableProps = {
  orders: OrderType[];
  actionsDisabled: boolean;
  onShowDetail: (order: OrderType) => void;
  onEdit: (order: OrderType) => void;
  onDelete: (order: OrderType) => void;
};

const OrderTable = ({
  orders,
  actionsDisabled,
  onShowDetail,
  onEdit,
  onDelete,
}: OrderTableProps) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[1050px] text-left text-sm">
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
            <td className="whitespace-nowrap px-5 py-3.5 font-medium text-slate-900">
              {order.orderNumber || `Order #${order.ID}`}
            </td>

            <td className="px-5 py-3.5 text-slate-700">{order.name || "-"}</td>

            <td className="whitespace-nowrap px-5 py-3.5 text-slate-500 text-center">
              {formatPaymentMethod(order.paymentMethod)}
            </td>

            <td className="whitespace-nowrap px-5 py-3.5 font-medium text-slate-900 text-center">
              {formatRupiah(Number(order.total))}
            </td>

            <td className="px-5 py-3.5 text-center">
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

                <ActionButton
                  title="Hapus order"
                  hoverClassName="hover:bg-red-50 hover:text-red-600"
                  onClick={() => onDelete(order)}
                >
                  <Trash2 size={16} />
                </ActionButton>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default OrderTable;
