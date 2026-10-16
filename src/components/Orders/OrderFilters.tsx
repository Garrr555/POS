import { Search } from "lucide-react";

import { MONTH_OPTIONS } from "../../utils/orderHelpers";

const CONTROL_CLASS =
  "h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10";

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

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative w-full sm:w-64">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari transaksi..."
          className={`${CONTROL_CLASS} w-full pl-9 placeholder:text-slate-400`}
        />
      </div>

      {/* Month & Year */}
      <div className="flex items-center gap-2">
        <select
          value={month}
          onChange={(e) => onMonthChange(e.target.value)}
          className={CONTROL_CLASS}
        >
          {MONTH_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
          className={CONTROL_CLASS}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onResetMonth}
          title="Kembali ke bulan ini"
          className="h-10 whitespace-nowrap rounded-lg px-3 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        >
          Bulan ini
        </button>
      </div>
    </div>
  );
};

export default OrderFilters;
