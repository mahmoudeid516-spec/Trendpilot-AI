import type { MarketAnalysisText } from "../../types/analysis";

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
  { key: "final_recommendation", title: "Final Recommendation" },
];

export default function AIMarketReport({ marketAnalysis, aiAvailable }: Props) {
  return (
    <section className="rounded-3xl bg-white p-8 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Market Report</h2>
          <p className="mt-1 text-sm text-gray-500">
            AI-generated interpretation of the products below -- not a deterministic calculation.
          </p>
        </div>
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
          AI-GENERATED
        </span>
      </div>

      {!aiAvailable && (
        <div className="mt-5 rounded-xl bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-800">
          AI market analysis is temporarily unavailable. Product scoring, Top Picks, and
          per-product analysis below are still fully available (they don&apos;t depend on AI).
        </div>
      )}

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {SECTIONS.map(({ key, title }) => (
          <div key={key} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500">{title}</h3>
            <p className="mt-2 leading-6 text-gray-700">{marketAnalysis[key]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
