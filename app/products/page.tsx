import Sidebar from "../../components/dashboard/Sidebar";
import ProductsClient from "../../components/products/ProductsClient";

export default function ProductsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface-app)] lg:flex-row">
      <Sidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold mb-2">
            📦 Products
          </h1>

          <p className="text-gray-500 mb-8">
            Manage your winning products.
          </p>

          <ProductsClient />
        </div>
      </main>
    </div>
  );
}
