/** Spinner kecil untuk tombol (warna putih). */
export const ButtonSpinner = () => (
  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
);

/** Spinner besar untuk area konten. */
export const PageSpinner = () => (
  <div className="flex min-h-64 items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
  </div>
);
