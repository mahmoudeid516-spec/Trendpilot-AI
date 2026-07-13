import type { Product } from "../../types/Product";

type Props = {
  product: Product;
};

export default function SupplierCard({ product }: Props) {
  return (
    <section className="mt-12 bg-white rounded-3xl shadow p-8">

      <h2 className="text-3xl font-bold mb-8">
        🛒 Supplier Information
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-gray-100 rounded-2xl p-5">
          <p className="text-gray-500 text-sm">
            Supplier
          </p>

          <h3 className="text-xl font-bold mt-2">
            {product.supplier}
          </h3>
        </div>

        <div className="bg-gray-100 rounded-2xl p-5">
          <p className="text-gray-500 text-sm">
            Platform
          </p>

          <h3 className="text-xl font-bold mt-2">
            {product.platform}
          </h3>
        </div>

        <div className="bg-gray-100 rounded-2xl p-5">
          <p className="text-gray-500 text-sm">
            Country
          </p>

          <h3 className="text-xl font-bold mt-2">
            {product.country}
          </h3>
        </div>

        <div className="bg-gray-100 rounded-2xl p-5">
          <p className="text-gray-500 text-sm">
            Profit
          </p>

          <h3 className="text-xl font-bold mt-2 text-green-600">
            ${product.profit}
          </h3>
        </div>

      </div>

      <div className="flex gap-4 mt-8">

        <a
          href={product.supplier_url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-purple-600 hover:bg-purple-700 transition text-white px-6 py-4 rounded-xl font-semibold"
        >
          Open Supplier
        </a>

        <a
          href={product.product_url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-900 hover:bg-black transition text-white px-6 py-4 rounded-xl font-semibold"
        >
          View Product
        </a>

      </div>

    </section>
  );
}