export const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export const formatDate = (value: string) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export const formatPaymentMethod = (method: string) => {
  const methods: Record<string, string> = {
    cash: "Cash / Tunai",
    qris: "QRIS",
    transfer: "Transfer Bank",
    debit: "Kartu Debit",
    credit: "Kartu Kredit",
  };

  return methods[method?.toLowerCase()] || method || "-";
};

export const getStatusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "bg-green-50 text-green-700";

    case "cancelled":
      return "bg-red-50 text-red-700";

    default:
      return "bg-amber-50 text-amber-700";
  }
};

export const formatStatus = (status: string) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "Completed";

    case "cancelled":
      return "Cancelled";

    case "pending":
      return "Pending";

    default:
      return status || "Unknown";
  }
};
