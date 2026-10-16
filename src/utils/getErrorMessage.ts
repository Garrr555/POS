/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Ambil pesan error dari response backend (axios),
 * fallback ke pesan default jika tidak ada.
 */
export const getErrorMessage = (error: any, fallback: string): string =>
  error?.response?.data?.error || error?.response?.data?.message || fallback;
