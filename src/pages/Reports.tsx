/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { FileBarChart, RefreshCw, X } from "lucide-react";

import {
  formatRupiah,
  getTotalOrders,
  getTotalOrdersCompleted,
  getTotalRevenue,
  getTotalHpp,
  totalRevenueHarga,
  totalRevenueHpp,
} from "../utils/orderHelpers";

import { PageSpinner } from "../components/Spinner";
import StatsBar from "../components/StatBar";

import type { DailyStockReportType } from "../types/type";
import type { DailyReportGroup } from "../types/report";

import useReports from "../hooks/useReports";
import useOrders from "../hooks/useOrders";

import ReportTable from "../components/Reports/ReportTable";
import ReportFilters from "../components/Reports/ReportFilters";
import ReportDetailModal from "../components/Reports/ModalDetail";
import OrderChart from "../components/Orders/OrderChart";

// Helper ------------------------------------------------------------------------------------------------------------------------------------

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Main ------------------------------------------------------------------------------------------------------------------------------------

const Reports = () => {
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const [selectedReport, setSelectedReport] = useState<DailyReportGroup | null>(
    null,
  );

  const {
    reports,
    loading,
    loadingClose,
    error,
    getReports,
    closeDailyReport,
    editReport,
    deleteReport,
  } = useReports("", selectedMonth, selectedYear);

  // Orders untuk statistik dan chart
  const { orders } = useOrders("", selectedMonth, selectedYear);
  const { orders: allOrders } = useOrders("", "", "");

  // Statistik Reports berdasarkan data yang sudah difilter
  const reportSummary = useMemo(() => {
    const currentYear = String(new Date().getFullYear());

    const targetYear = selectedYear || (selectedMonth ? currentYear : "");

    const filtered = reports.filter((report) => {
      const [year, month] = report.date.slice(0, 10).split("-");

      const matchesMonth = !selectedMonth || month === selectedMonth;
      const matchesYear = !targetYear || year === targetYear;

      return matchesMonth && matchesYear;
    });

    return filtered.reduce(
      (acc, report) => ({
        totalSold: acc.totalSold + (Number(report.soldCount) || 0),
        totalRemaining:
          acc.totalRemaining + (Number(report.remainingCount) || 0),
        totalHppLost: acc.totalHppLost + (Number(report.hppLost) || 0),
      }),
      {
        totalSold: 0,
        totalRemaining: 0,
        totalHppLost: 0,
      },
    );
  }, [reports, selectedMonth, selectedYear]);

  // Statistik Orders
  const revenue = useMemo(() => totalRevenueHarga(orders), [orders]);
  const hpp = useMemo(() => totalRevenueHpp(orders), [orders]);

  const totalOrdersCompleted = useMemo(
    () => getTotalOrdersCompleted(orders),
    [orders],
  );

  const totalAllOrders = useMemo(() => getTotalOrders(allOrders), [allOrders]);

  const totalAllRevenue = useMemo(() => getTotalRevenue(orders), [orders]);

  const totalAllHpp = useMemo(() => getTotalHpp(orders), [orders]);

  const totalNetRevenue = useMemo(() => {
    const gross = selectedMonth || selectedYear ? revenue : totalAllRevenue;
    const soldHpp = selectedMonth || selectedYear ? hpp : totalAllHpp;

    return gross - soldHpp - reportSummary.totalHppLost;
  }, [
    selectedMonth,
    selectedYear,
    revenue,
    totalAllRevenue,
    hpp,
    totalAllHpp,
    reportSummary.totalHppLost,
  ]);

  // Group laporan berdasarkan tanggal
  const groupedReports = useMemo<DailyReportGroup[]>(() => {
    const groups = new Map<string, DailyStockReportType[]>();

    reports.forEach((report) => {
      const date = report.date.slice(0, 10);

      if (!groups.has(date)) {
        groups.set(date, []);
      }

      groups.get(date)!.push(report);
    });

    return Array.from(groups.entries())
      .map(([date, items]) => ({
        date,
        name: `${new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}`,
        items,
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [reports]);

  // Filter laporan berdasarkan pencarian
  const filteredReports = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return groupedReports;

    return groupedReports.filter(
      (report) =>
        report.name.toLowerCase().includes(keyword) ||
        report.items.some(
          (item) =>
            (item.eventName || "").toLowerCase().includes(keyword) ||
            String(item.eventId).includes(keyword),
        ),
    );
  }, [groupedReports, search]);

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return filteredReports.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredReports, currentPage, itemsPerPage]);

  const startItem =
    filteredReports.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  const endItem = Math.min(currentPage * itemsPerPage, filteredReports.length);

  // Reset filter bulan dan tahun
  const resetMonth = () => {
    setSelectedMonth("");
    setSelectedYear("");
  };

  // Tutup laporan hari ini
  const handleCloseReport = async () => {
    const today = getTodayDate();

    try {
      await closeDailyReport(today);

      setShowCloseConfirm(false);
      window.alert("Laporan stok harian berhasil disimpan.");
    } catch (error) {
      console.error("Failed to close report:", error);
      window.alert("Gagal menyimpan laporan stok harian.");
    }
  };

  // Edit Report
  const handleEditReport = async (
    id: number,
    data: Partial<DailyStockReportType>,
  ) => {
    try {
      await editReport(id, data);
      setSelectedReport(null);
      window.alert("Laporan berhasil diperbarui.");
    } catch (error) {
      console.error("Failed to edit report:", error);
      window.alert("Gagal memperbarui laporan.");
    }
  };

  // Delete Report
  const handleDeleteReport = async (id: number) => {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus laporan menu ini? Data yang dihapus tidak dapat dikembalikan.",
    );

    if (!confirmed) return;

    try {
      await deleteReport(id);
      setSelectedReport(null);
      window.alert("Laporan berhasil dihapus.");
    } catch (error) {
      console.error("Failed to delete report:", error);
      window.alert("Gagal menghapus laporan.");
    }
  };

  // Reset halaman ketika filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedMonth, selectedYear]);

  // Render laporan
  const renderReportList = () => {
    if (loading) return <PageSpinner />;

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 px-4 py-14 text-center">
          <div className="rounded-full bg-red-50 p-3 text-red-500">
            <X size={22} />
          </div>

          <div>
            <p className="font-medium text-slate-800">Gagal memuat laporan</p>

            <p className="mt-1 text-sm text-slate-500">{error}</p>
          </div>

          <button
            type="button"
            onClick={getReports}
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
          >
            <RefreshCw size={15} />
            Coba Lagi
          </button>
        </div>
      );
    }

    if (filteredReports.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
          <div className="mb-3 rounded-full bg-orange-50 p-4 text-orange-500">
            <FileBarChart size={28} />
          </div>

          <h3 className="font-semibold text-slate-800">
            {search ? "Laporan tidak ditemukan" : "Belum ada laporan"}
          </h3>

          <p className="mt-1 max-w-sm text-sm text-slate-500">
            {search
              ? "Tidak ada laporan yang sesuai dengan pencarian."
              : "Laporan stok harian akan muncul setelah laporan ditutup."}
          </p>

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-4 text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              Reset pencarian
            </button>
          )}
        </div>
      );
    }

    return (
      <ReportTable
        reports={paginatedReports}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={filteredReports.length}
        startItem={startItem}
        endItem={endItem}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value);
          setCurrentPage(1);
        }}
        onSelectReport={setSelectedReport}
      />
    );
  };

  return (
    <div className="h-screen animate-fade-in space-y-6 pb-8">
      {/* Statistics */}
      <StatsBar
        stats={[
          {
            label:
              selectedMonth || selectedYear
                ? "Total Order Bulan ini"
                : "Total Order",
            value:
              selectedMonth || selectedYear
                ? totalOrdersCompleted
                : totalAllOrders,
          },
          {
            label: "Total Item Terjual",
            value: reportSummary.totalSold,
          },
          {
            label: "Total Stok Tersisa",
            value: reportSummary.totalRemaining,
          },
          {
            label:
              selectedMonth || selectedYear
                ? "Pendapatan Kotor Bulan ini"
                : "Pendapatan Kotor",
            value:
              selectedMonth || selectedYear
                ? formatRupiah(revenue)
                : formatRupiah(totalAllRevenue),
          },
          {
            label:
              selectedMonth || selectedYear
                ? "Total HPP Terjual Bulan ini"
                : "Total HPP Terjual",
            value:
              selectedMonth || selectedYear
                ? formatRupiah(hpp)
                : formatRupiah(totalAllHpp),
          },
          {
            label: "Total HPP Tidak Terjual",
            value: formatRupiah(reportSummary.totalHppLost),
          },
          {
            label:
              selectedMonth || selectedYear
                ? "Pendapatan Bersih Bulan ini"
                : "Pendapatan Bersih",
            value: formatRupiah(totalNetRevenue),
            auth: true,
          },
        ]}
      />

      {/* Order Charts */}
      <div className="hidden lg:block">
        <OrderChart
          orders={orders}
          reports={reports}
          month={selectedMonth}
          year={selectedYear}
        />
      </div>

      {/* Report List */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white lg:mt-5">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-5">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-800">
                Laporan Stok Harian
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Rekap stok terjual dan HPP menu yang tersisa.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowCloseConfirm(true)}
              disabled={loadingClose}
              className="flex h-10 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-orange-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingClose ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <FileBarChart size={16} />
              )}

              {loadingClose ? "Menyimpan..." : "Tutup Laporan Hari Ini"}
            </button>
          </div>

          {/* Filters */}
          <ReportFilters
            search={search}
            month={selectedMonth}
            year={selectedYear}
            onSearchChange={setSearch}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
            onResetMonth={resetMonth}
          />
        </div>

        {renderReportList()}
      </section>

      {/* Close Report Confirmation Modal */}
      {showCloseConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md animate-fade-in rounded-2xl bg-white p-6 shadow-xl">
            {/* Icon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <FileBarChart size={28} />
            </div>

            {/* Content */}
            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold text-slate-800">
                Tutup Laporan Hari Ini?
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Apakah kamu yakin ingin menutup laporan stok hari ini?
              </p>

              <p className="mt-3 rounded-lg bg-orange-50 px-3 py-2 text-sm font-medium text-orange-700">
                <span className="hidden sm:inline">Tanggal laporan: </span>
                {new Date(`${getTodayDate()}T00:00:00`).toLocaleDateString(
                  "id-ID",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  },
                )}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleCloseReport}
                disabled={loadingClose}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingClose ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <FileBarChart size={15} />
                    Ya, Tutup Laporan
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowCloseConfirm(false)}
                disabled={loadingClose}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onEditReport={handleEditReport}
          onDeleteReport={handleDeleteReport}
        />
      )}
    </div>
  );
};

export default Reports;
