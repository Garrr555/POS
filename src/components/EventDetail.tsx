/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EventType } from "../types/type";

interface EventDetailProps {
  initialData: EventType | null;
  onCancel: () => void;
}

const EventDetail = ({ initialData, onCancel }: EventDetailProps) => {
  if (!initialData) {
    return (
      <div className="p-6 text-center text-slate-500">
        Data event tidak ditemukan.
      </div>
    );
  }

  const formatPrice = (price: number | undefined) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price ?? 0);
  };

  const detailItems = [
    {
      label: "Name",
      value: initialData.name || "-",
    },
    {
      label: "Description",
      value: initialData.description || "-",
    },
    {
      label: "Price",
      value: formatPrice(Number(initialData.price)),
    },
    {
      label: "Hpp",
      value: formatPrice(Number(initialData.hpp)),
    },
    {
      label: "Type",
      value: initialData.type || "-",
    },
    {
      label: "Upload",
      value: initialData.user?.name || "-",
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <div className="border border-slate-100 rounded-xl p-5 sm:p-6 space-y-6">
        {/* Event Image */}
        <div>
          <label className="block mb-3 text-slate-500 font-medium text-sm">
            Event Image
          </label>

          {initialData.image ? (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <img
                src={initialData.image}
                alt={initialData.name || "Event Image"}
                className="w-full max-h-[400px] object-cover"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-48 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-400">
              <p className="text-sm">No image available</p>
            </div>
          )}
        </div>

        {/* Event Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
          {detailItems.map((item) => (
            <div key={item.label}>
              <label className="block mb-2 text-slate-500 font-medium">
                {item.label}
              </label>

              <div className="border border-slate-100 bg-slate-50 p-3 rounded-lg min-h-10">
                <p className="text-slate-800 break-words whitespace-pre-wrap">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors text-sm font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default EventDetail;
