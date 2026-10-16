/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

import {
  Eye,
  Pencil,
  Trash2,
  Package,
  Minus,
  Plus,
  AlertTriangle,
  CircleCheck,
  CircleX,
} from "lucide-react";

import type { EventType } from "../types/type";

type StockCardProps = {
  employee: EventType;
  onEdit: (employee: EventType) => void;
  onDelete: (employee: EventType) => void;
  onDetail: (employee: EventType) => void;
  onStockChange: (employee: EventType, difference: number) => void;
  isUpdating: boolean;
};

export default function StockCard({
  employee,
  onEdit,
  onDelete,
  onDetail,
  onStockChange,
  isUpdating,
}: StockCardProps) {
  const [localStock, setLocalStock] = useState(
    Math.max(0, Number(employee.count) || 0),
  );

  useEffect(() => {
    setLocalStock(Math.max(0, Number(employee.count) || 0));
  }, [employee.count]);

  const stock = localStock;

  const handleStockChange = (difference: number) => {
    const nextStock = Math.max(0, stock + difference);

    if (nextStock === stock) return;

    setLocalStock(nextStock);
    onStockChange(employee, difference);
  };

  const stockStatus =
    stock <= 0
      ? {
          label: "Stok habis",
          className: "border-red-200 bg-red-50 text-red-700",
          barClassName: "bg-red-500",
          Icon: CircleX,
        }
      : stock <= 5
        ? {
            label: "Stok menipis",
            className: "border-amber-200 bg-amber-50 text-amber-700",
            barClassName: "bg-amber-400",
            Icon: AlertTriangle,
          }
        : {
            label: "Stok tersedia",
            className: "border-green-200 bg-green-50 text-green-700",
            barClassName: "bg-green-500",
            Icon: CircleCheck,
          };

  const StatusIcon = stockStatus.Icon;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {/* Image */}
      <div className="relative h-48 bg-slate-100">
        {employee.image ? (
          <img
            src={employee.image}
            alt={employee.name || "Produk stok"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300">
            <Package size={48} strokeWidth={1.5} />
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-lg border border-white/70 bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm">
          {employee.type || "stock"}
        </span>

        <span
          className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold shadow-sm ${stockStatus.className}`}
        >
          <StatusIcon size={13} />
          {stockStatus.label}
        </span>
      </div>

      <div className="p-5">
        {/* Product info */}
        <div className="min-h-16">
          <h3 className="line-clamp-1 text-lg font-bold text-slate-900">
            {employee.name || "Tanpa nama"}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">
            {employee.description || "Tidak ada deskripsi produk."}
          </p>
        </div>

        {/* Price */}
        <div className="mt-4">
          <p className="text-xs font-medium text-slate-400">Harga produk</p>

          <p className="mt-1 text-lg font-bold text-slate-900">
            {Number(employee.price || 0).toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            })}
          </p>
        </div>

        {/* Stock controls */}
        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Package size={17} />
              Jumlah stok
            </div>

            <span className="text-xs text-slate-400">Unit</span>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-3xl font-bold text-slate-900">{stock}</p>

              <span
                className={`mt-2 inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${stockStatus.className}`}
              >
                <StatusIcon size={13} />
                {stockStatus.label}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleStockChange(-1)}
                disabled={isUpdating || stock <= 0}
                aria-label={`Kurangi stok ${employee.name}`}
                title="Kurangi stok"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isUpdating ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-orange-500" />
                ) : (
                  <Minus size={18} />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleStockChange(1)}
                disabled={isUpdating}
                aria-label={`Tambah stok ${employee.name}`}
                title="Tambah stok"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full transition-all ${stockStatus.barClassName}`}
              style={{
                width: `${Math.min((stock / 20) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onDetail(employee)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-2 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <Eye size={16} />
            Detail
          </button>

          <button
            type="button"
            onClick={() => onEdit(employee)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-orange-200 px-2 py-2.5 text-sm font-medium text-orange-700 transition hover:bg-orange-50"
          >
            <Pencil size={16} />
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(employee)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 px-2 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <Trash2 size={16} />
            Hapus
          </button>
        </div>
      </div>
    </article>
  );
}
