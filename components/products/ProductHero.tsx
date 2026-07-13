import type { Product } from "../../types/Product";
import MarketMetrics from "./MarketMetrics";
import { generateProductAdvice } from "../../services/ProductAdvisor";

type Props = {
  product: Product;
};

export default function ProductHero({ product }: Props) {
  const advice = generateProductAdvice(product);

  return (
    <>
      {/* Hero Section */}
      <div className="grid lg:grid-cols-2 gap-12">

        {/* Product Image */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-3xl shadow-2xl"
          />
        </div>

        {/* Product Information */}
        <div>

          <span className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-semibold">
            {product.platform}
          </span>

          <h1 className="text-5xl font-bold mt-6">
            {product.name}
          </h1>

          <p className="text-xl text-gray-500 mt-3">
            {product.category}
          </p>

          <div className="grid grid-cols-2 gap-5 mt-10">

            <div className="bg-gray-100 rounded-2xl p-5">
              <p className="text-gray-500">Buy Price</p>
              <h2 className="text-3xl font-bold">
                ${product.buy_price}
              </h2>
            </div>

            <div className="bg-green-100 rounded-2xl p-5">
              <p className="text-gray-500">Selling Price</p>
              <h2 className="text-3xl font-bold">
                ${product.selling_price}
              </h2>
            </div>

            <div className="bg-blue-100 rounded-2xl p-5">
              <p className="text-gray-500">Profit</p>
              <h2 className="text-3xl font-bold">
                ${product.profit}
              </h2>
            </div>

            <div className="bg-purple-100 rounded-2xl p-5">
              <p className="text-gray-500">AI Score</p>
              <h2 className="text-3xl font-bold">
                {product.ai_score}%
              </h2>
            </div>

          </div>

          <div className="flex gap-4 mt-10">

            <a
              href={product.product_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-600 hover:bg-purple-700 transition text-white px-6 py-4 rounded-xl font-semibold"
            >
              View Product
            </a>

            <a
              href={product.supplier_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900 hover:bg-black transition text-white px-6 py-4 rounded-xl font-semibold"
            >
              Open Supplier
            </a>

          </div>

        </div>

      </div>

      {/* AI Analysis */}

      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white mt-12">

        <h2 className="text-3xl font-bold">
          🤖 AI Analysis
        </h2>

        <p className="text-purple-100 mt-2">
          TrendPilot AI analyzed this product using AI score,
          trend score, profitability and competition.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mt-8">

          {advice.map((item) => (
            <div
              key={item}
              className="bg-white/10 rounded-xl p-5"
            >
              {item}
            </div>
          ))}

        </div>

      </section>

      {/* Market Metrics */}

      <MarketMetrics product={product} />

    </>
  );
}