import type { MarketAnalysisText } from "../../types/analysis";
import Card from "../ui/Card";
import Pill from "../ui/Pill";

type Props = {
  marketAnalysis: MarketAnalysisText;
  aiAvailable: boolean;
};

const SECTIONS: Array<{ key: keyof MarketAnalysisText; title: string }> = [
  { key: "overview", title: "Market Opportunity" },
  { key: "demand_analysis", title: "Demand Analysis" },
  { key: "competition_analysis", title: "Competition Analysis" },
  { key: "trend_analysis", title: "Trend Analysis" },
  { key: "profitability_analysis", title: "Profitability Analysis" },
  { key: "positioning", title: "Customer / Product Positioning" },
  { key: "risk_analysis", title: "Main Risks" },
  { key: "opportunity_analysis", title: "Opportunity Analysis" },
  { key: "strategy", title: "Recommended Strategy" },
  { key: "recommended_product_profile", title: "Recommended Product Profile" },
];

export default function AIMarketReport({ marketAnalysis, aiAvailable }: Props) {
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[var(--ink-900)]">AI Market Report</h2>
          <p className="mt-1 text-sm text-[var(--ink-500)]">
            AI-generated interpretation of the products below &mdash; not a deterministic calculation.
          </p>
        </div>
        <Pill tone="ai">AI-Generated</Pill>
      </div>

      {!aiAvailable && (
        <div className="mt-5 rounded-xl border border-[var(--accent-warning)]/25 bg-[var(--accent-warning-soft)] p-4 text-sm text-[var(--accent-warning)]">
          AI market analysis is temporarily unavailable. Product scoring, Top Picks, and
          per-product analysis below are still fully available (they don&apos;t depend on AI).
        </div>
      )}

      {/* Final recommendation is the one section a user should always read
          first, so it's promoted above the rest instead of competing for
          attention as an identical gray tile. */}
      <div className="mt-6 rounded-xl border border-[var(--accent-ai)]/20 bg-[var(--accent-ai-soft)] p-5">
        <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--accent-ai)]">Final Recommendation</h3>
        <p className="mt-2 leading-6 text-[var(--ink-900)]">{marketAnalysis.final_recommendation}</p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {SECTIONS.map(({ key, title }) => (
          <div key={key} className="rounded-xl border border-[var(--border-subtle)] p-5">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--ink-400)]">{title}</h3>
            <p className="mt-2 leading-6 text-[var(--ink-700)]">{marketAnalysis[key]}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
