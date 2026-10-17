import { useMemo, useState } from "react";

import useOrders from "../hooks/useOrders";

import {
  formatRupiah,
  getTotalItemsCompleted,
  getTotalOrdersCompleted,
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
  const currentDate = new Date();

  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(
    String(currentDate.getMonth() + 1),
  );
  const [selectedYear, setSelectedYear] = useState(
    String(currentDate.getFullYear()),
  );

  const { orders, loading, error, getOrders } = useOrders(
    "",
    selectedMonth,
    selectedYear,
  );

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

  const resetSearch = () => setSearch("");

  const resetMonth = () => {
    setSelectedMonth(String(currentDate.getMonth() + 1));
    setSelectedYear(String(currentDate.getFullYear()));
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
            label: "Total Order",
            value: totalOrdersCompleted,
            hint: "Transaksi pada periode terpilih",
          },
          {
            label: "Total Item Terjual",
            value: totalItemsCompleted,
            hint: "Akumulasi quantity item",
          },
          {
            label: "Pendapatan Kotor",
            value: formatRupiah(revenue),
            hint: "Dari order completed",
          },
        ]}
      />

      {/* Order list */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-4 sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Riwayat Transaksi
              </h2>

              <p className="text-sm text-slate-500">
                {filteredOrders.length} order ditampilkan
              </p>
            </div>

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
