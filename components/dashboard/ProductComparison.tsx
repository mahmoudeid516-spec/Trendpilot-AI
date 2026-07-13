"use client";

import type { Product } from "../../types/Product";

type Props = {
  products: Product[];
};

export default function ProductComparison({ products }: Props) {
  if (products.length < 2) return null;

  const top = products.slice(0, 3);

  return (
    <div className="mt-10 rounded-3xl border bg-white p-8 shadow">

      <h2 className="text-3xl font-bold mb-6">
        🥊 AI Product Comparison
      </h2>

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="text-left py-3">
              Metric
            </th>

            {top.map((p) => (
              <th key={p.id}>
                {p.name}
              </th>
            ))}

          </tr>

        </thead>

        <tbody>

          <tr className="border-b">

            <td className="py-4">
              AI Score
            </td>

            {top.map((p) => (
              <td key={p.id}>
                {p.ai_score}
              </td>
            ))}

          </tr>

          <tr className="border-b">

            <td className="py-4">
              Profit
            </td>

            {top.map((p) => (
              <td key={p.id}>
                ${p.profit}
              </td>
            ))}

          </tr>

          <tr className="border-b">

            <td className="py-4">
              Competition
            </td>

            {top.map((p) => (
              <td key={p.id}>
                {p.competition}
              </td>
            ))}

          </tr>

          <tr>

            <td className="py-4">
              Opportunity
            </td>

            {top.map((p) => (
              <td
                className="font-bold text-green-600"
                key={p.id}
              >
                {Math.round(p.opportunity_score ?? 0)}
              </td>
            ))}

          </tr>

        </tbody>

      </table>

    </div>
  );
}