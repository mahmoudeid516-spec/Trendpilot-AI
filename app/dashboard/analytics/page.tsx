"use client";

import { useEffect, useState } from "react";
import { getReports } from "@/services/reports";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AnalyticsPage() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getReports();
      setReports(data ?? []);
    }

    load();
  }, []);

  const totalReports = reports.length;

  const averageOpportunity =
    totalReports === 0
      ? 0
      : Math.round(
          reports.reduce(
            (sum, report) => sum + report.opportunity_score,
            0
          ) / totalReports
        );

  const averageConfidence =
    totalReports === 0
      ? 0
      : Math.round(
          reports.reduce(
            (sum, report) => sum + report.confidence_score,
            0
          ) / totalReports
        );

  const marketplaces = reports.reduce((acc: any, report: any) => {
    acc[report.marketplace] = (acc[report.marketplace] || 0) + 1;
    return acc;
  }, {});

  const bestMarketplace =
    Object.entries(marketplaces).sort(
      (a: any, b: any) => Number(b[1]) - Number(a[1])
    )[0]?.[0] ?? "-";

  const barData = reports.map((report) => ({
    name: report.product_name?.slice(0, 12) || "Product",
    opportunity: report.opportunity_score,
    confidence: report.confidence_score,
  }));

  const pieData = [
    {
      name: "Opportunity",
      value: averageOpportunity,
    },
    {
      name: "Confidence",
      value: averageConfidence,
    },
  ];

  const COLORS = ["#6366F1", "#22C55E"];

  return (
    <div className="p-8">
      <h1 className="mb-2 text-3xl font-bold">
        Analytics Dashboard
      </h1>

      <p className="mb-8 text-slate-400">
        Business insights for your AI reports.
      </p>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border bg-slate-900 p-6">
          <p className="text-slate-400">Total Reports</p>
          <h2 className="mt-2 text-4xl font-bold">
            {totalReports}
          </h2>
        </div>

        <div className="rounded-2xl border bg-slate-900 p-6">
          <p className="text-slate-400">Avg Opportunity</p>
          <h2 className="mt-2 text-4xl font-bold">
            {averageOpportunity}
          </h2>
        </div>

        <div className="rounded-2xl border bg-slate-900 p-6">
          <p className="text-slate-400">Avg Confidence</p>
          <h2 className="mt-2 text-4xl font-bold">
            {averageConfidence}
          </h2>
        </div>

        <div className="rounded-2xl border bg-slate-900 p-6">
          <p className="text-slate-400">Top Marketplace</p>
          <h2 className="mt-2 text-2xl font-bold">
            {bestMarketplace}
          </h2>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border bg-slate-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Opportunity vs Confidence
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="opportunity"
                fill="#6366F1"
              />
              <Bar
                dataKey="confidence"
                fill="#22C55E"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border bg-slate-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Average Scores
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={110}
                label
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}