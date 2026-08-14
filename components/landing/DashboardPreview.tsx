import { TrendingUp } from "lucide-react";
import ScoreRing from "../ui/ScoreRing";
import Pill from "../ui/Pill";

const METRICS = [
  { label: "Demand", value: "High", tone: "positive" as const },
  { label: "Competition", value: "High", tone: "warning" as const },
  { label: "ROI", value: "130%", tone: "positive" as const },
];

const TONE_TEXT = {
  positive: "text-[var(--accent-positive)]",
  warning: "text-[var(--accent-warning)]",
};

// Illustrative demand-trend points for the sparkline -- purely a visual
// device to show what a trend signal looks like in the product, not a
// claim about this specific SKU's real trend history.
const TREND_POINTS = [22, 28, 26, 34, 40, 38, 48, 54, 58, 68, 64, 74];

function Sparkline() {
  const width = 220;
  const height = 44;
  const max = Math.max(...TREND_POINTS);
  const min = Math.min(...TREND_POINTS);
  const range = max - min || 1;

  const coords = TREND_POINTS.map((point, i) => {
    const x = (i / (TREND_POINTS.length - 1)) * width;
    const y = height - ((point - min) / range) * height;
    return `${x},${y}`;
  });

  const areaPath = `M0,${height} L${coords.join(" L")} L${width},${height} Z`;
  const linePath = `M${coords.join(" L")}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-11 w-full" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="tp-sparkline-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-ai)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--accent-ai)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#tp-sparkline-fill)" />
      <path d={linePath} fill="none" stroke="var(--accent-ai)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * A static preview of the real Report card shown in the dashboard --
 * same tone system (Pill, ScoreRing, --accent-* tokens) and the same
 * decision thresholds as lib/scoring/opportunityScore.ts (82 -> "Buy",
 * since >=75 and <90). Illustrative numbers, not live data -- this
 * component never calls the search/scoring pipeline.
 */
export default function DashboardPreview() {
  return (
    <div className="relative">
      <div
        className="absolute -right-4 -top-4 hidden w-44 rotate-3 items-center gap-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] px-4 py-3 shadow-[0_20px_40px_-16px_rgba(15,18,34,0.35)] sm:flex"
        aria-hidden="true"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent-positive-soft)] text-[var(--accent-positive)]">
          <TrendingUp size={16} strokeWidth={2.5} />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--ink-400)]">Trend</p>
          <p className="truncate text-xs font-bold text-[var(--ink-900)]">Rising demand</p>
        </div>
      </div>

      <div
        className="absolute -inset-3 -z-10 rounded-[32px] border border-[var(--border-subtle)] bg-[var(--surface-card)]/60"
        aria-hidden="true"
      />

      <div className="rounded-[28px] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-[0_40px_90px_-24px_rgba(109,74,255,0.32)] sm:p-7">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-5">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[var(--accent-positive)]">
              <span className="tp-pulse-dot h-1.5 w-1.5 rounded-full bg-current" />
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--ink-400)]">
                Live product analysis
              </p>
            </div>
            <p className="mt-1.5 truncate text-base font-bold text-[var(--ink-900)]">10&quot; Ring Light Kit</p>
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

        <div className="border-t border-[var(--border-subtle)] pt-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--ink-400)]">Demand trend</p>
            <p className="text-[10px] font-semibold text-[var(--accent-positive)]">+42% / 90d</p>
          </div>
          <div className="mt-2">
            <Sparkline />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 border-t border-[var(--border-subtle)] pt-5">
          {METRICS.map((metric) => (
            <div key={metric.label} className="rounded-xl bg-[var(--surface-muted)] px-3 py-3 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--ink-400)]">{metric.label}</p>
              <p className={`mt-1 text-sm font-bold ${TONE_TEXT[metric.tone]}`}>{metric.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
