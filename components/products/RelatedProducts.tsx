import Link from "next/link";
import type { Product } from "../../types/Product";

type Props = {
  products: Product[];
};

export default function RelatedProducts({ products }: Props) {
  if (!products.length) return null;

  return (
    <section className="mt-16">

      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-3xl font-bold">
            🔥 Related Winning Products
          </h2>

          <p className="text-gray-500 mt-2">
            AI selected similar high-performing products.
          </p>

        </div>

        <div className="hidden md:flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
          {products.length} Products
        </div>

      </div>

      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">

        {products.map((product) => (

          <div
            key={product.id}
            className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >

            <div className="relative overflow-hidden">

              <img
                src={product.image}
                alt={product.name}
                className="h-64 w-full object-cover transition duration-500 group-hover:scale-110"
              />

              <div className="absolute left-4 top-4 rounded-full bg-purple-600 px-3 py-1 text-xs font-bold text-white">
                AI {product.ai_score}%
              </div>

              <div className="absolute right-4 top-4 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">
                ${product.profit}
              </div>

            </div>

            <div className="p-6">

              <h3 className="line-clamp-2 text-lg font-bold leading-7">
                {product.name}
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {product.category}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">

                <div className="rounded-xl bg-gray-50 p-3">

                  <p className="text-xs text-gray-500">
                    Platform
                  </p>

                  <p className="mt-1 font-semibold">
                    {product.platform}
                  </p>

                </div>

                <div className="rounded-xl bg-gray-50 p-3">

                  <p className="text-xs text-gray-500">
                    Profit
                  </p>

                  <p className="mt-1 font-semibold text-green-600">
                    ${product.profit}
                  </p>

                </div>

              </div>

              <div className="mt-6">

                <div className="mb-2 flex justify-between text-sm">

                  <span>AI Score</span>

                  <span className="font-semibold">
                    {product.ai_score}%
                  </span>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-200">

                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                    style={{
                      width: `${product.ai_score}%`,
                    }}
                  />

                </div>

              </div>

              <div className="mt-8 flex gap-3">

                <Link
                  href={`/products/${product.id}`}
                  className="flex-1 rounded-xl bg-purple-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-purple-700"
                >
                  Analyze
                </Link>

                <a
                  href={product.product_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border px-4 py-3 font-semibold transition hover:bg-gray-100"
                >
                  Open
                </a>

              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}