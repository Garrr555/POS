/* eslint-disable react-hooks/set-state-in-effect */
import {
  UtensilsCrossed,
  LayoutGrid,
  Coffee,
  Salad,
  Package,
  TrendingUp,
  Warehouse,
  ListOrdered,
  SquareMenu,
  BanknoteArrowDown,
  BanknoteCheck,
} from "lucide-react";
import type { EventType } from "../types/type";
import { useEffect, useMemo, useState } from "react";
import useEvents from "../hooks/useEvents";
import {
  getTotalItemsCompleted,
  getTotalOrdersCompleted,
  totalRevenueHarga,
} from "../utils/orderHelpers";
import useOrders from "../hooks/useOrders";

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const AdminDashboard = () => {
  const { events, tagEvent, myEvent, saveEvents } = useEvents(
    "1000",
    "1",
    "",
    "10",
  );

  const [employees, setEmployees] = useState<EventType[]>([]);
  const { orders } = useOrders();

  useEffect(() => {
    setEmployees(tagEvent ?? []);
  }, [events, tagEvent, myEvent, saveEvents]);

  const stats = useMemo(() => {
    const foodMenus = employees.filter(
      (item) => item.type?.trim().toLowerCase() === "food",
    );

    const drinkMenus = employees.filter(
      (item) => item.type?.trim().toLowerCase() === "drink",
    );

    const stockMenus = employees.filter(
      (item) => item.type?.trim().toLowerCase() === "stock",
    );

    // Total seluruh produk selain stock
    const totalMenus = employees.filter(
      (item) => item.type?.trim().toLowerCase() !== "stock",
    ).length;

    // Total harga seluruh menu selain stock
    const totalMenuValue = employees
      .filter((item) => item.type?.trim().toLowerCase() !== "stock")
      .reduce((total, item) => total + (Number(item.price) || 0), 0);

    // Menu terakhir: semua produk selain stock.
    const latestMenus = employees
      .filter((item) => item.type?.trim().toLowerCase() !== "stock")
      .sort(
        (a, b) =>
          new Date(b.CreatedAt ?? 0).getTime() -
          new Date(a.CreatedAt ?? 0).getTime(),
      )
      .slice(0, 5);

    // Stok terakhir: hanya produk bertipe stock.
    const latestStock = employees
      .filter((item) => item.type?.trim().toLowerCase() === "stock")
      .sort(
        (a, b) =>
          new Date(b.CreatedAt ?? 0).getTime() -
          new Date(a.CreatedAt ?? 0).getTime(),
      )
      .slice(0, 5);

    return {
      foodMenus,
      drinkMenus,
      stockMenus,
      totalMenus,
      totalMenuValue,
      latestMenus,
      latestStock,
    };
  }, [employees]);

  const revenue = useMemo(() => totalRevenueHarga(orders), [orders]);

  const totalItemsCompleted = useMemo(
    () => getTotalItemsCompleted(orders),
    [orders],
  );

  const totalOrdersCompleted = useMemo(
    () => getTotalOrdersCompleted(orders),
    [orders],
  );

  const totalMenu = stats.foodMenus.length + stats.drinkMenus.length;

  const summaryCards = [
    {
      title: "Total Order",
      value: totalOrdersCompleted,
      description: "Menu minuman",
      icon: ListOrdered,
      iconClass: "bg-purple-50 text-purple-600",
    },
    {
      title: "Total Item Terjual",
      value: totalItemsCompleted,
      description: "Menu stok",
      icon: SquareMenu,
      iconClass: "bg-yellow-50 text-yellow-600",
    },
    {
      title: "Pendapatan Kotor",
      value: formatRupiah(revenue),
      description: "Menu minuman",
      icon: BanknoteArrowDown,
      iconClass: "bg-blue-50 text-blue-600",
    },
    {
      title: "Pendapatan Bersih",
      value: formatRupiah(revenue),
      description: "Menu stok",
      icon: BanknoteCheck,
      iconClass: "bg-green-50 text-green-600",
    },
    {
      title: "Total Menu",
      value: totalMenu,
      description: "Semua menu terdaftar",
      icon: UtensilsCrossed,
      iconClass: "bg-orange-50 text-orange-600",
    },
    {
      title: "Menu Food",
      value: stats.foodMenus.length,
      description: "Menu makanan",
      icon: Salad,
      iconClass: "bg-amber-50 text-amber-600",
    },
    {
      title: "Menu Drink",
      value: stats.drinkMenus.length,
      description: "Menu minuman",
      icon: Coffee,
      iconClass: "bg-orange-50 text-orange-600",
    },
    {
      title: "Menu Stock",
      value: stats.stockMenus.length,
      description: "Menu stok",
      icon: Package,
      iconClass: "bg-slate-50 text-slate-600",
    },
  ];

  return (
    <div className="min-h-screen animate-fade-in space-y-6 pb-8">
      {/* Header */}
      <section>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard POS</h1>
        <p className="mt-1 text-sm text-slate-500">
          Ringkasan dan informasi menu restoran Anda.
        </p>
      </section>

      {/* Summary */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.iconClass}`}
              >
                <Icon size={23} />
              </div>

              <div className="min-w-0">
                <p className="text-sm text-slate-500">{card.title}</p>
                <p className="mt-1 break-words text-2xl font-bold text-slate-900">
                  {card.value}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Menu Distribution */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <LayoutGrid size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">Distribusi Menu</h2>
              <p className="text-sm text-slate-500">
                Perbandingan kategori makanan dan minuman
              </p>
            </div>
          </div>

          {employees.length === 0 ? (
            <div className="flex min-h-36 flex-col items-center justify-center text-center">
              <Package size={32} className="mb-2 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">
                Belum ada menu
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Tambahkan menu untuk melihat distribusinya.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {[
                {
                  label: "Food",
                  count: stats.foodMenus.length,
                  color: "bg-orange-500",
                  icon: Salad,
                },
                {
                  label: "Drink",
                  count: stats.drinkMenus.length,
                  color: "bg-amber-400",
                  icon: Coffee,
                },
                {
                  label: "Stock",
                  count: stats.stockMenus.length,
                  color: "bg-slate-400",
                  icon: Warehouse,
                },
                {
                  label: "Lainnya",
                  count:
                    employees.length -
                    stats.foodMenus.length -
                    stats.drinkMenus.length -
                    stats.stockMenus.length,
                  color: "bg-slate-400",
                  icon: Package,
                },
              ].map((category) => {
                const Icon = category.icon;
                const percentage = (category.count / employees.length) * 100;

                return (
                  <div key={category.label}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Icon size={17} className="text-slate-500" />
                        {category.label}
                      </div>
                      <span className="text-sm text-slate-500">
                        {category.count} menu ({Math.round(percentage)}%)
                      </span>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all ${category.color}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Info */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <TrendingUp size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">Informasi Menu</h2>
              <p className="text-sm text-slate-500">Ringkasan katalog</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl bg-orange-50/70 p-4">
              <p className="text-sm text-slate-600">Kategori terbanyak</p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {stats.foodMenus.length === stats.drinkMenus.length
                  ? "Seimbang"
                  : stats.foodMenus.length > stats.drinkMenus.length
                    ? "Food"
                    : "Drink"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Berdasarkan jumlah menu Food dan Drink.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="text-sm text-slate-500">Rata-rata harga menu</p>
              <p className="mt-1 text-xl font-bold text-slate-900">
                {formatRupiah(
                  stats.totalMenus
                    ? stats.totalMenuValue / stats.totalMenus
                    : 0,
                )}
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-4">
              <Package size={20} className="text-orange-500" />
              <div>
                <p className="text-sm font-medium text-slate-800">
                  Katalog Menu
                </p>
                <p className="text-xs text-slate-500">
                  {employees.length} menu terdaftar
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Menus */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5">
          <div>
            <h2 className="font-semibold text-slate-900">Menu Terbaru</h2>
            <p className="mt-1 text-sm text-slate-500">
              Lima menu terakhir yang ditambahkan
            </p>
          </div>
        </div>

        {stats.latestMenus.length === 0 ? (
          <div className="p-8 text-center">
            <UtensilsCrossed
              size={32}
              className="mx-auto mb-2 text-slate-300"
            />
            <p className="text-sm text-slate-500">Belum ada data menu.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {stats.latestMenus.map((menu) => (
              <div
                key={menu.ID}
                className="flex items-center gap-3 p-4 transition-colors hover:bg-slate-50 sm:px-5"
              >
                {menu.image ? (
                  <img
                    src={menu.image}
                    alt={menu.name}
                    className="h-12 w-12 shrink-0 rounded-xl border border-slate-100 object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                    <UtensilsCrossed size={20} />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {menu.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {menu.type || "Tanpa kategori"}
                  </p>
                </div>

                <p className="shrink-0 text-sm font-semibold text-slate-900">
                  {formatRupiah(Number(menu.price) || 0)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Latest Stock */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5">
          <div>
            <h2 className="font-semibold text-slate-900">Stok Terbaru</h2>
            <p className="mt-1 text-sm text-slate-500">
              Lima stok terakhir yang ditambahkan
            </p>
          </div>
        </div>

        {stats.latestStock.length === 0 ? (
          <div className="p-8 text-center">
            <UtensilsCrossed
              size={32}
              className="mx-auto mb-2 text-slate-300"
            />
            <p className="text-sm text-slate-500">Belum ada data stok.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {stats.latestStock.map((stock) => (
              <div
                key={stock.ID}
                className="flex items-center gap-3 p-4 transition-colors hover:bg-slate-50 sm:px-5"
              >
                {stock.image ? (
                  <img
                    src={stock.image}
                    alt={stock.name}
                    className="h-12 w-12 shrink-0 rounded-xl border border-slate-100 object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                    <UtensilsCrossed size={20} />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {stock.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {stock.type || "Tanpa kategori"}
                  </p>
                </div>

                <p className="shrink-0 text-sm font-semibold text-slate-900">
                  {formatRupiah(Number(stock.price) || 0)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
