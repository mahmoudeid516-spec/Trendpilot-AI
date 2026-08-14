import type { ProductWithAnalysis } from "../../types/analysis";
import Card from "../ui/Card";
import Pill from "../ui/Pill";

type Props = {
  products: ProductWithAnalysis[];
};

// Every number here is computed directly from the products TrendPilot's own
// deterministic scoring already assigned (lib/scoring/opportunityScore.ts) --
// nothing new is calculated, and the thresholds match the ones already
// driving DecisionBadge/ScoreBadge on each card, so these counts agree with
// what a user sees when they scan the cards themselves.
export default function ResultsSummaryStrip({ products }: Props) {
  const productsFound = products.length;
  const strongOpportunities = products.filter((p) => p.decision === "Strong Buy").length;
  const highDemand = products.filter((p) => (p.demand_score ?? 0) >= 75).length;
  const highRisk = products.filter((p) => (p.risk_score ?? 0) > 65).length;

  const opportunityScores = products
    .map((p) => p.opportunity_score)
    .filter((score): score is number => typeof score === "number");
  const avgOpportunityScore =
    opportunityScores.length > 0
      ? Math.round(opportunityScores.reduce((sum, v) => sum + v, 0) / opportunityScores.length)
      : null;

  const tiles: Array<{ label: string; value: string }> = [
    { label: "Products Found", value: String(productsFound) },
    { label: "Strong Opportunities", value: String(strongOpportunities) },
    { label: "Avg. Opportunity Score", value: avgOpportunityScore === null ? "N/A" : String(avgOpportunityScore) },
    { label: "High Demand Products", value: String(highDemand) },
    { label: "High Risk Products", value: String(highRisk) },
  ];

  return (
    <Card padding="sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--ink-400)]">Results Summary</h3>
        <Pill tone="data">Deterministic &mdash; computed from returned products</Pill>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {tiles.map((tile) => (
          <div key={tile.label} className="rounded-xl bg-[var(--surface-muted)] p-3 text-center">
            <p className="text-2xl font-extrabold tabular-nums text-[var(--ink-900)]">{tile.value}</p>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-[var(--ink-400)]">{tile.label}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
