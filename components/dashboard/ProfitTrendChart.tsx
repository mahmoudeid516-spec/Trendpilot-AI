"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type Props = {
  products: any[];
};

export default function ProfitTrendChart({ products }: Props) {
  const data = products.map((p: any) => ({
    name: p.name?.length > 15 ? p.name.slice(0, 15) + "..." : p.name,
    Profit: Number(p.profit || 0),
    AI: Number(p.ai_score || 0),
  }));

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
      <div className="mb-6">
        <h2 className="text-3xl font-bold">📈 Profit vs AI Score</h2>

        <p className="mt-2 text-gray-500">
          Compare expected profit against AI confidence.
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex h-80 items-center justify-center rounded-2xl bg-gray-50 text-gray-500">
          Search for products to display analytics.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="Profit"
              strokeWidth={3}
            />

            <Line
              type="monotone"
              dataKey="AI"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}