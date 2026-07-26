import type { Product } from "../../types/Product";
import { generateAdvice } from "../../services/advisor";
import { Lightbulb } from "lucide-react";

type Props = {
  product: Product;
};

export default function AIRecommendation({
  product,
}: Props) {
 
  const advice = generateAdvice(product);

  return (
    <div className="relative mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_0%,rgba(99,102,241,0.08),transparent_30%)]" />

      <div className="relative z-10">

        <h2 className="inline-flex items-center gap-2 text-3xl font-semibold tracking-tight text-slate-900">
          <Lightbulb className="h-6 w-6 text-indigo-500" />
          TrendPilot Recommendation
        </h2>

        <p className="mt-2 text-sm font-medium text-slate-600">
          Based on your search, our AI recommends:
        </p>

        <h3 className="mt-6 text-4xl font-semibold leading-tight text-slate-900">
          {product.name}
        </h3>

        <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-5">

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">Opportunity</p>
            <h4 className="mt-1 text-3xl font-semibold text-slate-900">
              {product.opportunity_score?.toFixed(1)}
            </h4>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">AI Score</p>
            <h4 className="mt-1 text-3xl font-semibold text-slate-900">
              {product.ai_score}%
            </h4>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">Profit</p>
            <h4 className="mt-1 text-3xl font-semibold text-slate-900">
              ${product.profit}
            </h4>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">Competition</p>
            <h4 className="mt-1 text-2xl font-semibold text-slate-900">
              {product.competition}
            </h4>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">Trend</p>
            <h4 className="mt-1 text-3xl font-semibold text-slate-900">
              {product.trend_score}
            </h4>
          </div>

        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">

          <h3 className="mb-4 text-xl font-semibold tracking-tight text-slate-900">
            Why TrendPilot recommends this product
          </h3>

          <ul className="space-y-2 text-sm leading-relaxed text-slate-700">

          {advice.map((item) => (
              <li key={item}>
                {item}
              </li>
            ))}

          </ul>

        </div>

      </div>
    </div>
  );
}