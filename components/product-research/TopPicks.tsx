import type { TopPick } from "../../lib/scoring/topPicks";
import DecisionBadge from "./DecisionBadge";

export default function TopPicks({ picks }: { picks: TopPick[] }) {
  if (picks.length === 0) return null;

  return (
    <section className="rounded-3xl bg-white p-8 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-bold text-gray-900">Top AI Picks</h2>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          Deterministic &mdash; computed from real data, not AI-generated
        </span>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {picks.map((pick) => (
          <div
            key={pick.category}
            className="flex flex-col rounded-2xl border border-blue-100 bg-blue-50/40 p-5"
          >
            <span className="text-xs font-bold uppercase tracking-wide text-blue-700">
              {pick.category}
            </span>

            <h3 className="mt-2 line-clamp-2 text-lg font-bold text-gray-900">
              {pick.product.name}
            </h3>

            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <span className="rounded-lg bg-white px-2 py-1 font-semibold text-blue-700">
                Opportunity {pick.product.opportunity_score ?? "N/A"}
              </span>
              <span className="rounded-lg bg-white px-2 py-1 font-semibold text-gray-700">
                ${(pick.product.profit ?? 0).toFixed(2)} profit
              </span>
              <DecisionBadge decision={pick.product.decision} />
            </div>

            <p className="mt-3 flex-1 text-sm leading-6 text-gray-600">{pick.reason}</p>

            <a
              href={pick.product.product_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-xl bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
            >
              View Product
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
