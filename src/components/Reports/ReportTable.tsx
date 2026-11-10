import { Eye, FileBarChart } from "lucide-react";
import type { DailyReportGroup } from "../../types/report";
import { formatReportDate } from "../../utils/reportHelpers";

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

type ReportTableProps = {
  reports: DailyReportGroup[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  startItem: number;
  endItem: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: number) => void;
  onSelectReport: (report: DailyReportGroup) => void;
};

const ReportTable = ({
  reports,
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  startItem,
  endItem,
  onPageChange,
  onItemsPerPageChange,
  onSelectReport,
}: ReportTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-100 text-xs text-slate-500">
          <tr>
            <th className="px-5 py-3 font-medium">Nama Laporan</th>
            <th className="hidden sm:table-cell px-5 py-3 font-medium">
              Tanggal Laporan
            </th>
            <th className="hidden sm:table-cell px-5 py-3 text-center font-medium">
              Jumlah Menu
            </th>
            <th className="hidden md:table-cell px-5 py-3 text-center font-medium">
              Aksi
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {reports.map((report) => (
            <tr
              key={report.date}
              onClick={() => onSelectReport(report)}
              className="cursor-pointer transition hover:bg-orange-50/50"
            >
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-orange-50 p-2 text-orange-500">
                    <FileBarChart size={18} />
                  </div>

                  <div>
                    <p className="font-medium text-slate-900">{report.name}</p>
                  </div>
                </div>
              </td>

              <td className="hidden sm:table-cell whitespace-nowrap px-5 py-3.5 text-slate-600">
                {formatReportDate(report.date)}
              </td>

              <td className="hidden sm:table-cell px-5 py-3.5 text-center font-medium text-slate-700">
                {report.items.length} Menu
              </td>

              <td className="hidden md:table-cell px-5 py-3.5 text-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectReport(report);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 px-3 py-2 text-xs font-medium text-orange-600 transition hover:bg-orange-50"
                >
                  <Eye size={14} />
                  Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-slate-500">
          Menampilkan {startItem}-{endItem} dari {totalItems} laporan
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-600 outline-none focus:border-orange-400"
          >
            {ITEMS_PER_PAGE_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-lg px-3 py-1.5 text-xs text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="sr-only">Halaman sebelumnya</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <span className="px-2 text-xs font-medium text-slate-600">
              {currentPage} / {Math.max(totalPages, 1)}
            </span>

            <button
              type="button"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="rounded-lg px-3 py-1.5 text-xs text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="sr-only">Halaman berikutnya</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportTable;
