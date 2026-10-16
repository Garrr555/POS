import { ShoppingBag } from "lucide-react";

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export const OrderErrorState = ({ message, onRetry }: ErrorStateProps) => (
  <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
    <p className="font-semibold text-slate-800">Gagal memuat order</p>

    <p className="mt-2 text-sm text-slate-500">{message}</p>

    <button
      type="button"
      onClick={onRetry}
      className="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
    >
      Coba Lagi
    </button>
  </div>
);

type EmptyStateProps = {
  isSearching: boolean;
  onResetSearch: () => void;
};

export const OrderEmptyState = ({
  isSearching,
  onResetSearch,
}: EmptyStateProps) => (
  <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
    <ShoppingBag size={28} className="mb-3 text-slate-300" />

    <h3 className="font-semibold text-slate-800">
      {isSearching ? "Order tidak ditemukan" : "Belum ada order"}
    </h3>

    <p className="mt-1 max-w-sm text-sm text-slate-500">
      {isSearching
        ? "Coba gunakan kata kunci pencarian yang berbeda."
        : "Order pada periode tersebut belum tersedia."}
    </p>

    {isSearching && (
      <button
        type="button"
        onClick={onResetSearch}
        className="mt-3 text-sm font-semibold text-orange-600 hover:text-orange-700"
      >
        Reset pencarian
      </button>
    )}
  </div>
);
