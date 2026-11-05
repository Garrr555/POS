/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";

import useOrders from "../hooks/useOrders";

import {
  formatRupiah,
  getTotalHpp,
  getTotalItems,
  getTotalItemsCompleted,
  getTotalOrders,
  getTotalOrdersCompleted,
  getTotalRevenue,
  totalRevenueHarga,
  totalRevenueHpp,
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
import OrderChart from "../components/Orders/OrderChart";

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

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const startItem =
    filteredOrders.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  const endItem = Math.min(currentPage * itemsPerPage, filteredOrders.length);

  const revenue = useMemo(() => totalRevenueHarga(orders), [orders]);
  const hpp = useMemo(() => totalRevenueHpp(orders), [orders]);

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

  const totalAllHpp = useMemo(() => getTotalHpp(orders), [orders]);

  const resetSearch = () => setSearch("");

  const resetMonth = () => {
    setSelectedMonth("");
    setSelectedYear("");
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedMonth, selectedYear]);

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
        orders={paginatedOrders}
        actionsDisabled={loadingDetail}
        onShowDetail={showDetail}
        onEdit={startEdit}
        onDelete={requestDelete}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={filteredOrders.length}
        startItem={startItem}
        endItem={endItem}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value);
          setCurrentPage(1);
        }}
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
          {
            label:
              selectedMonth || selectedYear
                ? "Total HPP Bulan ini"
                : "Total HPP",
            value:
              selectedMonth || selectedYear
                ? formatRupiah(hpp)
                : formatRupiah(totalAllHpp),
          },
          {
            label:
              selectedMonth || selectedYear
                ? "Pendapatan Bersih Bulan ini"
                : "Pendapatan Bersih",
            value:
              selectedMonth || selectedYear
                ? formatRupiah(revenue - hpp)
                : formatRupiah(totalAllRevenue - totalAllHpp),
            auth: true,
          },
        ]}
      />

      {/* Order Charts */}
      <div className="hidden lg:inline">
        <OrderChart orders={orders} month={selectedMonth} year={selectedYear} />
      </div>

      {/* Order list */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white lg:mt-5">
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
