import { useMemo } from "react";
import useEvents from "./useEvents";

export default function useStockStats() {
  const { tagEvent } = useEvents("1000", "1", "", "10");

  const stats = useMemo(() => {
    const employees = (tagEvent ?? []).filter(
      (item) => item.type?.trim().toLowerCase() === "stock",
    );

    const totalUnits = employees.reduce(
      (total, item) => total + Math.max(0, Number(item.count) || 0),
      0,
    );

    const lowStock = employees.filter((item) => {
      const count = Number(item.count) || 0;
      return count > 0 && count <= 5;
    }).length;

    const outOfStock = employees.filter(
      (item) => (Number(item.count) || 0) <= 0,
    ).length;

    return {
      totalProducts: employees.length,
      totalUnits,
      lowStock,
      outOfStock,
    };
  }, [tagEvent]);

  return stats;
}
