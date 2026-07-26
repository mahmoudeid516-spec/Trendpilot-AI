import ProductCard from "./ProductCard";
import type { Product } from "../../types/Product";

type Props = {
  products: Product[];
};

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
    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}