"use client";

import type { Product } from "../../types/Product";
import Card from "../ui/Card";
import MetricTile from "../ui/MetricTile";
import Pill from "../ui/Pill";

type Props = {
  product: Partial<Product>;
};

export default function AISalesForecast({ product }: Props) {
  if (!product) return null;

  const aiScore = Number(product.ai_score ?? 80);
  const trendScore = Number(product.trend_score ?? 70);
  const unitProfit = Number(product.profit ?? 20);
  const sellingPrice = Number(product.selling_price ?? 30);
  const competition = product.competition ?? "Medium";

  const competitionModifier =
    competition === "Low"
      ? 1.15
      : competition === "High"
      ? 0.8
      : 1;

  const demandIndex =
    aiScore * 0.55 + trendScore * 0.45;

  const baseDailyOrders = Math.max(
    4,
    Math.round((demandIndex / 10) * competitionModifier)
  );

  const confidence = Math.min(
    99,
    Math.round(aiScore * 0.7 + trendScore * 0.3)
  );

  const periods = [7, 30, 90].map((days) => {
    const orders = Math.round(baseDailyOrders * days);
    const revenue = Math.round(orders * sellingPrice);
    const profit = Math.round(orders * unitProfit);

    return {
      days,
      orders,
      revenue,
      profit,
    };
  });

  const scenarioMultipliers = {
    conservative: 0.75,
    base: 1,
    aggressive: 1.25,
  };

  const scenario = {
    conservative: Math.round(periods[1].orders * scenarioMultipliers.conservative),
    base: periods[1].orders,
    aggressive: Math.round(periods[1].orders * scenarioMultipliers.aggressive),
  };

  return (
    <div className="mt-6 border-t border-[var(--border-subtle)] p-6 sm:p-8">

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-[var(--ink-900)]">AI Sales Forecast</h2>
        <Pill tone="ai">Projection</Pill>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-[var(--accent-data-soft)] p-5">
          <MetricTile label="30-Day Orders" value={periods[1].orders} tone="data" />
        </div>
        <div className="rounded-xl bg-[var(--accent-positive-soft)] p-5">
          <MetricTile label="30-Day Revenue" value={`$${periods[1].revenue.toLocaleString()}`} tone="positive" />
        </div>
        <div className="rounded-xl bg-[var(--accent-ai-soft)] p-5">
          <MetricTile label="30-Day Profit" value={`$${periods[1].profit.toLocaleString()}`} tone="ai" />
        </div>
        <div className="rounded-xl bg-[var(--accent-warning-soft)] p-5">
          <MetricTile label="Confidence" value={`${confidence}%`} tone="warning" />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {periods.map((period) => (
          <Card key={period.days} padding="sm">
            <p className="text-sm text-[var(--ink-500)]">Next {period.days} Days</p>
            <p className="mt-2 text-xl font-bold text-[var(--ink-900)]">{period.orders} orders</p>
            <p className="mt-2 text-sm text-[var(--ink-700)]">Revenue ${period.revenue.toLocaleString()}</p>
            <p className="text-sm text-[var(--ink-700)]">Profit ${period.profit.toLocaleString()}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-[var(--surface-muted)] p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-[var(--ink-400)]">
          Scenario Forecast (30 Days)
        </h3>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[var(--ink-500)]">Conservative</span>
            <strong className="text-[var(--ink-900)]">{scenario.conservative} orders</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[var(--ink-500)]">Base</span>
            <strong className="text-[var(--ink-900)]">{scenario.base} orders</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[var(--ink-500)]">Aggressive</span>
            <strong className="text-[var(--ink-900)]">{scenario.aggressive} orders</strong>
          </div>
        </div>
      </div>

    </div>
  );
}
