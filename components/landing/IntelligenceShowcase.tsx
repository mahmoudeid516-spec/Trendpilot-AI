import ScrollReveal from "./ScrollReveal";
import Pill from "../ui/Pill";
import ScoreRing from "../ui/ScoreRing";

const SIGNALS = [
  { label: "Demand", value: "High", tone: "positive" as const },
  { label: "Risk", value: "High", tone: "risk" as const },
  { label: "Winning Probability", value: "47%", tone: "warning" as const },
  { label: "ROI", value: "130%", tone: "positive" as const },
];

const TONE_TEXT = {
  positive: "text-[var(--accent-positive)]",
  warning: "text-[var(--accent-warning)]",
  risk: "text-[var(--accent-risk)]",
};

/**
 * Illustrative example of a real Report card in the dashboard -- same
 * decision thresholds as lib/scoring/opportunityScore.ts (74 -> "Test",
 * since >=60 and <75). Static marketing content, not a live query.
 */
export default function IntelligenceShowcase() {
  return (
    <section className="bg-[var(--surface-app)] py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <ScrollReveal>
            <div className="rounded-[28px] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-7 shadow-[0_30px_80px_-24px_rgba(15,18,34,0.18)]">
              <div className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-5">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--ink-400)]">Product</p>
                  <p className="mt-1 truncate text-base font-bold text-[var(--ink-900)]">EMART 10&quot; Ring Light</p>
                </div>
                <Pill tone="warning" className="shrink-0">
                  Test
                </Pill>
              </div>

              <div className="flex items-center gap-6 py-6">
                <ScoreRing value={74} tone="ai" label="Opportunity" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--ink-400)]">
                    Opportunity Score
                  </p>
                  <p className="mt-1 text-3xl font-extrabold tabular-nums text-[var(--ink-900)]">74</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-[var(--border-subtle)] pt-5">
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
          </ScrollReveal>

          <ScrollReveal delayMs={120}>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-[var(--ink-900)] sm:text-4xl">
                One view. The signals that matter.
              </h2>
              <p className="mt-5 text-base leading-7 text-[var(--ink-500)]">
                Every product TrendPilot evaluates gets the same consistent breakdown &mdash; opportunity score,
                demand, risk, winning probability, and ROI &mdash; so you can compare products on equal footing
                instead of scattered spreadsheets and gut feel.
              </p>
              <p className="mt-4 text-sm text-[var(--ink-400)]">
                Example output from TrendPilot&apos;s product intelligence engine.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
