import { formatRupiah } from "../utils/orderHelpers";

const TotalHppRow = ({ total, hpp }: { total: number; hpp: number }) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2">
      <span className="text-sm text-slate-500">Total Keuntungan</span>

      <span className="text-md font-semibold text-slate-400">
        {formatRupiah(total - hpp)}
      </span>
    </div>
    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2">
      <span className="text-sm text-slate-500">Total HPP</span>

      <span className="text-xl font-semibold text-slate-600">
        {formatRupiah(hpp)}
      </span>
    </div>
    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
      <span className="text-sm text-slate-500">Total Pembayaran</span>

      <span className="text-2xl font-semibold text-orange-600">
        {formatRupiah(total)}
      </span>
    </div>
  </div>
);

export default TotalHppRow;
