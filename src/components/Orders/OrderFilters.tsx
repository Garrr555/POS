import { RotateCcw, Search } from "lucide-react";

import { MONTH_OPTIONS } from "../../utils/orderHelpers";

const CONTROL_CLASS =
  "h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-8 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10";

const YEAR_RANGE = 7;

type OrderFiltersProps = {
  search: string;
  month: string;
  year: string;
  onSearchChange: (value: string) => void;
  onMonthChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onResetMonth: () => void;
};

const OrderFilters = ({
  search,
  month,
  year,
  onSearchChange,
  onMonthChange,
  onYearChange,
  onResetMonth,
}: OrderFiltersProps) => {
  const currentYear = new Date().getFullYear();

  const years = Array.from(
    { length: YEAR_RANGE },
    (_, index) => currentYear - index,
  );

  const hasDateFilter = Boolean(month || year);

  return (
    <div className="flex justify-between items-center w-full flex-col gap-3 lg:w-auto sm:flex-row lg:items-center rounded-xl">
      {/* Search */}
      <div className="group relative w-full sm:w-1/2">
        <Search
          size={18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-orange-500"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nomor, pelanggan, kasir..."
          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10"
        />
      </div>

      {/* Date Filters */}
      <div className="flex items-center justify-end gap-2 w-full sm:w-1/2">
        {/* Month */}
        <div className="relative min-w-0 flex-1 sm:w-32 sm:flex-none">
          <select
            value={month}
            onChange={(e) => onMonthChange(e.target.value)}
            aria-label="Filter bulan"
            className={CONTROL_CLASS}
          >
            <option value="">Bulan</option>

            {MONTH_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <span className="pointer-events-none absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-slate-300" />
          {month && (
            <span className="pointer-events-none absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-orange-500" />
          )}
        </div>

        {/* Year */}
        <div className="relative min-w-0 flex-1 sm:w-28 sm:flex-none">
          <select
            value={year}
            onChange={(e) => onYearChange(e.target.value)}
            aria-label="Filter tahun"
            className={CONTROL_CLASS}
          >
            <option value="">Tahun</option>

            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <span
            className={`pointer-events-none absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ${
              year ? "bg-orange-500" : "bg-slate-300"
            }`}
          />
        </div>

        {/* Reset */}
        <button
          type="button"
          onClick={onResetMonth}
          disabled={!hasDateFilter}
          title="Reset filter tanggal"
          aria-label="Reset filter tanggal"
          className={`flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg px-2.5 text-sm font-medium transition sm:px-3 ${
            hasDateFilter
              ? "bg-orange-500 text-white shadow-sm hover:bg-orange-600 active:scale-95"
              : "cursor-not-allowed text-slate-400"
          }`}
        >
          <RotateCcw size={14} />
          <span className="hidden lg:inline">Reset</span>
        </button>
      </div>
    </div>
  );
};

export default OrderFilters;
