"use client";

import type { Product } from "../../types/Product";

type Props = {
  current: Product;
  products: Product[];
};

export default function SimilarProducts({
  current,
  products,
}: Props) {

  const similar = products
    .filter((p) => p.id !== current.id)
    .filter((p) => p.category === current.category)
    .sort(
      (a, b) =>
        (b.ai_score ?? 0) - (a.ai_score ?? 0)
    )
    .slice(0, 4);

  if (!similar.length) return null;

  return (
    <div className="mt-10">

      <h2 className="text-2xl font-bold mb-5">
        🔥 Similar Winning Products
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

        {similar.map((item) => (

          <div
            key={item.id}
            className="rounded-2xl border p-4 hover:shadow-lg transition"
          >

            <img
              src={item.image}
              alt={item.name}
              className="rounded-xl h-40 w-full object-cover"
            />

            <h3 className="font-bold mt-3 line-clamp-2">
              {item.name}
            </h3>

            <p className="text-green-600 font-bold mt-2">
              ${item.buy_price}
            </p>

            <p className="mt-2">
              🤖 AI {item.ai_score}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}