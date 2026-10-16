import { formatRupiah } from "../utils/orderHelpers";

const TotalRow = ({ total }: { total: number }) => (
  <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
    <span className="text-sm text-slate-500">Total Pembayaran</span>

    <span className="text-lg font-semibold text-slate-900">
      {formatRupiah(total)}
    </span>
  </div>
);

export default TotalRow;
