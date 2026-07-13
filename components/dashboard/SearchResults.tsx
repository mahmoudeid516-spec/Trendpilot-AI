import type { Product } from "../../types/Product";

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
     
       
{sortedResults.map((product: any, index: number) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow hover:shadow-xl transition p-5"
          >
            <div className="absolute top-3 left-3 z-10">

<span
  className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
    product.opportunity_score >= 90
      ? "bg-green-600"
      : product.opportunity_score >= 70
      ? "bg-yellow-500"
      : "bg-red-600"
  }`}
>
  {product.opportunity_score >= 90
    ? "🏆 Winning Product"
    : product.opportunity_score >= 70
    ? "⭐ Good Opportunity"
    : "⚠️ Avoid"}
</span>

</div>
            
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-52 object-cover rounded-xl"
            />

            <h3 className="font-bold mt-4 line-clamp-2">
              {product.name}
            </h3>

            <p className="text-gray-500 mt-2">
              ⭐ {product.ai_score / 20} • {product.sales.toLocaleString()} Sold
            </p>

            <p className="text-2xl font-bold text-green-600 mt-3">
              ${product.buy_price.toFixed(2)}
            </p>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <p className="text-xs">Opportunity</p>
                <h4 className="font-bold text-xl">
                  {Math.round(product.opportunity_score ?? 0)}
                </h4>
              </div>

              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <p className="text-xs">AI Score</p>
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
        ))}
      </div>
    </div>
  );
}