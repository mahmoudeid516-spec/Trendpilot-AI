import type { Product } from "../../types/Product";

export type TopPickCategory =
  | "Best Overall"
  | "Best Low-Risk Opportunity"
  | "Best Profit Opportunity"
  | "Best Demand Opportunity"
  | "Best Low-Competition Opportunity";

export type TopPick = {
  category: TopPickCategory;
  product: Product;
  reason: string;
};

function byDesc(getValue: (p: Product) => number) {
  return (a: Product, b: Product) => getValue(b) - getValue(a);
}

/**
 * Picks up to 5 highlighted products from an already-scored list. Each
 * pick is chosen by sorting on one real field -- no separate AI call, no
 * invented reasoning. A product already used for one category is excluded
 * from later categories so the 5 picks aren't all the same item.
 */
export function selectTopPicks(products: Product[]): TopPick[] {
  if (products.length === 0) return [];

  const picks: TopPick[] = [];
  const used = new Set<string>();

  function pick(
    category: TopPickCategory,
    candidates: Product[],
    reason: (p: Product) => string
  ) {
    const available = candidates.filter((p) => !used.has(p.id));
    if (available.length === 0) return;
    const product = available[0];
    used.add(product.id);
    picks.push({ category, product, reason: reason(product) });
  }

  pick(
    "Best Overall",
    [...products].sort(byDesc((p) => p.opportunity_score ?? 0)),
    (p) =>
      `Highest overall opportunity score (${p.opportunity_score ?? 0}), combining demand, trend, profitability and competition.`
  );

  pick(
    "Best Low-Risk Opportunity",
    [...products].sort((a, b) => (a.risk_score ?? 100) - (b.risk_score ?? 100)),
    (p) => `Lowest risk score (${p.risk_score ?? "N/A"}) among returned results.`
  );

  pick(
    "Best Profit Opportunity",
    [...products].sort(byDesc((p) => p.profit ?? 0)),
    (p) => `Highest estimated profit per unit ($${(p.profit ?? 0).toFixed(2)}).`
  );

  pick(
    "Best Demand Opportunity",
    [...products].sort(byDesc((p) => p.demand_score ?? 0)),
    (p) => `Highest demand score (${p.demand_score ?? 0}), based on sales/review signals.`
  );

  pick(
    "Best Low-Competition Opportunity",
    [...products]
      .filter((p) => p.competition === "Low")
      .sort(byDesc((p) => p.opportunity_score ?? 0)),
    (p) =>
      `Low competition with the best opportunity score (${p.opportunity_score ?? 0}) in that group.`
  );

  return picks;
}
