"use client";

import { useMemo, useState } from "react";
import type { ProductWithAnalysis } from "../../types/analysis";
import ProductCard from "./ProductCard";
import Card from "../ui/Card";

type SortKey = "opportunity_score" | "profit" | "demand_score" | "winning_probability" | "risk_score" | "sales";

const SORT_OPTIONS: Array<{ key: SortKey; label: string }> = [
  { key: "opportunity_score", label: "Opportunity Score" },
  { key: "profit", label: "Profit" },
  { key: "demand_score", label: "Demand" },
  { key: "winning_probability", label: "Winning Probability" },
  { key: "risk_score", label: "Risk (lowest first)" },
  { key: "sales", label: "Sales / Orders" },
];

const DECISIONS = ["All", "Strong Buy", "Buy", "Test", "Watch", "Avoid"];
const COMPETITION_LEVELS = ["All", "Low", "Medium", "High"];

type Props = {
  products: ProductWithAnalysis[];
  onSelectProduct?: (product: ProductWithAnalysis) => void;
};

const selectClass =
  "rounded-lg border border-[var(--border-subtle)] bg-white px-3 py-2 text-sm text-[var(--ink-700)] outline-none tp-focus-ring";

export default function ProductGrid({ products, onSelectProduct }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("opportunity_score");
  const [decisionFilter, setDecisionFilter] = useState("All");
  const [competitionFilter, setCompetitionFilter] = useState("All");
  const [maxPrice, setMaxPrice] = useState("");

  const filteredAndSorted = useMemo(() => {
    const priceCeiling = maxPrice.trim() === "" ? null : Number(maxPrice);
    const hasValidPriceCeiling = priceCeiling !== null && Number.isFinite(priceCeiling);

    const filtered = products.filter((p) => {
      const matchesDecision = decisionFilter === "All" || p.decision === decisionFilter;
      const matchesCompetition = competitionFilter === "All" || p.competition === competitionFilter;
      const matchesPrice = !hasValidPriceCeiling || p.buy_price <= priceCeiling;
      return matchesDecision && matchesCompetition && matchesPrice;
    });

    const sorted = [...filtered].sort((a, b) => {
      const av = Number(a[sortKey] ?? 0);
      const bv = Number(b[sortKey] ?? 0);
      return sortKey === "risk_score" ? av - bv : bv - av;
    });

    return sorted;
  }, [products, sortKey, decisionFilter, competitionFilter, maxPrice]);

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-[var(--ink-900)]">
          Products ({filteredAndSorted.length} of {products.length})
        </h2>

        <div className="flex flex-wrap gap-2">
          <select
            value={decisionFilter}
            onChange={(e) => setDecisionFilter(e.target.value)}
            className={selectClass}
          >
            {DECISIONS.map((d) => (
              <option key={d} value={d}>
                {d === "All" ? "All Decisions" : d}
              </option>
            ))}
          </select>

          <select
            value={competitionFilter}
            onChange={(e) => setCompetitionFilter(e.target.value)}
            className={selectClass}
          >
            {COMPETITION_LEVELS.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Competition" : c}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-white px-3 py-2 text-sm text-[var(--ink-700)]">
            Max buy price
            <input
              type="number"
              min={0}
              inputMode="decimal"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Any"
              className="w-16 outline-none placeholder:text-[var(--ink-400)]"
            />
          </label>

          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className={selectClass}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.key} value={option.key}>
                Sort: {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredAndSorted.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-[var(--border-subtle)] py-12 text-center">
          <p className="text-2xl">🗂️</p>
          <p className="mt-2 font-semibold text-[var(--ink-900)]">No products match the current filters</p>
          <p className="mt-1 text-sm text-[var(--ink-500)]">Try a broader decision or competition filter.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSorted.map((product) => (
            <ProductCard key={product.id} product={product} onSelectProduct={onSelectProduct} />
          ))}
        </div>
      )}
    </Card>
  );
}
