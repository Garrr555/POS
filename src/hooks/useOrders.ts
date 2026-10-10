/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import CustomFetch from "../config/db";
import type { OrderType, CreateOrderRequest } from "../types/type";

const useOrders = (id: string | number = "") => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [ordersLength, setOrdersLength] = useState(0);
  const [ordersDetail, setOrdersDetail] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [error, setError] = useState("");

  const getOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await CustomFetch.get("/orders");
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
  }, [id]);

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

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  return {
    orders,
    ordersLength,
    ordersDetail,
    loading,
    loadingCreate,
    error,
    getOrders,
    createOrder,
  };
};

export default useOrders;
