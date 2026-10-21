import { useAuthStore } from "../store/auth.store";
import type { UserType } from "../types/type";
import {
  BanknoteArrowDown,
  DollarSignIcon,
  ListOrdered,
  MailIcon,
  SquareMenu,
  User2Icon,
} from "lucide-react";
import {
  formatRupiah,
  getTotalItemsCompleted,
  getTotalOrdersCompleted,
  totalRevenueHarga,
} from "../utils/orderHelpers";
import { useMemo } from "react";
import useOrders from "../hooks/useOrders";

const EmployeeDashboard = (data: UserType) => {
  const { user } = useAuthStore();
  const { orders } = useOrders();

  const revenue = useMemo(() => totalRevenueHarga(orders), [orders]);

  const totalItemsCompleted = useMemo(
    () => getTotalItemsCompleted(orders),
    [orders],
  );

  const totalOrdersCompleted = useMemo(
    () => getTotalOrdersCompleted(orders),
    [orders],
  );

  const summaryCards = [
    {
      value: data.name,
      title: "Name",
      iconClass: "bg-purple-50 text-purple-600",
      icon: User2Icon,
    },
    {
      value: data.email,
      title: "Email",
      iconClass: "bg-purple-50 text-purple-600",
      icon: MailIcon,
    },
    {
      value: formatRupiah(data.salary),
      title: "Latest Payslip",
      iconClass: "bg-purple-50 text-purple-600",
      icon: DollarSignIcon,
    },
    {
      title: "Total Order",
      value: totalOrdersCompleted,
      icon: ListOrdered,
      iconClass: "bg-purple-50 text-purple-600",
    },
    {
      title: "Total Item Terjual",
      value: totalItemsCompleted,
      icon: SquareMenu,
      iconClass: "bg-yellow-50 text-yellow-600",
    },
    {
      title: "Total Penjualan",
      value: formatRupiah(revenue),
      icon: BanknoteArrowDown,
      iconClass: "bg-blue-50 text-blue-600",
    },
  ];
  return (
    <div className="animate-fade-in">
      <div className="">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Welcome, <span className="text-orange-600">{user?.name}</span>
        </h1>

        <p className="mt-2 text-sm font-medium text-slate-500">
          <span className="capitalize text-slate-700">{user?.role}</span>
          <span className="mx-2 text-slate-300">•</span>
          <span>{user?.platform || "No Department"}</span>
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                <p className="mt-1 break-words text-xl font-bold text-slate-900">
                  {card.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
