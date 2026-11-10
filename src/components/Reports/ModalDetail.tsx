import {
  CalendarDays,
  FileBarChart,
  Pencil,
  Save,
  Trash2,
  X,
} from "lucide-react";
import type { DailyReportGroup } from "../../types/report";
import { formatRupiah } from "../../utils/orderHelpers";
import { formatReportDate } from "../../utils/reportHelpers";
import type { DailyStockReportType } from "../../types/type";
import { useState } from "react";

type ReportDetailModalProps = {
  report: DailyReportGroup;
  onClose: () => void;
  onEditReport: (
    id: number,
    data: Partial<DailyStockReportType>,
  ) => Promise<void>;
  onDeleteReport: (id: number) => Promise<void>;
};

const ReportDetailModal = ({
  report,
  onClose,
  onEditReport,
  onDeleteReport,
}: ReportDetailModalProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const [editForm, setEditForm] = useState<
    Record<
      number,
      {
        initialCount: number;
        soldCount: number;
        remainingCount: number;
        hpp: number;
      }
    >
  >({});

  const startEditing = (item: DailyStockReportType) => {
    setEditingId(item.id);

    setEditForm({
      [item.id]: {
        initialCount: Number(item.initialCount),
        soldCount: Number(item.soldCount),
        remainingCount: Number(item.remainingCount),
        hpp: Number(item.hpp),
      },
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const handleSave = async (id: number) => {
    const form = editForm[id];

    if (!form) return;

    try {
      setSaving(true);

      await onEditReport(id, {
        initialCount: Number(form.initialCount),
        soldCount: Number(form.soldCount),
        remainingCount: Number(form.remainingCount),
        hpp: Number(form.hpp),
        hppLost: Number(form.remainingCount) * Number(form.hpp),
      });

      setEditingId(null);
    } finally {
      setSaving(false);
    }
  };

  const totalInitial = report.items.reduce(
    (total, item) => total + Number(item.initialCount || 0),
    0,
  );

  const totalSold = report.items.reduce(
    (total, item) => total + Number(item.soldCount || 0),
    0,
  );

  const totalRemaining = report.items.reduce(
    (total, item) => total + Number(item.remainingCount || 0),
    0,
  );

  const totalHppLost = report.items.reduce(
    (total, item) => total + Number(item.hppLost || 0),
    0,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-5"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-orange-50 p-2.5 text-orange-500">
              <FileBarChart size={22} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-800">
                Detail Laporan Stok
              </h2>

              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                <CalendarDays size={13} />
                {formatReportDate(report.date)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 sm:p-6">
          {/* Summary */}
          <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Total Stok Awal</p>
              <p className="mt-2 text-xl font-semibold text-slate-800">
                {totalInitial}
              </p>
            </div>

            <div className="rounded-xl border border-green-100 bg-green-50/50 p-4">
              <p className="text-xs text-slate-500">Total Terjual</p>
              <p className="mt-2 text-xl font-semibold text-green-600">
                {totalSold}
              </p>
            </div>

            <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-4">
              <p className="text-xs text-slate-500">Total Sisa Stok</p>
              <p className="mt-2 text-xl font-semibold text-orange-600">
                {totalRemaining}
              </p>
            </div>

            <div className="rounded-xl border border-red-100 bg-red-50/50 p-4">
              <p className="text-xs text-slate-500">Total HPP Tidak Terjual</p>
              <p className="mt-2 text-lg font-semibold text-red-600">
                {formatRupiah(totalHppLost)}
              </p>
            </div>
          </div>

          {/* Detail Table */}
          <div>
            <div className="mb-3">
              <h3 className="font-semibold text-slate-800">Rincian Menu</h3>
              <p className="mt-1 text-xs text-slate-500">
                Detail stok dan HPP setiap menu pada laporan ini.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-slate-100 bg-slate-50 text-xs text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Nama Menu</th>
                    <th className="px-4 py-3 text-center font-medium">
                      Stok Awal
                    </th>
                    <th className="px-4 py-3 text-center font-medium">
                      Terjual
                    </th>
                    <th className="px-4 py-3 text-center font-medium">
                      Sisa Stok
                    </th>
                    <th className="px-4 py-3 text-right font-medium">
                      HPP / Item
                    </th>
                    <th className="px-4 py-3 text-right font-medium">
                      HPP Tidak Terjual
                    </th>
                    {/* <th className="px-4 py-3 text-center font-medium">Aksi</th> */}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {report.items.map((item) => {
                    const isEditing = editingId === item.id;

                    const inputClass =
                      "w-20 rounded-lg border border-orange-200 bg-white px-2 py-1.5 text-center text-sm outline-none focus:border-orange-500";

                    return (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3.5 font-medium text-slate-800">
                          {item.eventName || `Menu #${item.eventId}`}
                        </td>

                        <td className="px-4 py-3.5 text-center text-slate-700">
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              className={inputClass}
                              value={
                                editForm[item.id]?.initialCount ??
                                item.initialCount
                              }
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  [item.id]: {
                                    ...prev[item.id],
                                    initialCount: Number(e.target.value),
                                  },
                                }))
                              }
                            />
                          ) : (
                            item.initialCount
                          )}
                        </td>

                        <td className="px-4 py-3.5 text-center font-medium text-green-600">
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              className={inputClass}
                              value={
                                editForm[item.id]?.soldCount ?? item.soldCount
                              }
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  [item.id]: {
                                    ...prev[item.id],
                                    soldCount: Number(e.target.value),
                                  },
                                }))
                              }
                            />
                          ) : (
                            item.soldCount
                          )}
                        </td>

                        <td className="px-4 py-3.5 text-center font-medium text-orange-600">
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              className={inputClass}
                              value={
                                editForm[item.id]?.remainingCount ??
                                item.remainingCount
                              }
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  [item.id]: {
                                    ...prev[item.id],
                                    remainingCount: Number(e.target.value),
                                  },
                                }))
                              }
                            />
                          ) : (
                            item.remainingCount
                          )}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3.5 text-right text-slate-700">
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              className={`${inputClass} w-28`}
                              value={editForm[item.id]?.hpp ?? item.hpp}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  [item.id]: {
                                    ...prev[item.id],
                                    hpp: Number(e.target.value),
                                  },
                                }))
                              }
                            />
                          ) : (
                            formatRupiah(Number(item.hpp))
                          )}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3.5 text-right font-semibold text-slate-900">
                          {formatRupiah(
                            isEditing
                              ? (editForm[item.id]?.remainingCount ??
                                  item.remainingCount) *
                                  (editForm[item.id]?.hpp ?? item.hpp)
                              : Number(item.hppLost),
                          )}
                        </td>

                        <td className="px-4 py-3.5 hidden">
                          <div className="flex items-center justify-center gap-1.5">
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  disabled={saving}
                                  onClick={() => handleSave(item.id)}
                                  className="rounded-lg bg-green-500 p-2 text-white transition hover:bg-green-600 disabled:opacity-50"
                                  title="Simpan perubahan"
                                >
                                  <Save size={15} />
                                </button>

                                <button
                                  type="button"
                                  disabled={saving}
                                  onClick={cancelEditing}
                                  className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100"
                                  title="Batalkan"
                                >
                                  <X size={15} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => startEditing(item)}
                                  className="rounded-lg border border-orange-200 p-2 text-orange-600 transition hover:bg-orange-50"
                                  title="Edit laporan"
                                >
                                  <Pencil size={15} />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => onDeleteReport(item.id)}
                                  className="rounded-lg border border-red-200 p-2 text-red-500 transition hover:bg-red-50"
                                  title="Hapus laporan"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                <tfoot className="border-t border-slate-200 bg-slate-50">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      Total
                    </td>

                    <td className="px-4 py-3 text-center font-semibold text-slate-800">
                      {totalInitial}
                    </td>

                    <td className="px-4 py-3 text-center font-semibold text-green-600">
                      {totalSold}
                    </td>

                    <td className="px-4 py-3 text-center font-semibold text-orange-600">
                      {totalRemaining}
                    </td>

                    <td className="px-4 py-3" />

                    <td className="whitespace-nowrap px-4 py-3 text-right font-bold text-slate-900">
                      {formatRupiah(totalHppLost)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 active:scale-95"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailModal;
