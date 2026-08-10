import type { Product } from "../../types/Product";
import { generateAdvice } from "../../services/advisor";
import Card from "../ui/Card";
import Pill from "../ui/Pill";
import MetricTile from "../ui/MetricTile";
import { toneForScore } from "../ui/tone";

type Props = {
  product: Product;
};

export default function AIRecommendation({ product }: Props) {
  const advice = generateAdvice(product);

  const confidenceLabel =
    product.ai_score >= 95
      ? "Extremely High Confidence"
      : product.ai_score >= 85
      ? "High Confidence"
      : product.ai_score >= 70
      ? "Medium Confidence"
      : "Low Confidence";

  return (
    <Card padding="none" className="overflow-hidden border-[var(--accent-ai)]/20">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border-subtle)] bg-[var(--accent-ai-soft)] p-6">
        <div className="min-w-0">
          <Pill tone="ai">🏆 AI Top Pick</Pill>
          <h3 className="mt-3 break-words text-xl font-bold text-[var(--ink-900)] sm:text-2xl">{product.name}</h3>
          <p className="mt-1 text-sm text-[var(--ink-500)]">{confidenceLabel}</p>
        </div>

        <MetricTile
          label="Winning Probability"
          value={`${product.winning_probability ?? "N/A"}%`}
          tone={toneForScore(product.winning_probability)}
          size="lg"
        />
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <MetricTile
            label="Opportunity"
            value={`${(product.opportunity_score ?? 0).toFixed(0)}%`}
            tone={toneForScore(product.opportunity_score)}
            size="sm"
          />
          <MetricTile label="AI Score" value={`${product.ai_score}%`} tone={toneForScore(product.ai_score)} size="sm" />
          <MetricTile label="Profit" value={`$${product.profit}`} tone="positive" size="sm" />
          <MetricTile label="Competition" value={product.competition} tone="neutral" size="sm" />
          <MetricTile label="Trend" value={product.trend_score} tone="data" size="sm" />
        </div>

        <div className="mt-6 rounded-2xl bg-[var(--surface-muted)] p-5">
          <h4 className="text-sm font-bold text-[var(--ink-900)]">Why TrendPilot recommends this product</h4>
          <p className="mt-2 text-sm leading-6 text-[var(--ink-500)]">
            This recommendation is based on demand, competition, profit margin, market trend, and AI opportunity
            analysis.
          </p>

          <ul className="mt-4 space-y-2">
            {advice.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-[var(--ink-700)]">
                <span className="mt-0.5 text-[var(--accent-positive)]">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
