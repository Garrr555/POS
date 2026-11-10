import type { DailyStockReportType } from "./type";

export type DailyReportGroup = {
  date: string;
  name: string;
  items: DailyStockReportType[];
};
