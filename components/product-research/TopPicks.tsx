import type { TopPick } from "../../lib/scoring/topPicks";
import DecisionBadge from "./DecisionBadge";
import Card from "../ui/Card";
import Pill from "../ui/Pill";
import { buttonClass } from "../ui/button";

export default function TopPicks({ picks }: { picks: TopPick[] }) {
  if (picks.length === 0) return null;

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-bold text-[var(--ink-900)]">Top AI Picks</h2>
        <Pill tone="data">Deterministic &mdash; computed from real data</Pill>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {picks.map((pick) => (
          <div
            key={pick.category}
            className="flex flex-col rounded-xl border border-[var(--border-subtle)] p-5"
          >
            <span className="text-xs font-bold uppercase tracking-wide text-[var(--accent-data)]">
              {pick.category}
            </span>

            <h3 className="mt-2 line-clamp-2 text-base font-bold text-[var(--ink-900)]">
              {pick.product.name}
            </h3>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-lg bg-[var(--accent-data-soft)] px-2 py-1 font-semibold text-[var(--accent-data)]">
                Opportunity {pick.product.opportunity_score ?? "N/A"}
              </span>
              <span className="rounded-lg bg-[var(--surface-muted)] px-2 py-1 font-semibold text-[var(--ink-700)]">
                ${(pick.product.profit ?? 0).toFixed(2)} profit
              </span>
              <DecisionBadge decision={pick.product.decision} />
            </div>

            <p className="mt-3 flex-1 text-sm leading-6 text-[var(--ink-500)]">{pick.reason}</p>

            <a
              href={pick.product.product_url}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass({ tone: "data", className: "mt-4 w-full" })}
            >
              View Product
            </a>
          </div>
        ))}
      </div>
    </Card>
  );
}
