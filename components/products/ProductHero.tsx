import type { Product } from "../../types/Product";
import { generateProductAdvice } from "../../services/ProductAdvisor";

type Props = {
  product: Product;
};

export default function ProductHero({ product }: Props) {
  const advice = generateProductAdvice(product);

  const opportunity =
    product.ai_score >= 90
      ? "Excellent Opportunity"
      : product.ai_score >= 75
      ? "Good Opportunity"
      : "Average Opportunity";

  return (
    <>
      {/* HERO */}

      <section className="grid lg:grid-cols-2 gap-12 items-center">

        {/* IMAGE */}

        <div className="bg-white rounded-[32px] shadow-2xl p-8">

          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-3xl object-cover"
          />

        </div>

        {/* INFO */}

        <div>

          <span className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
            {product.platform}
          </span>

          <h1 className="mt-5 text-5xl font-extrabold leading-tight">
            {product.name}
          </h1>

          <p className="mt-3 text-lg text-gray-500">
            {product.category}
          </p>

          {/* PRICE CARDS */}

          <div className="grid grid-cols-2 gap-5 mt-8">

            <div className="rounded-2xl bg-gray-50 p-5 border">
              <p className="text-gray-500 text-sm">
                Buy Price
              </p>

              <h3 className="text-3xl font-bold mt-2">
                ${product.buy_price}
              </h3>
            </div>

            <div className="rounded-2xl bg-green-50 p-5 border border-green-200">
              <p className="text-gray-500 text-sm">
                Selling Price
              </p>

              <h3 className="text-3xl font-bold text-green-600 mt-2">
                ${product.selling_price}
              </h3>
            </div>

            <div className="rounded-2xl bg-blue-50 p-5 border border-blue-200">
              <p className="text-gray-500 text-sm">
                Profit
              </p>

              <h3 className="text-3xl font-bold text-blue-600 mt-2">
                ${product.profit}
              </h3>
            </div>

            <div className="rounded-2xl bg-purple-50 p-5 border border-purple-200">
              <p className="text-gray-500 text-sm">
                AI Score
              </p>

              <h3 className="text-3xl font-bold text-purple-600 mt-2">
                {product.ai_score}%
              </h3>
            </div>

          </div>

          {/* BUSINESS STATS */}

          <div className="grid grid-cols-3 gap-4 mt-8">

            <div className="rounded-xl border p-4">

              <p className="text-sm text-gray-500">
                Trend
              </p>

              <h4 className="text-2xl font-bold">
                {product.trend_score}%
              </h4>

            </div>

            <div className="rounded-xl border p-4">

              <p className="text-sm text-gray-500">
                Competition
              </p>

              <h4 className="text-2xl font-bold text-green-600">
                Low
              </h4>

            </div>

            <div className="rounded-xl border p-4">

              <p className="text-sm text-gray-500">
                Revenue
              </p>

              <h4 className="text-2xl font-bold">
                $
                {(
                  product.selling_price *
                  150
                ).toFixed(0)}
              </h4>

            </div>

          </div>

          {/* OPPORTUNITY */}

          <div className="mt-8 rounded-3xl bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-sm uppercase opacity-80">
                  AI Recommendation
                </p>

                <h3 className="text-3xl font-bold mt-1">
                  {opportunity}
                </h3>

                <p className="mt-2 opacity-90">
                  AI confidence:
                  {" "}
                  {product.ai_score}%
                </p>

              </div>

              <div className="h-28 w-28 rounded-full border-8 border-white flex items-center justify-center text-3xl font-bold">

                {product.ai_score}

              </div>

            </div>

          </div>

          {/* BUTTONS */}

          <div className="flex flex-wrap gap-4 mt-8">

            <a
              href={product.product_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-purple-600 px-8 py-4 font-semibold text-white hover:bg-purple-700 transition"
            >
              View Product
            </a>

            <a
              href={product.supplier_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-black px-8 py-4 font-semibold text-white hover:bg-gray-800 transition"
            >
              Open Supplier
            </a>

            <button className="rounded-xl border px-8 py-4 font-semibold hover:bg-gray-100 transition">
              Import to Shopify
            </button>

          </div>

        </div>

      </section>

      {/* AI ANALYSIS */}

      <section className="mt-14 rounded-[32px] bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-600 p-8 text-white">

        <h2 className="text-3xl font-bold">
          🤖 TrendPilot AI Analysis
        </h2>

        <p className="mt-2 text-purple-100">
          AI evaluated profitability, demand, trend,
          competition and long-term growth.
        </p>

        <div className="grid md:grid-cols-2 gap-5 mt-8">

          {advice.map((item) => (

            <div
              key={item}
              className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-5"
            >
              {item}
            </div>

          ))}

        </div>

      </section>
    </>
  );
}