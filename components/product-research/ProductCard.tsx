"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { ProductWithAnalysis } from "../../types/analysis";
import ScoreBadge from "./ScoreBadge";
import DecisionBadge from "./DecisionBadge";
import { buttonClass } from "../ui/button";
import { toneForScore, toneText } from "../ui/tone";

const COMPETITION_STYLES: Record<string, string> = {
  Low: "bg-[var(--accent-positive-soft)] text-[var(--accent-positive)]",
  Medium: "bg-[var(--accent-warning-soft)] text-[var(--accent-warning)]",
  High: "bg-[var(--accent-risk-soft)] text-[var(--accent-risk)]",
};

type Props = {
  product: ProductWithAnalysis;
  onSelectProduct?: (product: ProductWithAnalysis) => void;
};

export default function ProductCard({ product, onSelectProduct }: Props) {
  const [expanded, setExpanded] = useState(false);
  const rating = Number(product.store_rating ?? product.supplier_rating ?? 0);
  const orders = Number(product.orders ?? product.sales ?? 0);
  const opportunityTone = toneForScore(product.opportunity_score);

  return (
    <div className="tp-card tp-card-interactive flex flex-col overflow-hidden">
      <div className="relative h-44 w-full shrink-0">
        <Image
          src={product.image || "https://placehold.co/400x300?text=No+Image"}
          alt={product.name}
          fill
          unoptimized
          className="object-cover"
        />
        <div className="absolute left-3 top-3">
          <DecisionBadge decision={product.decision} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-400)]">
          {product.platform}
        </p>
        <h3 className="mt-1 line-clamp-2 font-bold text-[var(--ink-900)]">{product.name}</h3>

        <p className="mt-2 text-sm text-[var(--ink-500)]">
          {rating > 0 ? `⭐ ${rating.toFixed(1)}` : "No rating"} &middot; {orders.toLocaleString()} orders
          {product.reviews ? ` · ${product.reviews.toLocaleString()} reviews` : ""}
        </p>

        {/* Opportunity is the single number this card leads with; price and
            the rest of the metrics are secondary supporting evidence. */}
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-[var(--surface-muted)] p-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--ink-400)]">Opportunity Score</p>
            <p className={`text-3xl font-extrabold tabular-nums ${toneText[opportunityTone]}`}>
              {product.opportunity_score ?? "N/A"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-extrabold text-[var(--ink-900)]">${product.buy_price.toFixed(2)}</p>
            <p className="text-xs text-[var(--ink-400)] line-through">${product.selling_price.toFixed(2)}</p>
          </div>
        </div>

        <p className="mt-2 text-sm text-[var(--ink-500)]">
          Est. profit <span className="font-semibold text-[var(--accent-positive)]">${(product.profit ?? 0).toFixed(2)}</span>
          {typeof product.roi === "number" && <> &middot; ROI {product.roi}%</>}
        </p>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <ScoreBadge label="Win Prob." value={product.winning_probability} suffix="%" />
          <ScoreBadge label="Demand" value={product.demand_score} />
          <ScoreBadge label="Risk" value={product.risk_score} direction="lower-is-better" />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <span
            className={`rounded-full px-3 py-1 font-semibold ${COMPETITION_STYLES[product.competition] ?? "bg-[var(--surface-muted)] text-[var(--ink-400)]"}`}
          >
            Competition: {product.competition}
          </span>
          <span className="text-[var(--ink-400)]">Trend {product.trend_score ?? "N/A"}</span>
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 flex items-center gap-1 text-left text-sm font-semibold text-[var(--accent-data)] hover:text-[#1d4fd1]"
        >
          {expanded ? "Hide Quick Analysis" : "View Quick Analysis"}
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {expanded && (
          <div className="mt-3 space-y-3 rounded-xl bg-[var(--surface-muted)] p-4 text-sm">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--ink-400)]">
              Computed from this product&apos;s real data &mdash; not an AI call. Open the full Report for AI Product Analysis.
            </p>
            <div>
              <p className="font-semibold text-[var(--ink-900)]">Why</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-[var(--ink-500)]">
                {product.analysis.why.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-[var(--ink-900)]">Risks</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-[var(--ink-500)]">
                {product.analysis.risks.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-[var(--ink-900)]">Recommendation</p>
              <p className="mt-1 text-[var(--ink-500)]">{product.analysis.recommendation}</p>
            </div>
          </div>
        )}

        {/* Same View / Supplier / Report action set kept intact from the
            previous saved-products convention; Report is now the primary
            (solid) action since it's the deepest, most valuable one -- the
            other two link out and lose the user their place in the report. */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <a
            href={product.product_url}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass({ tone: "data", variant: "outline", size: "sm" })}
          >
            View
          </a>
          <a
            href={product.supplier_url || product.product_url}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass({ tone: "positive", variant: "outline", size: "sm" })}
          >
            Supplier
          </a>
          <button
            onClick={() => onSelectProduct?.(product)}
            className={buttonClass({ tone: "ai", size: "sm" })}
          >
            Report
          </button>
        </div>
      </div>
    </div>
  );
}
