"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

type Product = {
  id: number;
  image: string;
  name: string;
  platform: string;
  ai_score: number;
  trend_score: number;
  profit: number;
  buy_price: number;
  selling_price: number;
  supplier: string;
  supplier_url: string;
  product_url: string;
  competition: string;
  country: string;
  category: string;
  description?: string;
  ai_reason?: string;
};

type ProductsTableProps = {
  search: string;
  platform: string;
  refreshKey: number;
  onSelectProduct: (product: Product) => void;
};

export default function ProductsTable({
  search,
  platform,
  refreshKey,
  onSelectProduct,
}: ProductsTableProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts();
  }, [refreshKey]);

  async function loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("ai_score", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

setProducts(data || []);
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      search === "" ||
      product.name.toLowerCase().includes(search.toLowerCase());

    const matchesPlatform =
      platform === "All" || product.platform === platform;

    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 mt-10">

      <h2 className="text-3xl font-bold mb-8">
        🔥 Today's Winning Products
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left py-5">Product</th>

              <th>Platform</th>

              <th>AI Score</th>

              <th>Profit</th>

              <th></th>

            </tr>

          </thead>

          <tbody>
          {filteredProducts.map((product) => (

<tr
  key={product.id}
  className="border-b hover:bg-gray-50 transition"
>

  <td className="py-5">

    <div className="flex items-center gap-4">

      <img
        src={product.image}
        alt={product.name}
        className="w-16 h-16 rounded-xl object-cover"
      />

      <div>

        <h3 className="font-bold text-lg">
          {product.name}
        </h3>

        <p className="text-gray-500 text-sm">
          {product.category}
        </p>

      </div>

    </div>

  </td>

  <td>
    {product.platform}
  </td>

  <td>

    <span className="text-green-600 font-bold">
      {product.ai_score}%
    </span>

  </td>

  <td>

    <span className="font-bold text-purple-600">
      ${product.profit}
    </span>

  </td>

  <td>

  <Link
  href={`/dashboard/product/${product.id}`}
  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
  >
    View Report
  </Link>

  </td>

</tr>

))}

{filteredProducts.length === 0 && (

<tr>

  <td
    colSpan={5}
    className="text-center py-12 text-gray-500"
  >
    No products found.
  </td>

</tr>

)}

</tbody>

</table>

</div>

</div>

);

}