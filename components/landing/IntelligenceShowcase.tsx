import ScrollReveal from "./ScrollReveal";
import Pill from "../ui/Pill";
import ScoreRing from "../ui/ScoreRing";
import ProgressBar from "../ui/ProgressBar";

const SIGNALS = [
  { label: "Demand", value: "High", tone: "positive" as const },
  { label: "Risk", value: "High", tone: "risk" as const },
  { label: "Winning Probability", value: "47%", tone: "warning" as const },
  { label: "ROI", value: "130%", tone: "positive" as const },
];

const BREAKDOWN = [
  { label: "Demand", value: 78, tone: "positive" as const },
  { label: "Trend", value: 64, tone: "data" as const },
  { label: "Profitability", value: 82, tone: "positive" as const },
  { label: "AI score", value: 70, tone: "ai" as const },
  { label: "Competition", value: 30, tone: "warning" as const },
];

const TONE_TEXT = {
  positive: "text-[var(--accent-positive)]",
  warning: "text-[var(--accent-warning)]",
  risk: "text-[var(--accent-risk)]",
};

/**
 * Illustrative example of a real Report card in the dashboard -- same
 * decision thresholds as lib/scoring/opportunityScore.ts (74 -> "Test",
 * since >=60 and <75), and the same weighted-signal breakdown the
 * scoring engine actually uses (demand/trend/profitability/AI/
 * competition). Static marketing content, not a live query.
 */
export default function IntelligenceShowcase() {
  return (
    <section className="relative overflow-hidden bg-[var(--surface-app)] py-24">
      <div
        className="tp-dot-grid pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-ai)]">
              Product intelligence
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--ink-900)] sm:text-4xl">
              One view. The signals that matter.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[var(--ink-500)]">
              Every product TrendPilot evaluates gets the same consistent breakdown so you can compare products on
              equal footing instead of scattered spreadsheets and gut feel.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delayMs={120}>
          <div className="tp-card-elevated mx-auto mt-14 max-w-4xl overflow-hidden">
            <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="border-b border-[var(--border-subtle)] p-7 sm:p-9 lg:border-b-0 lg:border-r">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--ink-400)]">Product</p>
                    <p className="mt-1 truncate text-lg font-bold text-[var(--ink-900)]">EMART 10&quot; Ring Light</p>
                  </div>
                  <Pill tone="warning" className="shrink-0">
                    Test
                  </Pill>
                </div>

                <div className="mt-7 flex items-center gap-6">
                  <ScoreRing value={74} tone="ai" label="Opportunity" size={104} />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--ink-400)]">
                      Opportunity Score
                    </p>
                    <p className="mt-1 text-4xl font-extrabold tabular-nums text-[var(--ink-900)]">74</p>
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3">
                  {SIGNALS.map((signal) => (
                    <div key={signal.label} className="rounded-xl bg-[var(--surface-muted)] px-3 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--ink-400)]">
                        {signal.label}
                      </p>
                      <p className={`mt-1 text-sm font-bold ${TONE_TEXT[signal.tone]}`}>{signal.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--surface-muted)]/50 p-7 sm:p-9">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--ink-400)]">
                  Score breakdown
                </p>
                <div className="mt-4 space-y-4">
                  {BREAKDOWN.map((row) => (
                    <div key={row.label}>
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="font-semibold text-[var(--ink-700)]">{row.label}</span>
                        <span className="font-bold tabular-nums text-[var(--ink-900)]">{row.value}</span>
                      </div>
                      <ProgressBar value={row.value} tone={row.tone} />
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-xs leading-5 text-[var(--ink-400)]">
                  Example output from TrendPilot&apos;s product intelligence engine.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
