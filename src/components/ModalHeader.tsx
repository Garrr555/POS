import { X } from "lucide-react";

type ModalHeaderProps = {
  title: string;
  subtitle?: string;
  disabled?: boolean;
  onClose: () => void;
};

const ModalHeader = ({
  title,
  subtitle,
  disabled = false,
  onClose,
}: ModalHeaderProps) => (
  <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
    <div>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>

      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
    </div>

    <button
      type="button"
      disabled={disabled}
      onClick={onClose}
      className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
    >
      <X size={20} />
    </button>
  </div>
);

export default ModalHeader;
