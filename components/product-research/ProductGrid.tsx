"use client";

import { useMemo, useState } from "react";
import type { ProductWithAnalysis } from "../../types/analysis";
import ProductCard from "./ProductCard";

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

export default function ProductGrid({ products }: { products: ProductWithAnalysis[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("opportunity_score");
  const [decisionFilter, setDecisionFilter] = useState("All");
  const [competitionFilter, setCompetitionFilter] = useState("All");

  const filteredAndSorted = useMemo(() => {
    const filtered = products.filter((p) => {
      const matchesDecision = decisionFilter === "All" || p.decision === decisionFilter;
      const matchesCompetition = competitionFilter === "All" || p.competition === competitionFilter;
      return matchesDecision && matchesCompetition;
    });

    const sorted = [...filtered].sort((a, b) => {
      const av = Number(a[sortKey] ?? 0);
      const bv = Number(b[sortKey] ?? 0);
      return sortKey === "risk_score" ? av - bv : bv - av;
    });

    return sorted;
  }, [products, sortKey, decisionFilter, competitionFilter]);

  return (
    <section className="rounded-3xl bg-white p-8 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Products ({filteredAndSorted.length} of {products.length})
        </h2>

        <div className="flex flex-wrap gap-3">
          <select
            value={decisionFilter}
            onChange={(e) => setDecisionFilter(e.target.value)}
            className="rounded-xl border px-3 py-2 text-sm"
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
            className="rounded-xl border px-3 py-2 text-sm"
          >
            {COMPETITION_LEVELS.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Competition" : c}
              </option>
            ))}
          </select>

          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="rounded-xl border px-3 py-2 text-sm"
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
        <div className="mt-10 py-12 text-center text-gray-500">
          No products match the current filters.
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSorted.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
