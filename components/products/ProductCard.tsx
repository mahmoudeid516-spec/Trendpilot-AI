import Link from "next/link";
import type { Product } from "../../types/Product";
import {
  formatAsin,
  formatPriceRange,
  formatRating,
  hasExternalUrl,
} from "../../lib/utils/productDisplay";

type Props = {
  product: Product;
};

export default function ProductCard({
  product,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300">

      {product.image?.trim() ? (
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover"
        />
      ) : (
        <div className="w-full h-56 flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
          No image available
        </div>
      )}

      <div className="p-5">

        <h2 className="text-xl font-bold line-clamp-2">
          {product.name}
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          {product.category}
        </p>

        <p className="text-sm text-gray-500 mt-1">
          ⭐ {formatRating(product)} · ASIN {formatAsin(product)}
        </p>

        <p className="text-lg font-bold text-gray-800 mt-2">
          {formatPriceRange(product)}
        </p>

        <div className="grid grid-cols-2 gap-3 mt-5">

          <div className="bg-purple-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">
              AI Score (est.)
            </p>

            <h3 className="text-xl font-bold text-purple-600">
            {Math.round(product.ai_score)}%
            </h3>
          </div>

          <div className="bg-green-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">
              Profit (est.)
            </p>

            <h3 className="text-xl font-bold text-green-600">
              ${product.profit}
            </h3>
          </div>

          <div className="bg-orange-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">
              Trend (est.)
            </p>

            <h3 className="text-xl font-bold text-orange-600">
              {product.trend_score}
            </h3>
          </div>

          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">
              Competition (est.)
            </p>

            <h3 className="text-lg font-bold text-blue-600">
              {product.competition}
            </h3>
          </div>

        </div>

        <div className="mt-6 flex flex-col gap-3">

          {hasExternalUrl(product) && (
            <a
              href={product.product_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-xl font-semibold transition"
            >
              View on Amazon
            </a>
          )}

          <Link
            href={`/products/${product.id}`}
            className="bg-purple-600 hover:bg-purple-700 text-white text-center py-3 rounded-xl font-semibold transition"
          >
            📊 View Report
          </Link>

        </div>

      </div>

    </div>
  );
}