import { useState } from "react";
import { toast } from "react-toastify";

import CustomFetch from "../config/db";


import type { OrderType, UpdateOrderRequest } from "../types/type";
import { getErrorMessage } from "./getErrorMessage";

/**
 * Mengelola aksi detail / edit / hapus order beserta state modal-nya.
 * `refetch` dipanggil setelah update atau delete berhasil.
 */
const useOrderActions = (refetch: () => Promise<unknown> | void) => {
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [editingOrder, setEditingOrder] = useState<OrderType | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<OrderType | null>(null);

  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  /* Ambil detail order dari backend (dipakai untuk detail & edit) */
  const fetchOrderDetail = async (
    order: OrderType,
    errorFallback: string,
  ): Promise<OrderType | null> => {
    setLoadingDetail(true);

    try {
      const response = await CustomFetch.get(`/orders/${order.ID}`);
      const detail: OrderType | null = response.data.order || null;

      if (!detail) toast.error("Detail order tidak ditemukan");

      return detail;
    } catch (error) {
      toast.error(getErrorMessage(error, errorFallback));
      return null;
    } finally {
      setLoadingDetail(false);
    }
  };

  /* Detail */
  const showDetail = async (order: OrderType) => {
    const detail = await fetchOrderDetail(
      order,
      "Gagal mengambil detail order",
    );

    if (detail) setSelectedOrder(detail);
  };

  const closeDetail = () => {
    if (loadingDetail) return;

    setSelectedOrder(null);
  };

  /* Edit */
  const startEdit = async (order: OrderType) => {
    const detail = await fetchOrderDetail(order, "Gagal mengambil data order");

    if (detail) setEditingOrder(detail);
  };

  const closeEdit = () => {
    if (loadingSubmit) return;

    setEditingOrder(null);
  };

  const updateOrder = async (data: UpdateOrderRequest) => {
    if (!editingOrder) return;

    setLoadingSubmit(true);

    try {
      await CustomFetch.put(`/orders/${editingOrder.ID}`, data);

      toast.success("Order berhasil diupdate");
      setEditingOrder(null);

      await refetch();
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal mengupdate order"));
    } finally {
      setLoadingSubmit(false);
    }
  };

  /* Delete */
  const closeDelete = () => {
    if (loadingDelete) return;

    setDeletingOrder(null);
  };

  const deleteOrder = async () => {
    if (!deletingOrder) return;

    setLoadingDelete(true);

    try {
      await CustomFetch.delete(`/orders/${deletingOrder.ID}`);

      toast.success("Order berhasil dihapus");
      setDeletingOrder(null);

      await refetch();
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menghapus order"));
    } finally {
      setLoadingDelete(false);
    }
  };

  return {
    // state
    selectedOrder,
    editingOrder,
    deletingOrder,
    loadingDetail,
    loadingSubmit,
    loadingDelete,

    // actions
    showDetail,
    closeDetail,
    startEdit,
    closeEdit,
    updateOrder,
    requestDelete: setDeletingOrder,
    closeDelete,
    deleteOrder,
  };
};

export default useOrderActions;
