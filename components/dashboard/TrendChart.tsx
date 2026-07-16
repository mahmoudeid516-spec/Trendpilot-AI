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
    <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
      <h2 className="text-2xl font-bold mb-6">
      📈 AI Market Trend Analysis
      </h2>

      <div className="mb-6 flex flex-wrap gap-4">

  <div className="rounded-xl bg-purple-50 px-4 py-3">
    <p className="text-xs text-gray-500">Trend Score</p>
    <h3 className="text-2xl font-bold text-purple-700">98%</h3>
  </div>

  <div className="rounded-xl bg-green-50 px-4 py-3">
    <p className="text-xs text-gray-500">Growth</p>
    <h3 className="text-2xl font-bold text-green-600">+42%</h3>
  </div>

  <div className="rounded-xl bg-blue-50 px-4 py-3">
    <p className="text-xs text-gray-500">Forecast</p>
    <h3 className="text-2xl font-bold text-blue-600">Bullish</h3>
  </div>

</div>

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
  strokeWidth={5}
  dot={{ r: 5 }}
  activeDot={{ r: 8 }}
/>

  </LineChart>
      </ResponsiveContainer>
    </div>
  );
}