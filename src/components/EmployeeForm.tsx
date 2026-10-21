/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState } from "react";
import CustomFetch from "../config/db";
import type { UserType } from "../types/type";
import { toast } from "react-toastify";
import useDivisi from "../hooks/useDivisi";
import { Loader } from "lucide-react";

interface EmployeeFormProps {
  initialData: UserType | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const EmployeeForm = ({
  initialData,
  onSuccess,
  onCancel,
}: EmployeeFormProps) => {
  const isEditMode = !!initialData;

  const [loading, setLoading] = useState(false);
  const { loading: loadingDivisi } = useDivisi();
  const TypeURI = import.meta.env.VITE_TYPE_URI;

  const [formData, setFormData] = useState({
    name: initialData?.name ?? "",
    lastName: initialData?.lastName ?? "",
    phone: initialData?.phone ?? "",
    email: initialData?.email ?? "",
    password: initialData?.password ?? "",
    department: initialData?.department ?? "",
    role: "member",
    divisi: initialData?.divisi?.divisi ?? "",
    salary: Number(initialData?.salary ?? 0),
    createdAt: initialData?.CreatedAt ?? "",
    divisiId: 7,
    status: initialData?.status ?? "",
    bio: initialData?.bio ?? "",
    platform: TypeURI,
  });

  console.log(formData);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (isEditMode) {
        await CustomFetch.put(`/user/${initialData.ID}`, formData);

        toast.success("Berhasil Mengupdate User");
      } else {
        await CustomFetch.post("/auth/register", formData);

        toast.success("Berhasil Menambahkan User");
      }

      onSuccess();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Gagal Menyimpan User",
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
      {/* Personal Information */}
      <div className="border border-slate-100 rounded-xl p-5 sm:p-6">
        <h3 className="font-medium mb-6 pb-4 border-b border-slate-100">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
          <div>
            <label htmlFor="" className="block mb-2">
              Firts Name
            </label>
            <input
              className="border border-slate-100 bg-slate-50 p-2 rounded-lg w-full"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="" className="block mb-2">
              Last Name
            </label>
            <input
              className="border border-slate-100 bg-slate-50 p-2 rounded-lg w-full"
              type="text"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  lastName: e.target.value,
                })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="" className="block mb-2">
              Phone
            </label>
            <input
              className="border border-slate-100 bg-slate-50 p-2 rounded-lg w-full"
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value,
                })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="" className="block mb-2">
              Bio
            </label>
            <input
              className="border border-slate-100 bg-slate-50 p-2 rounded-lg w-full"
              type="text"
              value={formData.bio}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bio: e.target.value,
                })
              }
              required
            />
          </div>
        </div>
      </div>

      {/* Employment Details */}
      <div className="border border-slate-100 rounded-xl p-5 sm:p-6">
        <h3 className="font-medium mb-6 pb-4 border-b border-slate-100">
          User Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
          <div>
            <label htmlFor="" className="block mb-2">
              Position
            </label>
            <input
              className="border border-slate-100 bg-slate-50 p-2 rounded-lg w-full"
              type="text"
              value={formData.department}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  department: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label htmlFor="salary" className="block mb-2">
              Salary
            </label>

            <input
              id="salary"
              type="text"
              inputMode="numeric"
              placeholder="Masukkan salary"
              className="border border-slate-100 bg-slate-50 p-2 rounded-lg w-full"
              value={
                formData.salary
                  ? `Rp ${Number(formData.salary).toLocaleString("id-ID")}`
                  : ""
              }
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");

                setFormData({
                  ...formData,
                  salary: value === "" ? 0 : Number(value),
                });
              }}
            />
          </div>
          <div>
            <label htmlFor="status" className="block mb-2">
              Status
            </label>

            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value,
                })
              }
              disabled={loadingDivisi}
              required
              className="
      border border-slate-100
      bg-slate-50
      p-2
      rounded-lg
      w-full
      outline-none
      focus:border-orange-500
      focus:ring-2
      focus:ring-orange-500/10
      disabled:opacity-50
    "
            >
              <option value="" disabled>
                {loadingDivisi ? "Loading Divisions..." : "Select Status"}
              </option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Account Setup */}
      <div className="border border-slate-100 rounded-xl p-5 sm:p-6">
        <h3 className="font-medium mb-6 pb-4 border-b border-slate-100">
          Accout Setup
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
          <div>
            <label htmlFor="" className="block mb-2">
              Email
            </label>
            <input
              className="border border-slate-100 bg-slate-50 p-2 rounded-lg w-full"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="" className="block mb-2">
              Password
            </label>
            <input
              className="border border-slate-100 bg-slate-50 p-2 rounded-lg w-full"
              type="text"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
            />
          </div>
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
          disabled={loading || loadingDivisi}
          className="rounded-lg w-1/8 py-3 bg-linear-to-r from-orange-600 to-orange-500 text-white text-sm font-semibold hover:from-orange-700 hover:to-orange-600 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-orange-500/25 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {loading && <Loader className="w-4 h-4 animate-spin" />}

          {loading
            ? "Saving..."
            : isEditMode
              ? "Update Employee"
              : "Create Employee"}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
