import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Minus, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import ModalShell from "../ModalShell";
import ModalHeader from "../ModalHeader";
import TotalRow from "../TotalRow";
import { ButtonSpinner } from "../Spinner";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  formatRupiah,
} from "../../utils/orderHelpers";

import type {
  OrderItemType,
  OrderType,
  UpdateOrderRequest,
} from "../../types/type";

const FIELD_CLASS =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10";

const QTY_BUTTON_CLASS =
  "flex h-8 w-8 items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40";

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div>
    <label className="mb-1.5 block text-sm font-medium text-slate-700">
      {label}
    </label>

    {children}
  </div>
);

/* =========================================================
   Satu baris item di form edit
========================================================= */

type EditItemRowProps = {
  item: OrderItemType;
  disabled: boolean;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
};

const EditItemRow = ({
  item,
  disabled,
  onQuantityChange,
  onRemove,
}: EditItemRowProps) => (
  <li className="flex flex-wrap items-center gap-3 p-3">
    <div className="min-w-40 flex-1">
      <p className="text-sm font-medium text-slate-800">
        {item.event?.name || `Produk #${item.eventId}`}
      </p>

      <p className="text-xs text-slate-400">
        {formatRupiah(Number(item.price))} / item
      </p>
    </div>

    <div className="inline-flex items-center overflow-hidden rounded-lg border border-slate-200">
      <button
        type="button"
        disabled={disabled || item.quantity <= 1}
        onClick={() => onQuantityChange(item.quantity - 1)}
        className={QTY_BUTTON_CLASS}
      >
        <Minus size={14} />
      </button>

      <span className="min-w-8 px-1 text-center text-sm font-medium text-slate-800">
        {item.quantity}
      </span>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onQuantityChange(item.quantity + 1)}
        className={QTY_BUTTON_CLASS}
      >
        <Plus size={14} />
      </button>
    </div>

    <p className="w-28 text-right text-sm font-medium text-slate-800">
      {formatRupiah(Number(item.price) * Number(item.quantity))}
    </p>

    <button
      type="button"
      disabled={disabled}
      onClick={onRemove}
      className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
    >
      <Trash2 size={16} />
    </button>
  </li>
);

/* =========================================================
   Modal edit order
========================================================= */

type EditOrderModalProps = {
  order: OrderType;
  loading: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateOrderRequest) => Promise<void>;
};

const EditOrderModal = ({
  order,
  loading,
  onClose,
  onSubmit,
}: EditOrderModalProps) => {
  const [customerName, setCustomerName] = useState(order.name || "");
  const [paymentMethod, setPaymentMethod] = useState(
    order.paymentMethod || "cash",
  );
  const [status, setStatus] = useState(order.status || "completed");
  const [items, setItems] = useState<OrderItemType[]>(
    (order.items || []).map((item) => ({
      ...item,
      quantity: Number(item.quantity),
    })),
  );

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;

    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, quantity } : item,
      ),
    );
  };

  const removeItem = (index: number) => {
    setItems((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + Number(item.price || 0) * Number(item.quantity || 0),
        0,
      ),
    [items],
  );

  const handleSubmit = async () => {
    if (!customerName.trim()) {
      toast.error("Nama pelanggan wajib diisi");
      return;
    }

    if (items.length === 0) {
      toast.error("Order harus memiliki minimal satu item");
      return;
    }

    await onSubmit({
      name: customerName.trim(),
      paymentMethod,
      status,
      items: items.map((item) => ({
        eventId: item.eventId,
        quantity: item.quantity,
      })),
    });
  };

  return (
    <ModalShell
      zIndexClass="z-[55]"
      onBackdropClick={() => !loading && onClose()}
    >
      <ModalHeader
        title="Edit Order"
        subtitle={order.orderNumber}
        disabled={loading}
        onClose={onClose}
      />

      <div className="space-y-5 p-5 sm:p-6">
        <Field label="Nama Pelanggan">
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Masukkan nama pelanggan"
            className={FIELD_CLASS}
          />
        </Field>

        {/* Payment + Status */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Metode Pembayaran">
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className={FIELD_CLASS}
            >
              {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Status">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={FIELD_CLASS}
            >
              {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {/* Items */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">
              Item Pesanan
            </h3>

            <span className="text-xs text-slate-400">
              {items.length} produk
            </span>
          </div>

          <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
            {items.map((item, index) => (
              <EditItemRow
                key={`${item.eventId}-${index}`}
                item={item}
                disabled={loading}
                onQuantityChange={(quantity) => updateQuantity(index, quantity)}
                onRemove={() => removeItem(index)}
              />
            ))}

            {items.length === 0 && (
              <li className="p-6 text-center text-sm text-slate-500">
                Tidak ada item dalam order.
              </li>
            )}
          </ul>
        </div>

        <TotalRow total={total} />

        {/* Footer */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Batal
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? (
              <>
                <ButtonSpinner />
                Menyimpan...
              </>
            ) : (
              <>
                <Pencil size={16} />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </div>
    </ModalShell>
  );
};

export default EditOrderModal;
