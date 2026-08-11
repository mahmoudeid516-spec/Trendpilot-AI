import Image from "next/image";
import type { Product } from "../../types/Product";
import ScoreBadge from "../product-research/ScoreBadge";
import DecisionBadge from "../product-research/DecisionBadge";

type Props = {
  results: Product[];
};

export default function SearchResults({ results }: Props) {

  const sortedResults = [...results].sort(
    (a, b) =>
      (b.opportunity_score ?? 0) -
      (a.opportunity_score ?? 0)
  );

  return (
    <div className="mt-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent-ai)]">
        AI-Suggested Products
      </p>
      <h2 className="mb-6 text-2xl font-bold text-[var(--ink-900)]">
        {results.length} product{results.length === 1 ? "" : "s"} matching your question
      </h2>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

        {sortedResults.map((product: Product, index: number) => {
          const opportunity = product.opportunity_score ?? 0;
          const rating = Number(product.store_rating ?? product.supplier_rating ?? 0);
          const orders = Number(product.orders ?? product.sales ?? 0);
          const estimatedProfit = Number(
            product.profit ?? product.selling_price - product.buy_price
          );

          return (
            <div
              key={index}
              className="tp-card tp-card-interactive flex flex-col overflow-hidden"
            >
              <div className="relative h-44 w-full shrink-0">
                <Image
                  src={product.image || "https://placehold.co/400x300?text=No+Image"}
                  alt={product.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute left-3 top-3">
                  <DecisionBadge decision={opportunity >= 90 ? "Strong Buy" : opportunity >= 70 ? "Buy" : product.decision} />
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-bold text-[var(--ink-900)] line-clamp-2">
                  {product.name}
                </h3>

                <p className="mt-2 text-sm text-[var(--ink-500)]">
                  ⭐ {rating.toFixed(1)} &middot; {orders.toLocaleString()} orders
                </p>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-[var(--ink-900)]">${product.buy_price.toFixed(2)}</span>
                  <span className="text-sm text-[var(--ink-500)]">
                    Est. profit <span className="font-semibold text-[var(--accent-positive)]">${estimatedProfit.toFixed(2)}</span>
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <ScoreBadge label="Opportunity" value={opportunity} />
                  <ScoreBadge label="AI Score" value={product.ai_score} suffix="%" />
                </div>

                <a
                  href={product.product_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 block rounded-xl bg-[var(--accent-ai)] py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#5b3ce0]"
                >
                  View Product
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
