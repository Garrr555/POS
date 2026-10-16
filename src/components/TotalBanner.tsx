import { formatRupiah } from "../utils/orderHelpers";

const TotalBanner = ({ total }: { total: number }) => (
  <div className="rounded-xl bg-orange-50 p-4">
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-medium text-slate-600">
        Total Pembayaran
      </span>

      <span className="text-xl font-bold text-orange-600">
        {formatRupiah(total)}
      </span>
    </div>
  </div>
);

export default TotalBanner;
