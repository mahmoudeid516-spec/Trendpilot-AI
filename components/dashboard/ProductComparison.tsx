"use client";

import type { Product } from "../../types/Product";
import Card from "../ui/Card";

type Props = {
  products: Product[];
};

export default function ProductComparison({ products }: Props) {
  if (products.length < 2) return null;

  const top = products.slice(0, 3);

  return (
    <Card className="mt-8">

      <h2 className="mb-5 text-lg font-bold text-[var(--ink-900)]">AI Product Comparison</h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-sm">

          <thead>
            <tr className="border-b border-[var(--border-subtle)] text-left text-xs font-semibold uppercase tracking-wide text-[var(--ink-400)]">
              <th className="py-3">Metric</th>
              {top.map((p) => (
                <th key={p.id} className="py-3 pl-4 font-semibold">
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr className="border-b border-[var(--border-subtle)]">
              <td className="py-3 text-[var(--ink-500)]">AI Score</td>
              {top.map((p) => (
                <td key={p.id} className="py-3 pl-4 font-semibold text-[var(--ink-900)]">
                  {p.ai_score}
                </td>
              ))}
            </tr>

            <tr className="border-b border-[var(--border-subtle)]">
              <td className="py-3 text-[var(--ink-500)]">Profit</td>
              {top.map((p) => (
                <td key={p.id} className="py-3 pl-4 font-semibold text-[var(--ink-900)]">
                  ${p.profit}
                </td>
              ))}
            </tr>

            <tr className="border-b border-[var(--border-subtle)]">
              <td className="py-3 text-[var(--ink-500)]">Competition</td>
              {top.map((p) => (
                <td key={p.id} className="py-3 pl-4 font-semibold text-[var(--ink-900)]">
                  {p.competition}
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-3 text-[var(--ink-500)]">Opportunity</td>
              {top.map((p) => (
                <td className="py-3 pl-4 font-bold text-[var(--accent-positive)]" key={p.id}>
                  {Math.round(p.opportunity_score ?? 0)}
                </td>
              ))}
            </tr>
          </tbody>

        </table>
      </div>

    </Card>
  );
}
