import { formatStatus, getStatusClass } from "../utils/orderHelpers";

const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
      status,
    )}`}
  >
    {formatStatus(status)}
  </span>
);

export default StatusBadge;
