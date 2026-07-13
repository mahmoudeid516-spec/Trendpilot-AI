import type { Product } from "../../types/Product";

type Props = {
  product: Product;
};

export default function MarketMetrics({ product }: Props) {
  return (
    <section className="mt-12">
      <h2 className="text-3xl font-bold mb-8">
        📊 Market Metrics
      </h2>

      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-5">

        <div className="bg-white rounded-2xl shadow p-5 text-center">
          <p className="text-gray-500 text-sm">
            Monthly Sales
          </p>

          <h3 className="text-2xl font-bold mt-2">
            {product.sales ?? 0}
          </h3>
        </div>

        <div className="bg-white rounded-2xl shadow p-5 text-center">
          <p className="text-gray-500 text-sm">
            Revenue
          </p>

          <h3 className="text-2xl font-bold mt-2">
            $
            {(product.sales ?? 0) *
              (product.selling_price ?? 0)}
          </h3>
        </div>

        <div className="bg-white rounded-2xl shadow p-5 text-center">
          <p className="text-gray-500 text-sm">
            AI Score
          </p>

          <h3 className="text-2xl font-bold mt-2">
            {product.ai_score}%
          </h3>
        </div>

        <div className="bg-white rounded-2xl shadow p-5 text-center">
          <p className="text-gray-500 text-sm">
            Trend Score
          </p>

          <h3 className="text-2xl font-bold mt-2">
            {product.trend_score}
          </h3>
        </div>

        <div className="bg-white rounded-2xl shadow p-5 text-center">
          <p className="text-gray-500 text-sm">
            Competition
          </p>

          <h3 className="text-2xl font-bold mt-2">
            {product.competition}
          </h3>
        </div>

        <div className="bg-white rounded-2xl shadow p-5 text-center">
          <p className="text-gray-500 text-sm">
            Profit
          </p>

          <h3 className="text-2xl font-bold mt-2">
            ${product.profit}
          </h3>
        </div>

      </div>
    </section>
  );
}