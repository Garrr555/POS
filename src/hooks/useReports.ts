/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import CustomFetch from "../config/db";
import type {
  DailyStockReportType,
  DailyStockReportSummary,
} from "../types/type";

const useReports = (
  date: string = "",
  month: string = "",
  year: string = "",
) => {
  const [reports, setReports] = useState<DailyStockReportType[]>([]);
  const [reportsLength, setReportsLength] = useState(0);

  const [summary, setSummary] = useState<DailyStockReportSummary>({
    totalSold: 0,
    totalRemaining: 0,
    totalHppLost: 0,
  });

  const [loading, setLoading] = useState(true);
  const [loadingClose, setLoadingClose] = useState(false);

  const [error, setError] = useState("");

  // GET Reports
  const getReports = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (date) {
        params.append("date", date);
      } else {
        if (month) {
          params.append("month", month);
        }

        if (year) {
          params.append("year", year);
        }
      }

      const queryString = params.toString();

      const response = await CustomFetch.get(
        queryString ? `/reports?${queryString}` : "/reports",
      );

      const reportsData: DailyStockReportType[] = response.data.reports || [];

      setReports(reportsData);
      setReportsLength(reportsData.length);

      setSummary(
        response.data.summary || {
          totalSold: 0,
          totalRemaining: 0,
          totalHppLost: 0,
        },
      );
    } catch (error: any) {
      console.error("Failed to load daily stock reports:", error);

      setError(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Gagal mengambil data laporan stok",
      );

      setReports([]);
      setReportsLength(0);

      setSummary({
        totalSold: 0,
        totalRemaining: 0,
        totalHppLost: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [date, month, year]);

  // POST Close Daily Report
  const closeDailyReport = useCallback(
    async (reportDate: string) => {
      try {
        setLoadingClose(true);
        setError("");

        const response = await CustomFetch.post(
          `/reports/close?date=${reportDate}`,
        );

        // Refresh laporan sesuai filter yang sedang aktif.
        await getReports();

        return response.data as {
          message: string;
          summary: DailyStockReportSummary;
          reports: DailyStockReportType[];
        };
      } catch (error: any) {
        console.error("Failed to close daily stock report:", error);

        setError(
          error?.response?.data?.error ||
            error?.response?.data?.message ||
            "Gagal membuat laporan stok harian",
        );

        throw error;
      } finally {
        setLoadingClose(false);
      }
    },
    [getReports],
  );

  // PUT Edit Daily Report
  const editReport = useCallback(
    async (id: number, data: Partial<DailyStockReportType>) => {
      try {
        setError("");

        const response = await CustomFetch.put(`/reports/${id}`, data);

        await getReports();

        return response.data;
      } catch (error: any) {
        console.error("Failed to edit daily stock report:", error);

        setError(
          error?.response?.data?.error ||
            error?.response?.data?.message ||
            "Gagal mengubah laporan stok",
        );

        throw error;
      }
    },
    [getReports],
  );

  // DELETE Daily Report
  const deleteReport = useCallback(
    async (id: number) => {
      try {
        setError("");

        const response = await CustomFetch.delete(`/reports/${id}`);

        await getReports();

        return response.data;
      } catch (error: any) {
        console.error("Failed to delete daily stock report:", error);

        setError(
          error?.response?.data?.error ||
            error?.response?.data?.message ||
            "Gagal menghapus laporan stok",
        );

        throw error;
      }
    },
    [getReports],
  );

  useEffect(() => {
    getReports();
  }, [getReports]);

  return {
    reports,
    reportsLength,
    summary,

    loading,
    loadingClose,

    error,

    getReports,
    closeDailyReport,
    editReport,
    deleteReport,
  };
};

export default useReports;
