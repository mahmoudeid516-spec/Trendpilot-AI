import type { Product } from "../../types/Product";
import { productImageOrPlaceholder } from "../../lib/productImagePlaceholder";

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
      <h2 className="text-3xl font-bold mb-6">
        Found {results.length} Products
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
     
       
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
            className="bg-white rounded-2xl shadow hover:shadow-xl transition p-5"
          >
            <div className="absolute top-3 left-3 z-10">

<span
  className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
    opportunity >= 90
      ? "bg-green-600"
      : opportunity >= 70
      ? "bg-yellow-500"
      : "bg-red-600"
  }`}
>
  {opportunity >= 90
    ? "🏆 Winning Product"
    : opportunity >= 70
    ? "⭐ Good Opportunity"
    : "⚠️ Avoid"}
</span>

</div>
            
            <img
              src={productImageOrPlaceholder(product.image)}
              alt={product.name}
              className="w-full h-52 object-cover rounded-xl"
            />

            <h3 className="font-bold mt-4 line-clamp-2">
              {product.name}
            </h3>

            <p className="text-gray-500 mt-2">
              ⭐ {rating.toFixed(1)} • {orders.toLocaleString("en-US")} Orders
            </p>

            <p className="text-2xl font-bold text-green-600 mt-3">
              ${product.buy_price.toFixed(2)}
            </p>

            <p className="text-sm text-gray-600 mt-1">
              Est. Profit ${estimatedProfit.toFixed(2)}
            </p>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <p className="text-xs">Opportunity (Est.)</p>
                <h4 className="font-bold text-xl">
                  {Math.round(opportunity)}
                </h4>
              </div>

              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <p className="text-xs">AI Score (Est.)</p>
                <h4 className="font-bold text-xl">
                  {product.ai_score}%
                </h4>
              </div>
            </div>

            <a
              href={product.product_url}
              target="_blank"
              rel="noreferrer"
              className="mt-5 block text-center bg-purple-600 text-white rounded-xl py-3 hover:bg-purple-700"
            >
              View Product
            </a>
          </div>
        );
        })}
      </div>
    </div>
  );
}