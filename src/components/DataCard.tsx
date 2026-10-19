import { Pencil, SearchCheck, Trash2, UtensilsCrossed } from "lucide-react";
import type { EventType } from "../types/type";
import { useAuthStore } from "../store/auth.store";
import useFormatRupiah from "../hooks/FormatNumber";

type DataCardProps = {
  employee: EventType | null;
  onEdit: (employee: EventType) => void;
  onDelete: (employee: EventType) => void;
  onDetail: (employee: EventType) => void;
};

const DataCard = ({ employee, onEdit, onDelete, onDetail }: DataCardProps) => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";
  const format = useFormatRupiah(employee?.price || 0);

  if (!employee) return null;

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg">
      {/* Product Image */}
      <button
        type="button"
        onClick={() => onDetail(employee)}
        aria-label={`Lihat detail ${employee.name}`}
        className="relative block h-52 w-full overflow-hidden bg-orange-50 text-left sm:h-56"
      >
        {employee.image ? (
          <img
            src={employee.image}
            alt={employee.name || "Foto menu"}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-orange-300">
            <UtensilsCrossed size={46} strokeWidth={1.4} />
            <span className="text-xs font-medium text-orange-400">
              Foto menu belum tersedia
            </span>
          </div>
        )}

        <span className="absolute left-3 top-3 max-w-[80%] truncate rounded-lg border border-white/70 bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
          {employee.name || "Menu tanpa nama"}
        </span>

        <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-slate-950/70 px-3 py-2 text-xs font-medium text-white sm:opacity-0 sm:transition sm:group-hover:opacity-100">
          <SearchCheck size={14} />
          Lihat detail
        </span>
      </button>

      {/* Product Information */}
      <div className="p-4 flex justify-between items-center">
          <div className="">
            <p className="mt-1 truncate text-lg font-bold text-orange-600">
              {format}
            </p>
          </div>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onEdit(employee)}
              className="flex items-center justify-center gap-2 rounded-full border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
            >
              <Pencil size={15} />
            </button>

            <button
              type="button"
              onClick={() => onDelete(employee)}
              className="flex items-center justify-center gap-2 rounded-full border border-red-100 px-3 py-2.5 text-sm font-semibold text-red-500 transition hover:border-red-200 hover:bg-red-50"
            >
              <Trash2 size={15} />
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default DataCard;
