/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import CustomFetch from "../config/db";
import type {
  OrderType,
  CreateOrderRequest,
  UpdateOrderRequest,
} from "../types/type";

const useOrders = (
  id: string | number = "",
  month: string = "",
  year: string = "",
) => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [ordersLength, setOrdersLength] = useState(0);
  const [ordersDetail, setOrdersDetail] = useState<OrderType | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [error, setError] = useState("");

  const getOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (month) {
        params.append("month", month);
      }

      if (year) {
        params.append("year", year);
      }

      const queryString = params.toString();

      const response = await CustomFetch.get(
        queryString ? `/orders?${queryString}` : "/orders",
      );

      const ordersData: OrderType[] = response.data.orders || [];

      setOrders(ordersData);
      setOrdersLength(ordersData.length);

      if (id !== "") {
        const responseDetail = await CustomFetch.get(`/orders/${id}`);

        setOrdersDetail(responseDetail.data.order || null);
      } else {
        setOrdersDetail(null);
      }
    } catch (error: any) {
      console.error("Failed to load orders:", error);

      setError(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Gagal mengambil data orders",
      );

      setOrdersDetail(null);
    } finally {
      setLoading(false);
    }
  }, [id, month, year]);

  const getOrderById = useCallback(async (orderId: string | number) => {
    try {
      const response = await CustomFetch.get(`/orders/${orderId}`);

      return response.data.order as OrderType;
    } catch (error: any) {
      console.error("Failed to get order:", error);

      throw error;
    }
  }, []);

  const createOrder = useCallback(
    async (orderData: CreateOrderRequest) => {
      try {
        setLoadingCreate(true);
        setError("");

        const response = await CustomFetch.post("/orders", orderData);

        await getOrders();

        return response.data.order as OrderType;
      } catch (error: any) {
        console.error("Failed to create order:", error);

        setError(
          error?.response?.data?.error ||
            error?.response?.data?.message ||
            "Gagal membuat order",
        );

        throw error;
      } finally {
        setLoadingCreate(false);
      }
    },
    [getOrders],
  );

  const updateOrder = useCallback(
    async (orderId: string | number, orderData: UpdateOrderRequest) => {
      try {
        setLoadingUpdate(true);
        setError("");

        const response = await CustomFetch.put(`/orders/${orderId}`, orderData);

        await getOrders();

        return response.data.order as OrderType;
      } catch (error: any) {
        console.error("Failed to update order:", error);

        setError(
          error?.response?.data?.error ||
            error?.response?.data?.message ||
            "Gagal mengupdate order",
        );

        throw error;
      } finally {
        setLoadingUpdate(false);
      }
    },
    [getOrders],
  );

  const deleteOrder = useCallback(
    async (orderId: string | number) => {
      try {
        setLoadingDelete(true);
        setError("");

        const response = await CustomFetch.delete(`/orders/${orderId}`);

        await getOrders();

        return response.data;
      } catch (error: any) {
        console.error("Failed to delete order:", error);

        setError(
          error?.response?.data?.error ||
            error?.response?.data?.message ||
            "Gagal menghapus order",
        );

        throw error;
      } finally {
        setLoadingDelete(false);
      }
    },
    [getOrders],
  );

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  return {
    orders,
    ordersLength,
    ordersDetail,

    loading,
    loadingCreate,
    loadingUpdate,
    loadingDelete,

    error,

    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
  };
};

export default useOrders;
