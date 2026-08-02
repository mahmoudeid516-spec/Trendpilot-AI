"use client";

import Link from "next/link";
import { Compass, Rocket } from "lucide-react";
import type { Opportunity } from "../../types/opportunity";

type Props = {
  product: Opportunity;
};

function competitionBadgeClass(level: Opportunity["competition"]): string {
  if (level === "Low") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (level === "Medium") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-rose-200 bg-rose-50 text-rose-700";
}

function money(value: number): string {
  return `$${value.toFixed(2)}`;
}

export default function OpportunityCard({ product }: Props) {
  return (
    <div
     
      className="overflow-hidden rounded-[32px] border border-white/75 bg-white/92 shadow-[0_22px_60px_-44px_rgba(15,23,42,0.45)]"
    >
      <div className="relative flex h-56 items-center justify-center bg-white p-6">
      
    <img
  src={product.image || "/images/product-placeholder.png"}
  alt={product.name}
  className="max-h-full max-w-full object-contain"
/>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-lg font-bold leading-6 text-slate-900">{product.name}</h3>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">
              {product.marketplace}
            </span>
            <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[11px] font-semibold text-cyan-700">
              {product.category}
            </span>
          </div>
        </div>

        {/* Price */}
<div className="mt-3">
  <p className="text-3xl font-bold text-slate-900">
    ${product.sellingPrice?.toFixed(2) ?? "0.00"}
  </p>
</div>

{/* Rating + Reviews */}
<div className="mt-2 flex items-center gap-4 text-sm text-slate-600">

  <span>
    ⭐ {product.rating?.toFixed(1) ?? "-"}
  </span>

  <span>
    💬 {product.reviews?.toLocaleString() ?? 0} Reviews
  </span>

  <span>
    📦 {product.sales?.toLocaleString() ?? 0} Sold
  </span>

</div>

{/* Amazon badges */}
<div className="mt-3 flex flex-wrap gap-2">

  {product.isAmazonChoice && (
    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
      Amazon Choice
    </span>
  )}

  {product.isBestSeller && (
    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
      Best Seller
    </span>
  )}

</div>

<div className="grid grid-cols-2 gap-2.5 mt-5">
          <MetricChip label="Opportunity Score" value={`${product.opportunityScore}%`} tone="text-emerald-700" />
          <MetricChip label="Trend Score" value={`${product.trendScore}%`} tone="text-cyan-700" />
          <MetricChip label="Estimated Profit" value={money(product.estimatedProfit)} tone="text-violet-700" />
          <MetricChip label="Confidence" value={`${product.confidence}%`} tone="text-blue-700" />
        </div>

        <div className="flex items-center justify-between">
          <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${competitionBadgeClass(product.competition)}`}>
            {product.competition} Competition
          </span>
          <p className="text-xs leading-5 text-slate-600">{product.aiExplanation}</p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <Link
  href={`/dashboard/opportunities/${product.id}`}
  className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
>
  <Compass size={14} />
  View Details
</Link>
          <button
            type="button"
            className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:shadow-xl"
            aria-label={`Generate report for ${product.name}`}
          >
            <Rocket size={14} aria-hidden="true" />
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className={`mt-1 text-sm font-bold ${tone}`}>{value}</p>
    </div>
  );
}
