"use client";

import { useState } from "react";
import type { ProductWithAnalysis } from "../../types/analysis";
import ScoreBadge from "./ScoreBadge";
import DecisionBadge from "./DecisionBadge";

const COMPETITION_STYLES: Record<string, string> = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-red-100 text-red-700",
};

export default function ProductCard({ product }: { product: ProductWithAnalysis }) {
  const [expanded, setExpanded] = useState(false);
  const rating = Number(product.store_rating ?? product.supplier_rating ?? 0);
  const orders = Number(product.orders ?? product.sales ?? 0);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow transition hover:shadow-xl">
      <div className="relative">
        <img
          src={product.image || "https://placehold.co/400x300?text=No+Image"}
          alt={product.name}
          className="h-48 w-full object-cover"
        />
        <div className="absolute left-3 top-3">
          <DecisionBadge decision={product.decision} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {product.platform}
        </p>
        <h3 className="mt-1 line-clamp-2 font-bold text-gray-900">{product.name}</h3>

        <p className="mt-2 text-sm text-gray-500">
          {rating > 0 ? `⭐ ${rating.toFixed(1)}` : "No rating"} &middot; {orders.toLocaleString()} orders
          {product.reviews ? ` · ${product.reviews.toLocaleString()} reviews` : ""}
        </p>

        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-2xl font-extrabold text-gray-900">${product.buy_price.toFixed(2)}</span>
          <span className="text-sm text-gray-400 line-through">${product.selling_price.toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-600">
          Est. profit <span className="font-semibold text-green-600">${(product.profit ?? 0).toFixed(2)}</span>
          {typeof product.roi === "number" && <> &middot; ROI {product.roi}%</>}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <ScoreBadge label="Opportunity" value={product.opportunity_score} />
          <ScoreBadge label="Win Prob." value={product.winning_probability} suffix="%" />
          <ScoreBadge label="Risk" value={product.risk_score} direction="lower-is-better" />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <span
            className={`rounded-full px-3 py-1 font-semibold ${COMPETITION_STYLES[product.competition] ?? "bg-gray-100 text-gray-500"}`}
          >
            Competition: {product.competition}
          </span>
          <span className="text-gray-400">Trend {product.trend_score ?? "N/A"}</span>
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 text-left text-sm font-semibold text-purple-600 hover:text-purple-800"
        >
          {expanded ? "Hide AI Analysis ▲" : "View AI Analysis ▼"}
        </button>

        {expanded && (
          <div className="mt-3 space-y-3 rounded-xl bg-gray-50 p-4 text-sm">
            <div>
              <p className="font-semibold text-gray-700">Why</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-gray-600">
                {product.analysis.why.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Risks</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-gray-600">
                {product.analysis.risks.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Recommendation</p>
              <p className="mt-1 text-gray-600">{product.analysis.recommendation}</p>
            </div>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <a
            href={product.product_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-xl bg-purple-600 py-2 text-center text-sm font-semibold text-white hover:bg-purple-700"
          >
            View Product
          </a>
          {product.supplier_url && product.supplier_url !== product.product_url && (
            <a
              href={product.supplier_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-xl bg-gray-100 py-2 text-center text-sm font-semibold text-gray-700 hover:bg-gray-200"
            >
              Supplier
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
