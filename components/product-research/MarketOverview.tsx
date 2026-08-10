import type { Level, MarketSummary } from "../../types/analysis";

type Props = {
  keyword: string;
  requestedCount: number;
  returnedCount: number;
  searchedAt: Date | null;
  summary: MarketSummary;
  aiAvailable: boolean;
};

function levelColor(level: Level, goodWhenHigh: boolean) {
  const isGood = goodWhenHigh ? level === "High" : level === "Low";
  const isBad = goodWhenHigh ? level === "Low" : level === "High";

  if (isGood) return "text-green-600";
  if (isBad) return "text-red-600";
  return "text-yellow-600";
}

function scoreColor(score: number) {
  if (score >= 75) return "text-green-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-600";
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
    <section className="rounded-3xl bg-white p-8 shadow-lg">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
            AI MARKET VERDICT
          </span>

          <h2 className="mt-3 text-3xl font-extrabold text-gray-900">{summary.verdict}</h2>

          <p className="mt-2 text-sm text-gray-500">
            &quot;{keyword}&quot;
            {searchedAt && <> &middot; {searchedAt.toLocaleTimeString()}</>}
          </p>

          <p className="mt-1 text-sm font-medium text-gray-700">
            Requested {requestedCount} &middot;{" "}
            <span className={returnedCount !== requestedCount ? "text-orange-600" : ""}>
              {returnedCount} real product{returnedCount === 1 ? "" : "s"} returned
            </span>
          </p>
        </div>

        <div className="text-right">
          <p className={`text-5xl font-extrabold ${scoreColor(summary.overall_score)}`}>
            {summary.overall_score}
            <span className="text-xl text-gray-400">/100</span>
          </p>
          <p className="text-xs uppercase tracking-wide text-gray-400">Overall Opportunity</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl bg-gray-50 p-4 text-center">
          <p className="text-xs uppercase tracking-wide text-gray-400">Demand</p>
          <p className={`mt-1 text-xl font-bold ${levelColor(summary.demand, true)}`}>{summary.demand}</p>
        </div>
        <div className="rounded-2xl bg-gray-50 p-4 text-center">
          <p className="text-xs uppercase tracking-wide text-gray-400">Competition</p>
          <p className={`mt-1 text-xl font-bold ${levelColor(summary.competition, false)}`}>{summary.competition}</p>
        </div>
        <div className="rounded-2xl bg-gray-50 p-4 text-center">
          <p className="text-xs uppercase tracking-wide text-gray-400">Profitability</p>
          <p className={`mt-1 text-xl font-bold ${levelColor(summary.profitability, true)}`}>{summary.profitability}</p>
        </div>
        <div className="rounded-2xl bg-gray-50 p-4 text-center">
          <p className="text-xs uppercase tracking-wide text-gray-400">Risk</p>
          <p className={`mt-1 text-xl font-bold ${levelColor(summary.risk, false)}`}>{summary.risk}</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-purple-500">
          AI Executive Summary {!aiAvailable && "(unavailable)"}
        </p>
        <p className="mt-2 leading-7 text-gray-700">{summary.explanation}</p>
      </div>
    </section>
  );
}
