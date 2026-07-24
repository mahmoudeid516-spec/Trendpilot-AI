"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Props = {
  products: any[];
};

export default function TrendChart({ products }: Props) {
  const data = products.slice(0, 10).map((product, index) => ({
    name:
      product.name?.length > 18
        ? product.name.substring(0, 18) + "..."
        : product.name || `Product ${index + 1}`,
    trend: Number(product.trend_score || 0),
    ai: Number(product.ai_score || 0),
    profit: Number(product.profit || 0),
  }));

  const avgTrend =
    data.length > 0
      ? Math.round(
          data.reduce((sum, item) => sum + item.trend, 0) / data.length
        )
      : 0;

  const avgAI =
    data.length > 0
      ? Math.round(
          data.reduce((sum, item) => sum + item.ai, 0) / data.length
        )
      : 0;

  const avgProfit =
    data.length > 0
      ? Math.round(
          data.reduce((sum, item) => sum + item.profit, 0) / data.length
        )
      : 0;

  return (
    <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
      <h2 className="mb-6 text-2xl font-bold">
        📈 AI Market Trend Analysis
      </h2>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-purple-50 p-5">
          <p className="text-sm text-gray-500">Average Trend</p>
          <h3 className="mt-2 text-3xl font-bold text-purple-700">
            {avgTrend}%
          </h3>
        </div>

        <div className="rounded-2xl bg-green-50 p-5">
          <p className="text-sm text-gray-500">Average AI Score</p>
          <h3 className="mt-2 text-3xl font-bold text-green-600">
            {avgAI}%
          </h3>
        </div>

        <div className="rounded-2xl bg-blue-50 p-5">
          <p className="text-sm text-gray-500">Average Profit</p>
          <h3 className="mt-2 text-3xl font-bold text-blue-600">
            ${avgProfit}
          </h3>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center text-gray-500">
          Search for products to display trend analytics.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="name"
              tick={{ fontSize: 11 }}
              interval={0}
            />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="trend"
              name="Trend Score"
              stroke="#7C3AED"
              strokeWidth={4}
              dot={{ r: 5 }}
            />

            <Line
              type="monotone"
              dataKey="ai"
              name="AI Score"
              stroke="#10B981"
              strokeWidth={4}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}