"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";

type Props = {
  products: any[];
};

const PAGE_SIZE = 12;

// Owns its own page state; the parent keys this component on the products
// list so React remounts it (resetting to page 1) whenever the filtered
// set changes, instead of resetting state from an effect.
function ProductGridPage({ products }: Props) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedProducts = products.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <>
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {pagedProducts.map((product, index) => (
          <ProductCard
            key={
              product.product_url ||
              product.supplier_url ||
              `${product.name}-${index}`
            }
            product={product}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border font-semibold text-gray-600 disabled:opacity-40 hover:bg-gray-50"
          >
            Previous
          </button>

          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg border font-semibold text-gray-600 disabled:opacity-40 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

export default function ProductGrid({
  products,
}: Props) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        No products found.
      </div>
    );
  }

  return (
    <ProductGridPage
      key={products.map((p) => p.product_url || p.supplier_url || p.name).join(",")}
      products={products}
    />
  );
}
