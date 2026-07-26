"use client";

import { Activity, BarChart3, DollarSign, ShoppingCart } from "lucide-react";
import type { Product } from "./ProductsTable";

type Props = {
  product: Product | null;
};

export default function AISalesForecast({ product }: Props) {
  if (!product) return null;

  const aiScore = Number(product.ai_score || 80);
  const profit = Number(product.profit || 20);

  const orders = Math.round(aiScore * 14);
  const revenue = orders * Number(product.selling_price || 30);
  const totalProfit = orders * profit;
  const confidence = Math.min(99, aiScore + 4);

  return (
    <div className="mt-8 rounded-3xl border border-white/10 bg-[rgba(17,24,39,0.72)] p-8 shadow-[0_24px_70px_-40px_rgba(124,58,237,0.9)] backdrop-blur-xl">
      <h2 className="mb-7 text-3xl font-extrabold tracking-tight text-white">AI Sales Forecast</h2>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-cyan-300/25 bg-cyan-500/12 p-5">
          <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-200">
            <ShoppingCart size={14} />
            Expected Orders
          </p>
          <h3 className="mt-3 text-3xl font-extrabold text-white">{orders}</h3>
        </div>

        <div className="rounded-2xl border border-emerald-300/25 bg-emerald-500/12 p-5">
          <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-200">
            <DollarSign size={14} />
            Revenue
          </p>
          <h3 className="mt-3 text-3xl font-extrabold text-white">${revenue.toLocaleString()}</h3>
        </div>

        <div className="rounded-2xl border border-violet-300/25 bg-violet-500/12 p-5">
          <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-violet-200">
            <BarChart3 size={14} />
            Profit
          </p>
          <h3 className="mt-3 text-3xl font-extrabold text-white">${totalProfit.toLocaleString()}</h3>
        </div>

        <div className="rounded-2xl border border-amber-300/25 bg-amber-500/12 p-5">
          <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-amber-200">
            <Activity size={14} />
            Confidence
          </p>
          <h3 className="mt-3 text-3xl font-extrabold text-white">{confidence}%</h3>
        </div>
      </div>
    </div>
  );
}
