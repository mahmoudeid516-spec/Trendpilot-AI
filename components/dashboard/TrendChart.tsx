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
import Card from "../ui/Card";

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
    <Card>
      <h2 className="mb-6 text-xl font-bold text-[var(--ink-900)]">Product Trend</h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />

          <XAxis dataKey="day" stroke="var(--ink-400)" fontSize={12} />

          <YAxis stroke="var(--ink-400)" fontSize={12} />

          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid var(--border-subtle)",
              boxShadow: "var(--shadow-card)",
            }}
          />

          <Line
            type="monotone"
            dataKey="trend"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
