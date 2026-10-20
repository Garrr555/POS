/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import CustomFetch from "../config/db";
import type { EventType } from "../types/type";
import { toast } from "react-toastify";
import {
  ImagePlus,
  Loader,
  Lock,
  Unlock,
  Upload,
  X,
} from "lucide-react";

interface EmployeeFormProps {
  initialData: EventType | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const formatDateTimeLocal = (value?: string) => {
  if (!value) return "";

  const date = new Date(value);

  if (isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const EventForm = ({ initialData, onSuccess, onCancel }: EmployeeFormProps) => {
  const isEditMode = !!initialData;

  const [loading, setLoading] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image ?? null,
  );

  const [formData, setFormData] = useState({
    name: initialData?.name ?? "",
    count: initialData?.count ?? "",
    phone: initialData?.phone ?? "",
    description: initialData?.description ?? "",
    location: initialData?.location ?? "",
    price: initialData?.price ?? "",
    hpp: initialData?.hpp ?? "",
    type: initialData?.type ?? "",
    datetime: formatDateTimeLocal(initialData?.datetime),
    tagId: "10",
    private: initialData?.private ?? false,
    link: initialData?.link ?? "",
    liveLink: initialData?.liveLink ?? "",
  });

  // Sinkronisasi data ketika initialData berubah
  useEffect(() => {
    if (!initialData) {
      setFormData({
        name: "",
        count: "",
        phone: "",
        description: "",
        location: "",
        price: "",
        hpp: "",
        type: "",
        datetime: "",
        tagId: "10",
        private: false,
        link: "",
        liveLink: "",
      });

      setImagePreview(null);
      setImageFile(null);
      setAttachmentFile(null);
      return;
    }

    setFormData({
      name: initialData.name ?? "",
      count: initialData.count ?? "",
      phone: initialData.phone ?? "",
      description: initialData.description ?? "",
      location: initialData.location ?? "",
      price: initialData.price ?? "",
      hpp: initialData.hpp ?? "",
      type: initialData.type ?? "",
      datetime: formatDateTimeLocal(initialData.datetime),
      tagId: "10",
      private: initialData.private ?? false,
      link: initialData.link ?? "",
      liveLink: initialData.liveLink ?? "",
    });

    setImagePreview(initialData.image ?? null);
    setImageFile(null);
    setAttachmentFile(null);
  }, [initialData]);

  // Preview image yang baru dipilih
  useEffect(() => {
    if (!imageFile) return;

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [imageFile]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = new FormData();

      // Payload event
      payload.append("name", String(formData.name));
      payload.append("description", String(formData.description));
      payload.append("location", String(formData.location));
      payload.append("datetime", new Date(formData.datetime).toISOString());
      payload.append("type", String(formData.type));
      payload.append("link", String(formData.link));
      payload.append("liveLink", String(formData.liveLink));
      payload.append("price", String(formData.price));
      payload.append("hpp", String(formData.hpp));
      payload.append("count", String(formData.count));
      payload.append("phone", String(formData.phone));
      payload.append("tagId", String(formData.tagId));

      // Kirim tagId sebagai string.

      payload.append("private", formData.private.toString());

      // Append image hanya jika memilih gambar baru
      if (imageFile) {
        payload.append("image", imageFile);
      }

      // Append attachment hanya jika memilih file baru
      if (attachmentFile) {
        payload.append("file", attachmentFile);
      }

      if (isEditMode && initialData) {
        await CustomFetch.put(`/events/${initialData.ID}`, payload);

        toast.success("Berhasil Mengupdate Data");
      } else {
        await CustomFetch.post("/events", payload);

        toast.success("Berhasil Menambahkan Data");
      }

      onSuccess();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Gagal Menyimpan Event",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-3xl animate-fade-in"
    >
      {/* Event Information */}
      <div className="border border-slate-100 rounded-xl p-5 sm:p-6">
        <h3 className="font-medium mb-6 pb-4 border-b border-slate-100">
          Event Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
          <div>
            <label className="block mb-2">Name</label>
            <input
              className="border border-slate-100 bg-slate-50 p-2 rounded-lg w-full"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block mb-2">Description</label>
            <input
              className="border border-slate-100 bg-slate-50 p-2 rounded-lg w-full"
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block mb-2">Price</label>
            <input
              className="border border-slate-100 bg-slate-50 p-2 rounded-lg w-full"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block mb-2">Hpp</label>
            <input
              className="border border-slate-100 bg-slate-50 p-2 rounded-lg w-full"
              type="number"
              value={formData.hpp}
              onChange={(e) =>
                setFormData({ ...formData, hpp: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block mb-2">Type</label>
            <select
              className="border border-slate-100 bg-slate-50 p-2 rounded-lg w-full outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            >
              <option value="" disabled>
                Select Type
              </option>
              <option value="Food">Food</option>
              <option value="Drink">Drink</option>
              <option value="Stock">Stock</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">Location</label>
            <input
              className="border border-slate-100 bg-slate-50 p-2 rounded-lg w-full"
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block mb-2">Time</label>
            <input
              type="datetime-local"
              className="border border-slate-100 bg-slate-50 p-2 rounded-lg w-full outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
              value={formData.datetime}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  datetime: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block mb-2">Stock</label>
            <input
              className="border border-slate-100 bg-slate-50 p-2 rounded-lg w-full"
              type="number"
              value={formData.count}
              onChange={(e) =>
                setFormData({ ...formData, count: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block mb-2">Link</label>
            <input
              className="border border-slate-100 bg-slate-50 p-2 rounded-lg w-full"
              type="text"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block mb-2">Live</label>
            <input
              className="border border-slate-100 bg-slate-50 p-2 rounded-lg w-full"
              type="text"
              value={formData.liveLink}
              onChange={(e) =>
                setFormData({ ...formData, liveLink: e.target.value })
              }
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 sm:col-span-2">
            <div>
              <p className="font-medium text-slate-700">Private Event</p>
              <p className="text-xs text-slate-500">
                {formData.private
                  ? "Event hanya dapat diakses secara private"
                  : "Event dapat dilihat oleh semua orang"}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  private: !formData.private,
                })
              }
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${
                formData.private
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {formData.private ? (
                <>
                  <Lock size={18} />
                  Private
                </>
              ) : (
                <>
                  <Unlock size={18} />
                  Public
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Event Image */}
      <div className="border border-slate-100 rounded-xl p-5 sm:p-6">
        <h3 className="font-medium mb-5 pb-4 border-b border-slate-100">
          Event Image
        </h3>

        <div className="space-y-4">
          {imagePreview ? (
            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <img
                src={imagePreview}
                alt="Event Preview"
                className="w-full max-h-[350px] object-cover"
              />

              {imageFile && (
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(initialData?.image ?? null);
                  }}
                  className="absolute top-3 right-3 flex items-center gap-2 rounded-lg bg-white/90 px-3 py-2 text-sm text-red-600 shadow hover:bg-white"
                >
                  <X size={16} />
                  Remove new image
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-400">
              <ImagePlus size={32} className="mb-2" />
              <p className="text-sm">No image selected</p>
            </div>
          )}

          <label className="flex items-center justify-center gap-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">
            <Upload size={17} />
            {imageFile ? "Change Image" : "Choose Image"}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  setImageFile(file);
                }

                e.target.value = "";
              }}
            />
          </label>

          <p className="text-xs text-slate-400">
            {imageFile
              ? `Selected: ${imageFile.name}`
              : "Choose a new image to replace the current one. Leave empty to keep the existing image."}
          </p>
        </div>
      </div>

      {/* Button */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg w-full sm:w-auto px-6 py-3 bg-linear-to-r from-orange-600 to-orange-500 text-white text-sm font-semibold hover:from-orange-700 hover:to-orange-600 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-orange-500/25 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {loading && <Loader className="w-4 h-4 animate-spin" />}

          {loading ? "Saving..." : isEditMode ? "Update Data" : "Create Data"}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
