"use client";

import type { Product } from "../../types/Product";

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
    <div className="mt-8 rounded-3xl bg-white shadow-xl border border-gray-100 p-8">

      <h2 className="text-3xl font-bold mb-8">
        📈 AI Sales Forecast
      </h2>

      <div className="grid md:grid-cols-4 gap-6">

        <div className="rounded-2xl bg-blue-50 p-6">
          <p className="text-gray-500">30-Day Orders</p>
          <h2 className="text-4xl font-bold mt-3">
            {periods[1].orders}
          </h2>
        </div>

        <div className="rounded-2xl bg-green-50 p-6">
          <p className="text-gray-500">30-Day Revenue</p>
          <h2 className="text-4xl font-bold mt-3">
            ${periods[1].revenue.toLocaleString()}
          </h2>
        </div>

        <div className="rounded-2xl bg-purple-50 p-6">
          <p className="text-gray-500">30-Day Profit</p>
          <h2 className="text-4xl font-bold mt-3">
            ${periods[1].profit.toLocaleString()}
          </h2>
        </div>

        <div className="rounded-2xl bg-orange-50 p-6">
          <p className="text-gray-500">Confidence</p>
          <h2 className="text-4xl font-bold mt-3">
            {confidence}%
          </h2>
        </div>

      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-5">
        {periods.map((period) => (
          <div
            key={period.days}
            className="rounded-2xl border border-gray-200 p-5"
          >
            <p className="text-sm text-gray-500">
              Next {period.days} Days
            </p>

            <p className="mt-2 text-2xl font-bold">
              {period.orders} orders
            </p>

            <p className="mt-2 text-gray-700">
              Revenue ${period.revenue.toLocaleString()}
            </p>

            <p className="text-gray-700">
              Profit ${period.profit.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-gray-50 p-6">
        <h3 className="text-xl font-bold mb-4">
          Scenario Forecast (30 Days)
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Conservative</span>
            <strong>{scenario.conservative} orders</strong>
          </div>

          <div className="flex items-center justify-between">
            <span>Base</span>
            <strong>{scenario.base} orders</strong>
          </div>

          <div className="flex items-center justify-between">
            <span>Aggressive</span>
            <strong>{scenario.aggressive} orders</strong>
          </div>
        </div>
      </div>

    </div>
  );
}