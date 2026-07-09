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

const data = [
  { day: "Mon", trend: 25 },
  { day: "Tue", trend: 32 },
  { day: "Wed", trend: 45 },
  { day: "Thu", trend: 58 },
  { day: "Fri", trend: 71 },
  { day: "Sat", trend: 89 },
  { day: "Sun", trend: 98 },
];

export default function TrendChart() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6">
        📈 Product Trend
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="day" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="trend"
            stroke="#7C3AED"
            strokeWidth={4}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}