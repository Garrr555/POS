import type { ReactNode } from "react";

type ModalShellProps = {
  /** Class z-index lengkap, mis. "z-50" (harus literal agar terbaca Tailwind) */
  zIndexClass: string;
  /** wide: modal form/detail (scrollable) | compact: dialog konfirmasi */
  variant?: "wide" | "compact";
  onBackdropClick: () => void;
  children: ReactNode;
};

const VARIANT_CLASSES = {
  wide: {
    overlay: "items-start overflow-y-auto",
    panel: "my-8 max-w-2xl overflow-hidden",
  },
  compact: {
    overlay: "items-center",
    panel: "max-w-md p-6",
  },
} as const;

const ModalShell = ({
  zIndexClass,
  variant = "wide",
  onBackdropClick,
  children,
}: ModalShellProps) => {
  const classes = VARIANT_CLASSES[variant];

  return (
    <div
      onClick={onBackdropClick}
      className={`fixed inset-0 ${zIndexClass} flex justify-center bg-slate-950/50 p-4 backdrop-blur-sm ${classes.overlay}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full rounded-2xl bg-white shadow-2xl ${classes.panel}`}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalShell;
