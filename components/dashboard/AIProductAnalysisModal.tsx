"use client";
import { X } from "lucide-react";
import type { ProductDeepAnalysis, FinalRecommendationVerdict } from "../../types/productAnalyzer";
import DataTierBadge from "../ui/DataTierBadge";
import Pill from "../ui/Pill";
import ScoreRing from "../ui/ScoreRing";
import { toneForScore, type Tone } from "../ui/tone";

type Props = {
  productName: string;
  analysis: ProductDeepAnalysis;
  onClose: () => void;
};

const VERDICT_TONE: Record<ProductDeepAnalysis["verdict"], Tone> = {
  "Strong Opportunity": "positive",
  Promising: "data",
  Risky: "warning",
  "Weak Opportunity": "risk",
};

const FINAL_TONE: Record<FinalRecommendationVerdict, Tone> = {
  "Worth testing": "positive",
  "Test cautiously": "warning",
  "Avoid for now": "risk",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] p-5">
      <h4 className="mb-2 text-sm font-bold uppercase tracking-wide text-[var(--ink-400)]">{title}</h4>
      {children}
    </div>
  );
}

function BulletList({ items, tone }: { items: string[]; tone: Tone }) {
  return (
    <ul className="space-y-1.5 text-sm text-[var(--ink-700)]">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${tone === "positive" ? "bg-[var(--accent-positive)]" : "bg-[var(--accent-risk)]"}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function AIProductAnalysisModal({ productName, analysis, onClose }: Props) {
  const verdictTone = VERDICT_TONE[analysis.verdict] ?? "neutral";
  const finalTone = FINAL_TONE[analysis.final_recommendation.verdict] ?? "neutral";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 sm:p-6">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-[var(--surface-card)] shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Close AI product analysis"
          className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[var(--ink-700)] shadow-md hover:bg-white"
        >
          <X size={18} />
        </button>

        <div className="space-y-6 p-6 sm:p-8">
          {/* Header: score first, verdict second -- the progressive hierarchy the feature is built around. */}
          <div className="flex flex-wrap items-start justify-between gap-6 border-b border-[var(--border-subtle)] pb-6">
            <div className="min-w-0 pr-8">
              <div className="mb-2 flex items-center gap-2">
                <h2 className="text-lg font-bold text-[var(--ink-900)]">🧠 AI Product Analysis</h2>
                <DataTierBadge tier="ai" />
              </div>
              <p className="text-sm text-[var(--ink-500)]">{productName}</p>
              <Pill tone={verdictTone} className="mt-3">{analysis.verdict}</Pill>
            </div>

            <ScoreRing
              value={analysis.opportunity_score}
              tone={toneForScore(analysis.opportunity_score)}
              label="Opportunity"
              size={104}
            />
          </div>

          <p className="text-sm leading-6 text-[var(--ink-700)]">{analysis.opportunity_score_explanation}</p>

          {/* Key reasons/risks -- next in the hierarchy. */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Section title="✅ Why This Could Work">
              <BulletList items={analysis.why_it_could_work} tone="positive" />
            </Section>
            <Section title="⚠️ Main Risks">
              <BulletList items={analysis.main_risks} tone="risk" />
            </Section>
          </div>

          {/* Deeper analysis below. */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Section title="🎯 Target Customer">
              <p className="text-sm leading-6 text-[var(--ink-700)]">{analysis.target_customer}</p>
            </Section>
            <Section title="🏁 Competitive Position">
              <p className="text-sm leading-6 text-[var(--ink-700)]">{analysis.competitive_position}</p>
            </Section>
            <Section title="💵 Pricing Insight">
              <p className="text-sm leading-6 text-[var(--ink-700)]">{analysis.pricing_insight}</p>
            </Section>
            <Section title="📈 Demand Signals">
              <p className="text-sm leading-6 text-[var(--ink-700)]">{analysis.demand_signals}</p>
            </Section>
          </div>

          <Section title="🛠️ Differentiation Ideas">
            <BulletList items={analysis.differentiation_ideas} tone="positive" />
          </Section>

          <Section title="📣 Go-To-Market Suggestions">
            <p className="mb-2 text-xs text-[var(--ink-400)]">
              Recommendations based on this product and target customer -- not factual market data.
            </p>
            <BulletList items={analysis.go_to_market_suggestions} tone="positive" />
          </Section>

          {/* Final recommendation -- the closing summary. */}
          <div className={`rounded-xl border p-5 ${finalTone === "positive" ? "border-[var(--accent-positive)]/20 bg-[var(--accent-positive-soft)]" : finalTone === "warning" ? "border-[var(--accent-warning)]/25 bg-[var(--accent-warning-soft)]" : "border-[var(--accent-risk)]/25 bg-[var(--accent-risk-soft)]"}`}>
            <h4 className="mb-1 text-sm font-bold uppercase tracking-wide text-[var(--ink-400)]">Final Recommendation</h4>
            <p className="text-lg font-extrabold text-[var(--ink-900)]">{analysis.final_recommendation.verdict}</p>
            <p className="mt-1 text-sm text-[var(--ink-700)]">{analysis.final_recommendation.reason}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
