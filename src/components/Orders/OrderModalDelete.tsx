import { Trash2 } from "lucide-react";

import ModalShell from "../ModalShell";
import { ButtonSpinner } from "../Spinner";

import type { OrderType } from "../../types/type";

type DeleteOrderModalProps = {
  order: OrderType;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const DeleteOrderModal = ({
  order,
  loading,
  onCancel,
  onConfirm,
}: DeleteOrderModalProps) => (
  <ModalShell
    zIndexClass="z-[60]"
    variant="compact"
    onBackdropClick={() => !loading && onCancel()}
  >
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
      <Trash2 size={22} />
    </div>

    <h2 className="mt-4 text-lg font-bold text-slate-900">Hapus Order?</h2>

    <p className="mt-2 text-sm leading-6 text-slate-500">
      Order{" "}
      <span className="font-semibold text-slate-700">{order.orderNumber}</span>{" "}
      akan dihapus secara permanen.
    </p>

    <p className="mt-2 text-xs text-slate-400">
      Stok produk pada order completed akan dikembalikan oleh backend.
    </p>

    <div className="mt-6 flex justify-end gap-3">
      <button
        type="button"
        disabled={loading}
        onClick={onCancel}
        className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
      >
        Batal
      </button>

      <button
        type="button"
        disabled={loading}
        onClick={onConfirm}
        className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
      >
        {loading ? (
          <>
            <ButtonSpinner />
            Menghapus...
          </>
        ) : (
          <>
            <Trash2 size={16} />
            Hapus Order
          </>
        )}
      </button>
    </div>
  </ModalShell>
);

export default DeleteOrderModal;
