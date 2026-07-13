import { supabase } from "../../lib/supabase";
import ProductsClient from "../../components/products/ProductsClient";

export default async function ProductsPage() {

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  return (
    <div className="max-w-7xl mx-auto p-8">

      <h1 className="text-4xl font-bold mb-2">
        📦 Products
      </h1>

      <p className="text-gray-500 mb-8">
        Manage your winning products.
      </p>

      <ProductsClient
        products={products ?? []}
      />

    </div>
  );

}