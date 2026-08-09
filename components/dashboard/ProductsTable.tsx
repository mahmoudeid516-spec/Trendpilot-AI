"use client";

import { useEffect, useState } from "react";
import { ensureUniqueProductIds } from "../../lib/services/productIdentity";
import { supabase } from "../../lib/supabase";
import type { Product } from "../../types/Product";
import Filters from "./Filters";
import {
  formatAsin,
  formatPriceRange,
  formatRating,
  formatReviewCount,
  hasExternalUrl,
} from "../../lib/utils/productDisplay";

const PAGE_SIZE = 10;

type Props = {
  products?: Product[];
  search: string;
  platform: string;
  setPlatform: (value: string) => void;
  refreshKey: number;
  hasSearched: boolean;
  searchError: string | null;
  onSelectProduct: (product: Product) => void;
};

export default function ProductsTable({
  products: searchResults = [],
  search,
  platform,
  setPlatform,
  refreshKey,
  hasSearched,
  searchError,
  onSelectProduct,
}: Props) {

  const [savedProducts, setSavedProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState("All");
  const [competition, setCompetition] = useState("All");
  const [minScore, setMinScore] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*");

      if (error) {
        console.error("Failed loading products:", error.message);
      }

      setSavedProducts(ensureUniqueProductIds(data || []));
    }

    void loadProducts();
  }, [refreshKey]);

  const displayProducts = hasSearched
    ? searchResults
    : savedProducts;

  const isSearchResultsMode = hasSearched;

  const categoryOptions: string[] = Array.from(
    new Set<string>(
      displayProducts
        .map((p: Product) => (p.category ?? "").trim())
        .filter((value: string) => value.length > 0)
    )
  ).sort();

  const filtered = displayProducts.filter((p: Product) => {
    const productName = (p.name ?? "").toLowerCase();
    const searchText = (search ?? "").toLowerCase();

    const matchSearch =
      searchText === "" ||
      productName.includes(searchText);

    const matchPlatform =
      platform === "All" ||
      (p.platform ?? "") === platform;

    const matchCategory =
      category === "All" ||
      (p.category ?? "") === category;

    const matchCompetition =
      competition === "All" ||
      (p.competition ?? "") === competition;

    const matchScore = (p.ai_score ?? 0) >= minScore;

    return (
      matchSearch &&
      matchPlatform &&
      matchCategory &&
      matchCompetition &&
      matchScore
    );
  });

  const displayedProducts = [...filtered].sort((a, b) => {
    return (b.ai_score ?? 0) - (a.ai_score ?? 0);
  });
  const stableDisplayedProducts = ensureUniqueProductIds(displayedProducts);

  const totalPages = Math.max(
    1,
    Math.ceil(stableDisplayedProducts.length / PAGE_SIZE)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, platform, category, competition, minScore, refreshKey, isSearchResultsMode]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageProducts = stableDisplayedProducts.slice(
    pageStart,
    pageStart + PAGE_SIZE
  );

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

<Filters
  platform={platform}
  setPlatform={setPlatform}
  category={category}
  setCategory={setCategory}
  competition={competition}
  setCompetition={setCompetition}
  minScore={minScore}
  setMinScore={setMinScore}
  categoryOptions={categoryOptions}
/>

{searchError && (
  <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-6">
    <p className="text-lg font-bold text-red-700">
      ⚠️ Product search unavailable
    </p>
    <p className="mt-1 text-red-600">
      {searchError}
    </p>
  </div>
)}

<div className="overflow-x-auto">

<table className="w-full">

<thead>

<tr className="border-b text-gray-500">

<th className="text-left py-4">
Product
</th>

<th>
Price
</th>

<th>
Rating
</th>

<th>
Platform
</th>

<th>
AI / Opportunity <span className="text-xs font-normal">(est.)</span>
</th>

<th>
Trend <span className="text-xs font-normal">(est.)</span>
</th>

<th>
Competition <span className="text-xs font-normal">(est.)</span>
</th>

<th>
Profit <span className="text-xs font-normal">(est.)</span>
</th>

<th>

</th>

</tr>

</thead>

<tbody>

{!searchError && displayProducts.length === 0 && isSearchResultsMode && (
  <tr>
    <td colSpan={9} className="py-12 text-center">
      <p className="text-xl font-bold text-gray-700">
        No products found for this search.
      </p>
      <p className="mt-2 text-gray-500">
        Try a different keyword.
      </p>
    </td>
  </tr>
)}

{!searchError && displayProducts.length === 0 && !isSearchResultsMode && (
  <tr>
    <td colSpan={9} className="py-12 text-center">
      <p className="text-xl font-bold text-gray-700">
        No products found yet
      </p>

      <p className="mt-2 text-gray-500">
        Try searching for a product keyword or import demo products to get started.
      </p>
    </td>
  </tr>
)}

{!searchError && displayProducts.length > 0 && stableDisplayedProducts.length === 0 && (
  <tr>
    <td colSpan={9} className="py-12 text-center">
      <p className="text-xl font-bold text-gray-700">
        No products match your filters.
      </p>
      <p className="mt-2 text-gray-500">
        Try widening your search or filter criteria.
      </p>
    </td>
  </tr>
)}

{pageProducts.map((product) => (

<tr
key={String(product.id)}
className="border-b hover:bg-purple-50 transition duration-300"
>

<td className="py-6">

<div className="flex gap-4 items-center">

{product.image?.trim() ? (
  <img
    src={product.image}
    alt={product.name}
    className="w-20 h-20 rounded-2xl object-cover shadow"
  />
) : (
  <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center text-xs text-gray-400 shadow">
    No image
  </div>
)}

<div>

<h3 className="font-bold text-lg">

{product.name}

</h3>

<p className="text-gray-500">

{product.category}

</p>

<p className="text-xs text-gray-400 mt-1">
  ASIN: {formatAsin(product)}
</p>

</div>

</div>

</td>

<td>

<span className="font-semibold">
  {formatPriceRange(product)}
</span>

</td>

<td>

<span className="font-semibold">
  {formatRating(product)}
</span>

<p className="text-xs text-gray-400">
  {formatReviewCount(product)} reviews
</p>

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

{product.ai_score}% · Opp {product.opportunity_score ?? 0}

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

{hasExternalUrl(product) ? (
  <a
    href={product.product_url}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
  >
    View on Amazon
  </a>
) : (
  <span className="px-3 py-2 text-sm text-gray-400">
    No link available
  </span>
)}

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

{totalPages > 1 && (
  <div className="flex items-center justify-between mt-6">
    <button
      onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))}
      disabled={currentPage <= 1}
      className="px-4 py-2 rounded-lg border font-semibold disabled:opacity-40"
    >
      ← Previous
    </button>

    <p className="text-gray-500">
      Page {currentPage} of {totalPages} ({stableDisplayedProducts.length} products)
    </p>

    <button
      onClick={() => setCurrentPage((p: number) => Math.min(totalPages, p + 1))}
      disabled={currentPage >= totalPages}
      className="px-4 py-2 rounded-lg border font-semibold disabled:opacity-40"
    >
      Next →
    </button>
  </div>
)}

</div>

</div>

  );

}
