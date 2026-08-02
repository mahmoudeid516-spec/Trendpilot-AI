import Image from "next/image";
import type { Product } from "../../types/Product";

type Props = {
  results: Product[];
};

export default function SearchResults({ results }: Props) {
  return (
    <div className="mt-8">
      <h2 className="mb-6 text-3xl font-black tracking-tight text-slate-900">
        Found {results.length} Products
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {results.map((product, index) => (
          <div
            key={index}
            className="group rounded-2xl border border-slate-200 bg-white/88 p-5 shadow-[0_20px_50px_-34px_rgba(15,23,42,0.28)] transition-all duration-200 hover:-translate-y-1 hover:border-indigo-200"
          >
            <Image
              src={product.image || "https://picsum.photos/800/600"}
              alt={product.name}
              width={800}
              height={600}
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 33vw"
              unoptimized
              className="h-52 w-full rounded-xl border border-slate-200 object-cover"
            />

            <h3 className="mt-4 line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-slate-900">
              {product.name}
            </h3>

            <p className="mt-2 text-sm font-medium text-slate-500">
              ⭐ {product.ai_score / 20} • {product.sales.toLocaleString()} Sold
            </p>

            <p className="mt-3 text-2xl font-semibold text-emerald-700">
              ${product.buy_price.toFixed(2)}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-3 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-indigo-700">Opportunity</p>
                <h4 className="text-xl font-semibold text-slate-900">
                  {Math.round(product.opportunity_score ?? 0)}
                </h4>
              </div>

              <div className="rounded-xl border border-sky-100 bg-sky-50 p-3 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-700">AI Score</p>
                <h4 className="text-xl font-semibold text-slate-900">
                  {product.ai_score}%
                </h4>
              </div>
            </div>

            <a
              href={product.product_url}
              target="_blank"
              rel="noreferrer"
              className="mt-5 block rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] py-3 text-center text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-200 hover:brightness-110"
            >
              View Product
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}