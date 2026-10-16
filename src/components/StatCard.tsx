import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: ReactNode;
  hint: string;
  icon: ReactNode;
  /** Warna latar + ikon, mis. "bg-orange-50 text-orange-600" */
  iconClassName: string;
  valueClassName?: string;
  className?: string;
};

const StatCard = ({
  label,
  value,
  hint,
  icon,
  iconClassName,
  valueClassName = "text-3xl",
  className = "",
}: StatCardProps) => (
  <div
    className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>

        <h3 className={`mt-3 font-bold text-slate-900 ${valueClassName}`}>
          {value}
        </h3>

        <p className="mt-2 text-xs text-slate-400">{hint}</p>
      </div>

      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconClassName}`}
      >
        {icon}
      </div>
    </div>
  </div>
);

export default StatCard;
