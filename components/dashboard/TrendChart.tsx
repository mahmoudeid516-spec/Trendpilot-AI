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
import { TrendingUp } from "lucide-react";

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
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 text-2xl font-semibold tracking-tight text-slate-900">
          <TrendingUp className="h-5 w-5 text-indigo-500" />
          Product Trend
        </h2>
        <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-700">
          7 day signal
        </span>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />

          <XAxis dataKey="day" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />

          <YAxis tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />

          <Tooltip
            contentStyle={{
              background: "#FFFFFF",
              border: "1px solid rgba(148,163,184,0.35)",
              borderRadius: "12px",
              color: "#0F172A",
            }}
          />

          <Line
            type="monotone"
            dataKey="trend"
            stroke="#4F46E5"
            strokeWidth={3}
            dot={{ r: 3, fill: "#6366F1" }}
            activeDot={{ r: 5, fill: "#4338CA" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}