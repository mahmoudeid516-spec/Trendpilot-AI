import type { Level, MarketSummary } from "../../types/analysis";
import Card from "../ui/Card";
import Pill from "../ui/Pill";
import ScoreRing from "../ui/ScoreRing";
import { toneText, type Tone } from "../ui/tone";

type Props = {
  keyword: string;
  requestedCount: number;
  returnedCount: number;
  searchedAt: Date | null;
  summary: MarketSummary;
  aiAvailable: boolean;
};

function levelTone(level: Level, goodWhenHigh: boolean): Tone {
  const isGood = goodWhenHigh ? level === "High" : level === "Low";
  const isBad = goodWhenHigh ? level === "Low" : level === "High";

  if (isGood) return "positive";
  if (isBad) return "risk";
  return "warning";
}

function scoreTone(score: number): Tone {
  if (score >= 75) return "positive";
  if (score >= 50) return "warning";
  return "risk";
}

export default function MarketOverview({
  keyword,
  requestedCount,
  returnedCount,
  searchedAt,
  summary,
  aiAvailable,
}: Props) {
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="min-w-0">
          <Pill tone="ai">AI Market Verdict</Pill>

          <h2 className="mt-3 break-words text-2xl font-extrabold text-[var(--ink-900)] sm:text-3xl">
            {summary.verdict}
          </h2>

          <p className="mt-2 text-sm text-[var(--ink-500)]">
            &quot;{keyword}&quot;
            {searchedAt && <> &middot; {searchedAt.toLocaleTimeString()}</>}
          </p>

          <p className="mt-1 text-sm font-medium text-[var(--ink-700)]">
            Requested {requestedCount} &middot;{" "}
            <span className={returnedCount !== requestedCount ? "text-[var(--accent-warning)]" : ""}>
              {returnedCount} real product{returnedCount === 1 ? "" : "s"} returned
            </span>
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-center">
          <ScoreRing value={summary.overall_score} tone={scoreTone(summary.overall_score)} label="/ 100" />
          <p className="mt-2 text-xs uppercase tracking-wide text-[var(--ink-400)]">Overall Opportunity</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-4">
        <div className="rounded-xl bg-[var(--surface-muted)] p-4 text-center">
          <p className="text-xs uppercase tracking-wide text-[var(--ink-400)]">Demand</p>
          <p className={`mt-1 text-lg font-bold ${toneText[levelTone(summary.demand, true)]}`}>{summary.demand}</p>
        </div>
        <div className="rounded-xl bg-[var(--surface-muted)] p-4 text-center">
          <p className="text-xs uppercase tracking-wide text-[var(--ink-400)]">Competition</p>
          <p className={`mt-1 text-lg font-bold ${toneText[levelTone(summary.competition, false)]}`}>{summary.competition}</p>
        </div>
        <div className="rounded-xl bg-[var(--surface-muted)] p-4 text-center">
          <p className="text-xs uppercase tracking-wide text-[var(--ink-400)]">Profitability</p>
          <p className={`mt-1 text-lg font-bold ${toneText[levelTone(summary.profitability, true)]}`}>{summary.profitability}</p>
        </div>
        <div className="rounded-xl bg-[var(--surface-muted)] p-4 text-center">
          <p className="text-xs uppercase tracking-wide text-[var(--ink-400)]">Risk</p>
          <p className={`mt-1 text-lg font-bold ${toneText[levelTone(summary.risk, false)]}`}>{summary.risk}</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-[var(--accent-ai)]/15 bg-[var(--accent-ai-soft)] p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent-ai)]">
          AI Executive Summary {!aiAvailable && "(unavailable)"}
        </p>
        <p className="mt-2 leading-7 text-[var(--ink-700)]">{summary.explanation}</p>
      </div>
    </Card>
  );
}
