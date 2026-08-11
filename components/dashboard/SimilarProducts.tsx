"use client";

import Image from "next/image";
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
    <div className="border-t border-[var(--border-subtle)] pt-6">

      <h2 className="mb-4 text-lg font-bold text-[var(--ink-900)]">Similar Products</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        {similar.map((item) => (

          <div
            key={item.id}
            className="tp-card tp-card-interactive overflow-hidden"
          >
            <div className="relative h-32 w-full">
              <Image src={item.image} alt={item.name} fill unoptimized className="object-cover" />
            </div>

            <div className="p-4">
              <h3 className="line-clamp-2 text-sm font-bold text-[var(--ink-900)]">
                {item.name}
              </h3>

              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="font-bold text-[var(--accent-positive)]">${item.buy_price}</span>
                <span className="text-[var(--ink-500)]">AI {item.ai_score}</span>
              </div>
            </div>
          </div>

        ))}

      </div>

    </div>
  );
}
