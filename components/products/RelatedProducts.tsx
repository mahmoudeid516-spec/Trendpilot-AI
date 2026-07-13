import type { Product } from "../../types/Product";

type Props = {
  products: Product[];
};

export default function RelatedProducts({ products }: Props) {
  if (!products.length) return null;

  return (
    <section className="mt-12">
      <h2 className="text-3xl font-bold mb-8">
        🔥 Related Winning Products
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />

            <div className="p-5">
              <h3 className="font-bold text-lg">
                {product.name}
              </h3>

              <p className="text-gray-500 mt-2">
                {product.category}
              </p>

              <div className="flex justify-between mt-5 text-sm">
                <span>🤖 {product.ai_score}%</span>
                <span>💰 ${product.profit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}