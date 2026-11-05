import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from "recharts";

import type { OrderType } from "../../types/type";
import { formatRupiah, isCompleted } from "../../utils/orderHelpers";

type OrderChartProps = {
  orders: OrderType[];
  month: string;
  year: string;
};

type ChartData = {
  label: string;
  orders: number;
  revenue: number;
  hpp: number;
  netRevenue: number;
};

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

const OrderChart = ({ orders, month, year }: OrderChartProps) => {
  const chartData = useMemo<ChartData[]>(() => {
    const currentDate = new Date();

    const selectedYear = year ? Number(year) : currentDate.getFullYear();

    const selectedMonth = month ? Number(month) - 1 : null;

    // Jika bulan dipilih, grafik menampilkan data per hari.
    if (selectedMonth !== null) {
      const daysInMonth = new Date(
        selectedYear,
        selectedMonth + 1,
        0,
      ).getDate();

      const dailyData = Array.from({ length: daysInMonth }, (_, index) => ({
        label: String(index + 1),
        orders: 0,
        revenue: 0,
        hpp: 0,
        netRevenue: 0,
      }));

      orders.forEach((order) => {
        if (!isCompleted(order.status)) return;

        const date = new Date(order.CreatedAt);

        if (
          date.getFullYear() !== selectedYear ||
          date.getMonth() !== selectedMonth
        ) {
          return;
        }

        const index = date.getDate() - 1;

        dailyData[index].orders += 1;
        dailyData[index].revenue += Number(order.total || 0);
        dailyData[index].hpp += Number(order.totalHpp || 0);
        dailyData[index].netRevenue +=
          Number(order.total || 0) - Number(order.totalHpp || 0);
      });

      return dailyData;
    }

    // Jika hanya tahun dipilih atau tanpa filter,
    // grafik menampilkan data per bulan.
    const monthlyData = MONTH_LABELS.map((label) => ({
      label,
      orders: 0,
      revenue: 0,
      hpp: 0,
      netRevenue: 0,
    }));

    orders.forEach((order) => {
      if (!isCompleted(order.status)) return;

      const date = new Date(order.CreatedAt);

      if (date.getFullYear() !== selectedYear) return;

      const index = date.getMonth();

      monthlyData[index].orders += 1;
      monthlyData[index].revenue += Number(order.total || 0);
      monthlyData[index].hpp += Number(order.totalHpp || 0);
      monthlyData[index].netRevenue +=
        Number(order.total || 0) - Number(order.totalHpp || 0);
    });

    return monthlyData;
  }, [orders, month, year]);

  const hasData = chartData.some((item) => item.orders > 0 || item.revenue > 0);

  const tooltipStyle = {
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
    fontSize: "12px",
  };

  return (
    <section className=" flex justify-between gap-2 items-center">
      {/* Orders Chart */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5 w-full h-full">
        <div className="mb-5">
          <h3 className="text-base font-semibold text-slate-800">
            Statistik Orders
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Jumlah order completed berdasarkan periode.
          </p>
        </div>

        <div className="h-80 w-full">
          {!hasData ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              Belum ada data orders.
            </div>
          ) : (
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
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />

                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [
                    `${Number(value).toLocaleString("id-ID")} order`,
                    "Total Orders",
                  ]}
                  labelFormatter={(label) => `Periode: ${label}`}
                />

                <Bar
                  dataKey="orders"
                  name="Orders"
                  fill="#f97316"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5 w-full">
        <div className="mb-5">
          <h3 className="text-base font-semibold text-slate-800">
            Statistik Pendapatan
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Perbandingan pendapatan kotor, hpp, dan bersih.
          </p>
        </div>

        <div className="h-72 w-full">
          {!hasData ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              Belum ada data pendapatan.
            </div>
          ) : (
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
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />

                <YAxis
                  tickFormatter={formatAxisRupiah}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  width={65}
                />

                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value, name, props) => [
                    formatRupiah(Number(value)),
                    props.dataKey === "revenue" || name === "revenue"
                      ? "Pendapatan Kotor"
                      : props.dataKey === "hpp"
                        ? "HPP"
                        : "Pendapatan Bersih",
                  ]}
                  labelFormatter={(label) => `Periode: ${label}`}
                />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Pendapatan Kotor"
                  stroke="#f97316"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5 }}
                />

                <Line
                  type="monotone"
                  dataKey="hpp"
                  name="HPP"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5 }}
                />

                <Line
                  type="monotone"
                  dataKey="netRevenue"
                  name="Pendapatan Bersih"
                  stroke="#16a34a"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
            Pendapatan Kotor
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            HPP
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
            Pendapatan Bersih
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderChart;
