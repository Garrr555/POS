import type { ReactNode } from "react";

import ModalShell from "../ModalShell";
import ModalHeader from "../ModalHeader";
import StatusBadge from "../StatusBadge";
import {
  formatDate,
  formatPaymentMethod,
  formatRupiah,
} from "../../utils/orderHelpers";

import type { OrderType } from "../../types/type";
import TotalRow from "../TotalRow";

const InfoRow = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="flex items-center justify-between gap-4 py-2.5">
    <dt className="text-slate-500">{label}</dt>

    <dd className="text-right font-medium text-slate-800">{children}</dd>
  </div>
);

type OrderDetailModalProps = {
  order: OrderType;
  onClose: () => void;
};

const OrderDetailModal = ({ order, onClose }: OrderDetailModalProps) => (
  <ModalShell zIndexClass="z-50" onBackdropClick={onClose}>
    <ModalHeader
      title="Detail Order"
      subtitle={order.orderNumber || `Order #${order.ID}`}
      onClose={onClose}
    />

    <div className="space-y-5 p-5 sm:p-6">
      {/* Information */}
      <dl className="divide-y divide-slate-100 text-sm">
        <InfoRow label="Tanggal Transaksi">
          {formatDate(order.CreatedAt)}
        </InfoRow>

        <InfoRow label="Metode Pembayaran">
          {formatPaymentMethod(order.paymentMethod)}
        </InfoRow>

        <InfoRow label="Pelanggan">{order.name || "-"}</InfoRow>

        <InfoRow label="Kasir">
          {order.user?.name || `User #${order.userId}`}
        </InfoRow>

        <InfoRow label="Status Order">
          <StatusBadge status={order.status} />
        </InfoRow>
      </dl>

      {/* Items */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-800">
          Item Pesanan
        </h3>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[460px] text-left text-sm">
            <thead className="border-b border-slate-100 text-xs text-slate-500">
              <tr>
                <th className="px-4 py-2.5 font-medium">Produk</th>
                <th className="px-4 py-2.5 text-center font-medium">Qty</th>
                <th className="px-4 py-2.5 text-right font-medium">Harga</th>
                <th className="px-4 py-2.5 text-right font-medium">Subtotal</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {(order.items || []).map((item) => (
                <tr key={item.ID}>
                  <td className="px-4 py-2.5 text-slate-800">
                    {item.event?.name || `Produk #${item.eventId}`}
                  </td>

                  <td className="px-4 py-2.5 text-center text-slate-600">
                    {item.quantity}
                  </td>

                  <td className="whitespace-nowrap px-4 py-2.5 text-right text-slate-600">
                    {formatRupiah(Number(item.price))}
                  </td>

                  <td className="whitespace-nowrap px-4 py-2.5 text-right font-medium text-slate-800">
                    {formatRupiah(Number(item.subtotal))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TotalRow total={Number(order.total)} />
    </div>
  </ModalShell>
);

export default OrderDetailModal;
