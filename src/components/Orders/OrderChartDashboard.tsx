import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { OrderType } from "../../types/type";
import { formatRupiah, isCompleted } from "../../utils/orderHelpers";

type DashboardOrderChartProps = {
  orders: OrderType[];
};

type Period = "7days" | "30days" | "12months";

type ChartData = {
  label: string;
  orders: number;
  revenue: number;
  netRevenue: number;
};

const PERIOD_OPTIONS: { label: string; value: Period }[] = [
  { label: "7 Hari", value: "7days" },
  { label: "30 Hari", value: "30days" },
  { label: "12 Bulan", value: "12months" },
];

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const formatAxisRupiah = (value: number) => {
  if (value >= 1_000_000) {
    return `Rp${(value / 1_000_000).toLocaleString("id-ID", {
      maximumFractionDigits: 1,
    })} jt`;
  }

  if (value >= 1_000) {
    return `Rp${(value / 1_000).toLocaleString("id-ID", {
      maximumFractionDigits: 1,
    })} rb`;
  }

  return `Rp${value.toLocaleString("id-ID")}`;
};

const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const DashboardOrderChart = ({ orders }: DashboardOrderChartProps) => {
  const [period, setPeriod] = useState<Period>("7days");

  const chartData = useMemo<ChartData[]>(() => {
    const today = new Date();

    // Grafik 12 bulan terakhir.
    if (period === "12months") {
      const monthlyData: ChartData[] = Array.from(
        { length: 12 },
        (_, index) => {
          const date = new Date(
            today.getFullYear(),
            today.getMonth() - 11 + index,
            1,
          );

          return {
            label: MONTH_LABELS[date.getMonth()],
            orders: 0,
            revenue: 0,
            netRevenue: 0,
          };
        },
      );

      orders.forEach((order) => {
        if (!isCompleted(order.status)) return;

        const date = new Date(order.CreatedAt);

        const monthDiff =
          (today.getFullYear() - date.getFullYear()) * 12 +
          today.getMonth() -
          date.getMonth();

        if (monthDiff < 0 || monthDiff > 11) return;

        const index = 11 - monthDiff;

        monthlyData[index].orders += 1;
        monthlyData[index].revenue += Number(order.total || 0);
        monthlyData[index].netRevenue +=
          Number(order.total || 0) - Number(order.totalHpp || 0);
      });

      return monthlyData;
    }

    // Grafik 7 atau 30 hari terakhir.
    const totalDays = period === "7days" ? 7 : 30;

    const dailyData: ChartData[] = Array.from(
      { length: totalDays },
      (_, index) => {
        const date = new Date(today);

        date.setDate(today.getDate() - (totalDays - 1 - index));

        return {
          label: `${date.getDate()} ${MONTH_LABELS[date.getMonth()]}`,
          orders: 0,
          revenue: 0,
          netRevenue: 0,
        };
      },
    );

    const startDate = new Date(today);

    startDate.setDate(today.getDate() - (totalDays - 1));
    startDate.setHours(0, 0, 0, 0);

    const dailyIndex = new Map<string, number>();

    dailyData.forEach((_, index) => {
      const date = new Date(startDate);

      date.setDate(startDate.getDate() + index);

      dailyIndex.set(getDateKey(date), index);
    });

    orders.forEach((order) => {
      if (!isCompleted(order.status)) return;

      const date = new Date(order.CreatedAt);

      const index = dailyIndex.get(getDateKey(date));

      if (index === undefined) return;

      dailyData[index].orders += 1;
      dailyData[index].revenue += Number(order.total || 0);
      dailyData[index].netRevenue +=
        Number(order.total || 0) - Number(order.totalHpp || 0);
    });

    return dailyData;
  }, [orders, period]);

  const hasData = chartData.some((item) => item.orders > 0 || item.revenue > 0);

  const tooltipStyle = {
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
    fontSize: "12px",
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Monitoring Orders</h2>

          <p className="mt-1 text-sm text-slate-500">
            Tren transaksi dan pendapatan POS.
          </p>
        </div>

        {/* Period Filter */}
        <div className="flex w-full rounded-xl bg-slate-100 p-1 sm:w-auto">
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPeriod(option.value)}
              className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition sm:flex-none ${
                period === option.value
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {!hasData ? (
        <div className="flex min-h-64 flex-col items-center justify-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
            <BarChart />
          </div>

          <p className="text-sm font-medium text-slate-700">
            Belum ada data orders
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Data transaksi selesai akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="">
          {/* Orders */}
          <div className="min-w-0">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-slate-800">
                Jumlah Orders
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Transaksi berstatus completed
              </p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 8,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />

                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => [
                      `${Number(value).toLocaleString("id-ID")} order`,
                      "Total Orders",
                    ]}
                  />

                  <Bar
                    dataKey="orders"
                    fill="#f97316"
                    radius={[5, 5, 0, 0]}
                    maxBarSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue */}
          <div className="min-w-0">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-slate-800">
                Pendapatan
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Kotor dan bersih berdasarkan periode
              </p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 12,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />

                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />

                  <YAxis
                    tickFormatter={formatAxisRupiah}
                    tick={{ fontSize: 10, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                    width={65}
                  />

                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value, name) => [
                      formatRupiah(Number(value)),
                      name === "revenue"
                        ? "Pendapatan Kotor"
                        : "Pendapatan Bersih",
                    ]}
                  />

                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="revenue"
                    stroke="#f97316"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="netRevenue"
                    name="netRevenue"
                    stroke="#16a34a"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      {hasData && (
        <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
            Pendapatan Kotor
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
            Pendapatan Bersih
          </div>
        </div>
      )}
    </section>
  );
};

export default DashboardOrderChart;
