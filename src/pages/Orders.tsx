import { useMemo, useState } from "react";

import useOrders from "../hooks/useOrders";

import {
  formatRupiah,
  getTotalItems,
  getTotalItemsCompleted,
  getTotalOrders,
  getTotalOrdersCompleted,
  getTotalRevenue,
  totalRevenueHarga,
} from "../utils/orderHelpers";

import type { OrderType } from "../types/type";
import useOrderActions from "../utils/useDecoration";
import { PageSpinner } from "../components/Spinner";
import {
  OrderEmptyState,
  OrderErrorState,
} from "../components/Orders/OrderListStates";
import OrderTable from "../components/Orders/OrderTable";
import OrderFilters from "../components/Orders/OrderFilters";
import OrderDetailModal from "../components/Orders/OrderModalDetail";
import EditOrderModal from "../components/Orders/OrderModalEdit";
import DeleteOrderModal from "../components/Orders/OrderModalDelete";
import StatsBar from "../components/StatBar";

/* Field yang dapat dicari lewat kolom search */
const getSearchableText = (order: OrderType): string[] =>
  [
    order.orderNumber,
    order.name,
    order.user?.name,
    order.paymentMethod,
    order.status,
  ].map((value) => value?.toLowerCase() || "");

const Orders = () => {
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const { orders, loading, error, getOrders } = useOrders(
    "",
    selectedMonth,
    selectedYear,
  );

  const { orders: allOrders } = useOrders("", "", "");

  const {
    selectedOrder,
    editingOrder,
    deletingOrder,
    loadingDetail,
    loadingSubmit,
    loadingDelete,
    showDetail,
    closeDetail,
    startEdit,
    closeEdit,
    updateOrder,
    requestDelete,
    closeDelete,
    deleteOrder,
  } = useOrderActions(getOrders);

  /*
   * Search dilakukan di FE.
   * Backend sudah melakukan filter berdasarkan bulan.
   */
  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return orders;

    return orders.filter((order) =>
      getSearchableText(order).some((text) => text.includes(keyword)),
    );
  }, [orders, search]);

  const revenue = useMemo(() => totalRevenueHarga(orders), [orders]);

  const totalItemsCompleted = useMemo(
    () => getTotalItemsCompleted(orders),
    [orders],
  );

  const totalOrdersCompleted = useMemo(
    () => getTotalOrdersCompleted(orders),
    [orders],
  );

  const totalAllOrders = useMemo(() => getTotalOrders(allOrders), [allOrders]);

  const totalAllItems = useMemo(() => getTotalItems(orders), [orders]);

  const totalAllRevenue = useMemo(() => getTotalRevenue(orders), [orders]);

  const resetSearch = () => setSearch("");

  const resetMonth = () => {
    setSelectedMonth("");
    setSelectedYear("");
  };

  const renderOrderList = () => {
    if (loading) return <PageSpinner />;

    if (error) return <OrderErrorState message={error} onRetry={getOrders} />;

    if (filteredOrders.length === 0) {
      return (
        <OrderEmptyState isSearching={!!search} onResetSearch={resetSearch} />
      );
    }

    return (
      <OrderTable
        orders={filteredOrders}
        actionsDisabled={loadingDetail}
        onShowDetail={showDetail}
        onEdit={startEdit}
        onDelete={requestDelete}
      />
    );
  };

  return (
    <div className="min-h-screen animate-fade-in space-y-6 pb-8">
      {/* Statistics */}
      <StatsBar
        stats={[
          {
            label:
              selectedMonth || selectedYear
                ? "Total Order Bulan ini"
                : "Total Order",
            value:
              selectedMonth || selectedYear
                ? totalOrdersCompleted
                : totalAllOrders,
          },
          {
            label:
              selectedMonth || selectedYear
                ? "Total Item Terjual Bulan ini"
                : "Total Item Terjual",
            value:
              selectedMonth || selectedYear
                ? totalItemsCompleted
                : totalAllItems,
          },
          {
            label:
              selectedMonth || selectedYear
                ? "Pendapatan Kotor Bulan ini"
                : "Pendapatan Kotor",
            value:
              selectedMonth || selectedYear
                ? formatRupiah(revenue)
                : formatRupiah(totalAllRevenue),
          },
        ]}
      />

      {/* Order list */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-4 sm:p-5">
          <OrderFilters
            search={search}
            month={selectedMonth}
            year={selectedYear}
            onSearchChange={setSearch}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
            onResetMonth={resetMonth}
          />
        </div>

        {renderOrderList()}
      </section>

      {/* Modals */}
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={closeDetail} />
      )}

      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          loading={loadingSubmit}
          onClose={closeEdit}
          onSubmit={updateOrder}
        />
      )}

      {deletingOrder && (
        <DeleteOrderModal
          order={deletingOrder}
          loading={loadingDelete}
          onCancel={closeDelete}
          onConfirm={deleteOrder}
        />
      )}
    </div>
  );
};

export default Orders;
