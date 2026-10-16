/* =========================================================
   Konstanta
========================================================= */

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: "Cash / Tunai",
  qris: "QRIS",
  transfer: "Transfer Bank",
  debit: "Kartu Debit",
  credit: "Kartu Kredit",
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  completed: "Completed",
  pending: "Pending",
  cancelled: "Cancelled",
};

const ORDER_STATUS_CLASSES: Record<string, string> = {
  completed: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
  pending: "bg-amber-50 text-amber-700",
};

const DEFAULT_STATUS_CLASS = "bg-slate-100 text-slate-600";

export const MONTH_OPTIONS = [
  { value: "1", label: "Januari" },
  { value: "2", label: "Februari" },
  { value: "3", label: "Maret" },
  { value: "4", label: "April" },
  { value: "5", label: "Mei" },
  { value: "6", label: "Juni" },
  { value: "7", label: "Juli" },
  { value: "8", label: "Agustus" },
  { value: "9", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Desember" },
];

/* =========================================================
   Formatter
========================================================= */

export const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);

export const formatDate = (value: string) => {
  if (!value) return "-";

  const date = new Date(value);

  if (isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export const formatPaymentMethod = (method: string) =>
  PAYMENT_METHOD_LABELS[method?.toLowerCase()] || method || "-";

export const formatStatus = (status: string) =>
  ORDER_STATUS_LABELS[status?.toLowerCase()] || status || "Unknown";

export const getStatusClass = (status: string) =>
  ORDER_STATUS_CLASSES[status?.toLowerCase()] || DEFAULT_STATUS_CLASS;

export const isCompleted = (status: string) =>
  status?.toLowerCase() === "completed";
