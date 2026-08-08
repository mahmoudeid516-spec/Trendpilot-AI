"use client";

import { useEffect, useState } from "react";
import { ensureUniqueProductIds } from "../../lib/services/productIdentity";
import { supabase } from "../../lib/supabase";
import type { Product } from "../../types/Product";

type Props = {
  products?: Product[];
  search: string;
  platform: string;
  refreshKey: number;
  onSelectProduct: (product: Product) => void;
};

export default function ProductsTable({
  products: searchResults = [],
  search,
  platform,
  refreshKey,
  onSelectProduct,
}: Props) {

  const [savedProducts, setSavedProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setSavedProducts([]);
        return;
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Failed loading products:", error.message);
      }

      setSavedProducts(ensureUniqueProductIds(data || []));
    }

    void loadProducts();
  }, [refreshKey]);

  const displayProducts =
    searchResults.length > 0
      ? searchResults
      : savedProducts;

  const isSearchResultsMode = searchResults.length > 0;

  const filtered = displayProducts.filter((p) => {
    if (isSearchResultsMode) {
      return true;
    }

    const productName = (p.name ?? "").toLowerCase();
    const searchText = (search ?? "").toLowerCase();
  
    const matchSearch =
      searchText === "" ||
      productName.includes(searchText);
  
    const matchPlatform =
      platform === "All" ||
      (p.platform ?? "") === platform;
  
    return matchSearch && matchPlatform;
  });
  const displayedProducts = [...filtered].sort((a, b) => {
    return (b.ai_score ?? 0) - (a.ai_score ?? 0);
  });
  const stableDisplayedProducts = ensureUniqueProductIds(displayedProducts);
  
   
  function competitionColor(level:string){

    switch(level){

      case "Low":
        return "bg-green-100 text-green-700";

      case "Medium":
        return "bg-yellow-100 text-yellow-700";

      case "High":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100";

    }

  }

  return (

<div className="bg-white rounded-3xl shadow-xl p-8 mt-10">

<h2 className="text-3xl font-bold mb-8">

🔥 Winning Products

</h2>

<div className="overflow-x-auto">

<table className="w-full">

<thead>

<tr className="border-b text-gray-500">

<th className="text-left py-4">
Product
</th>

<th>
Platform
</th>

<th>
AI
</th>

<th>
Trend
</th>

<th>
Competition
</th>

<th>
Profit
</th>

<th>

</th>

</tr>

</thead>

<tbody>

{stableDisplayedProducts.length === 0 && (
  <tr>
    <td colSpan={7} className="py-12 text-center">
      <p className="text-xl font-bold text-gray-700">
        No products found yet
      </p>

      <p className="mt-2 text-gray-500">
        Try searching for a product keyword or import demo products to get started.
      </p>
    </td>
  </tr>
)}

{stableDisplayedProducts.map((product) => (

<tr
key={String(product.id)}
className="border-b hover:bg-purple-50 transition duration-300"
>

<td className="py-6">

<div className="flex gap-4 items-center">

<img
  src={product.image || "https://picsum.photos/200"}
  alt={product.name}
  className="w-20 h-20 rounded-2xl object-cover shadow"
/>

<div>

<h3 className="font-bold text-lg">

{product.name}

</h3>

<p className="text-gray-500">

{product.category}

</p>

</div>

</div>

</td>

<td>

<span className="font-semibold">

{product.platform}

</span>

</td>

<td className="w-48">

<div className="w-full bg-gray-200 rounded-full h-3">

<div

className="bg-green-500 h-3 rounded-full"

style={{
width:`${product.ai_score}%`
}}

>

</div>

</div>

<p className="mt-2 font-bold text-green-600">

{product.ai_score}%

</p>

</td>

<td>

<span className="font-bold text-blue-600">

{product.trend_score}

</span>

</td>

<td>

<span

className={`px-4 py-2 rounded-full text-sm font-bold ${competitionColor(product.competition)}`}

>

{product.competition}

</span>

</td>

<td>

<p className="font-bold text-purple-700 text-lg">

${product.profit}

</p>

</td>

<td>

<div className="flex gap-2">

<a
href={product.product_url}
target="_blank"
rel="noopener noreferrer"
className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
>

View

</a>

<a
href={product.supplier_url}
target="_blank"
rel="noopener noreferrer"
className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
>

Supplier

</a>

<button
onClick={() => onSelectProduct(product)}
className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
>
Report
</button>

</div>

</td>

</tr>

))}

</tbody>

</table>

{filtered.length===0 &&(

<div className="text-center py-20 text-gray-500">

No Products Found

</div>

)}

</div>

</div>

  );

}