export type Stat = {
  label: string;
  value: string | number;
  hint?: string;
};

/** Ringkasan statistik dalam satu kartu, dipisah garis tipis. */
const StatsBar = ({ stats }: { stats: Stat[] }) => (
  <section className="grid grid-cols-1 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white sm:grid-cols-4 sm:divide-x sm:divide-y-0">
    {stats.map(({ label, value, hint }) => (
      <div key={label} className="p-5">
        <p className="text-sm text-slate-500">{label}</p>

        <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>

        <p className="mt-1 text-xs text-slate-400">{hint}</p>
      </div>
    ))}
  </section>
);

export default StatsBar;
