import Link from "next/link";
import type { Product } from "../../types/Product";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100">

      <img
        src={
          product.image && product.image.startsWith("http")
            ? product.image
            : "/images/product-placeholder.png"
        }
        alt={product.name}
        className="w-full h-56 object-cover"
      />

      <div className="p-5">

        <h2 className="text-xl font-bold line-clamp-2">
          {product.name}
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          {product.category}
        </p>

        <div className="mt-4">
          <p className="text-3xl font-bold text-slate-900">
            ${Number(product.selling_price ?? 0).toFixed(2)}
          </p>

          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span>📦 {product.sales ?? 0} Sold</span>
            <span>⭐ {product.reviews ?? 0} Reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">

          <div className="bg-purple-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">
              AI Score
            </p>

            <h3 className="text-xl font-bold text-purple-600">
              {Math.round(product.ai_score ?? 0)}%
            </h3>
          </div>

          <div className="bg-green-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">
              Profit
            </p>

            <h3 className="text-xl font-bold text-green-600">
              ${Number(product.profit ?? 0).toFixed(2)}
            </h3>
          </div>

          <div className="bg-orange-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">
              Trend
            </p>

            <h3 className="text-xl font-bold text-orange-600">
              {Math.round(product.trend_score ?? 0)}
            </h3>
          </div>

          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">
              Competition
            </p>

            <h3 className="text-lg font-bold text-blue-600">
              {product.competition}
            </h3>
          </div>

        </div>

        <div className="mt-6">

          <p className="text-sm text-gray-600 line-clamp-3">
            {product.description || "No description available."}
          </p>

        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">

          <Link
            href={`/products/${product.id}`}
            className="bg-purple-600 hover:bg-purple-700 text-white text-center py-3 rounded-xl font-semibold transition"
          >
            📊 Report
          </Link>

          <a
            href={product.product_url}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 text-center py-3 rounded-xl font-semibold transition"
          >
            🛒 Amazon
          </a>

        </div>

        <div className="mt-5 flex items-center justify-between text-xs text-gray-500">

          <span>
            Platform:
            <span className="ml-1 font-semibold text-gray-700">
              {product.platform}
            </span>
          </span>

          <span>
            Country:
            <span className="ml-1 font-semibold text-gray-700">
              {product.country}
            </span>
          </span>

        </div>

      </div>

    </div>
  );
}