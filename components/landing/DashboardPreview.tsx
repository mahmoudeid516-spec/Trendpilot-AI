import ScoreRing from "../ui/ScoreRing";
import Pill from "../ui/Pill";

const METRICS = [
  { label: "Demand", value: "High", tone: "positive" as const },
  { label: "Competition", value: "High", tone: "warning" as const },
  { label: "ROI", value: "130%", tone: "positive" as const },
];

/**
 * A static preview of the real Report card shown in the dashboard --
 * same tone system (Pill, ScoreRing, --accent-* tokens) and the same
 * decision thresholds as lib/scoring/opportunityScore.ts (82 -> "Buy",
 * since >=75 and <90). Illustrative numbers, not live data -- this
 * component never calls the search/scoring pipeline.
 */
export default function DashboardPreview() {
  return (
    <div className="rounded-[28px] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-[0_30px_80px_-20px_rgba(109,74,255,0.28)] sm:p-7">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-5">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--ink-400)]">Product</p>
          <p className="mt-1 truncate text-base font-bold text-[var(--ink-900)]">10&quot; Ring Light Kit</p>
        </div>
        <Pill tone="positive" className="shrink-0">
          Buy
        </Pill>
      </div>

      <div className="flex items-center gap-6 py-6">
        <ScoreRing value={82} tone="ai" label="Opportunity" />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--ink-400)]">
            Opportunity Score
          </p>
          <p className="mt-1 text-3xl font-extrabold tabular-nums text-[var(--ink-900)]">82</p>
          <p className="mt-1 text-xs text-[var(--ink-500)]">Weighted across demand, trend, ROI &amp; competition</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 border-t border-[var(--border-subtle)] pt-5">
        {METRICS.map((metric) => (
          <div key={metric.label} className="rounded-xl bg-[var(--surface-muted)] px-3 py-3 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--ink-400)]">{metric.label}</p>
            <p
              className={`mt-1 text-sm font-bold ${
                metric.tone === "positive" ? "text-[var(--accent-positive)]" : "text-[var(--accent-warning)]"
              }`}
            >
              {metric.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
