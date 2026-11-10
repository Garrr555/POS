export const formatReportDate = (date: string) => {
  if (!date) return "-";

  return new Date(`${date.slice(0, 10)}T00:00:00`).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};
