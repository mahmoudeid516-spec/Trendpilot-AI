"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import type { Product } from "../../types/Product";

interface TableProduct extends Product {
  title?: string;
  score?: {
    winningProbability: number;
    launchStatus: "Launch Now" | "Watch" | "Skip";
  };
  ai_reason?: string;
}

type Props = {
  products?: Product[];
  search: string;
  platform: string;
  refreshKey: number;
  onSelectProduct: (product: Product) => void;
  subscription?: "free" | "pro" | "premium";
};

export default function ProductsTable({
  products: searchResults = [],
  search,
  platform,
  refreshKey,
  onSelectProduct,
  subscription = "free",
}: Props) {
  const [savedProducts, setSavedProducts] = useState<TableProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const isFree = subscription === "free";
  const isPro = subscription === "pro";
  const isSearchActive = search.trim().length > 0 

  // Only load from Supabase if NO active search is performed
  const loadProducts = useCallback(async () => {
    if (isSearchActive) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        image,
        platform,
        category,
        buy_price,
        selling_price,
        profit,
        trend_score,
        ai_score,
        competition,
        country,
        supplier_url,
        product_url,
        ai_reason
      `)
      .order("ai_score", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setSavedProducts((data as TableProduct[]) ?? []);
    }

    setLoading(false);
  }, [isSearchActive]);

  useEffect(() => {
    if (!isSearchActive) {
      loadProducts();
    }
  }, [refreshKey, isSearchActive, loadProducts]);

  // 1. Isolated display source logic: STRICT split between Active Search vs Default Supabase
  const displayProducts = useMemo(() => {
    const rawProducts = (isSearchActive ? searchResults : savedProducts) as TableProduct[];
    
    // De-duplicate STRICTLY by explicit unique product ID per search stream
    const seenIds = new Set<string>();

    return rawProducts.filter((product) => {
      const id = String(product.id ?? "");
      if (!id || id === "NaN" || seenIds.has(id)) return false;

      seenIds.add(id);
      return true;
    });
  }, [isSearchActive, searchResults, savedProducts]);

  // 2. Filter & Sort directly on the active dataset
  const filtered = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return displayProducts
      .filter((product: TableProduct) => {
        const productName = (product.name ?? product.title ?? "").toLowerCase();
        const matchSearch = searchTerm === "" || productName.includes(searchTerm);
        const matchPlatform = platform === "All" || product.platform === platform;

        return matchSearch && matchPlatform;
      })
      .sort((a: TableProduct, b: TableProduct) => {
        const scoreA = a.score?.winningProbability ?? a.ai_score ?? 0;
        const scoreB = b.score?.winningProbability ?? b.ai_score ?? 0;

        if (scoreB !== scoreA) {
          return scoreB - scoreA;
        }

        const trendA = a.trend_score ?? 0;
        const trendB = b.trend_score ?? 0;
        return trendB - trendA;
      });
  }, [displayProducts, search, platform]);

  const displayedProducts = useMemo(() => {
    if (isFree) return filtered.slice(0, 10);
    if (isPro) return filtered.slice(0, 200);
    return filtered.slice(0, 1000);
  }, [filtered, isFree, isPro]);

  // Debug Logging Requirements
  useEffect(() => {
    if (isSearchActive) {
      console.log("Search:", search);
      console.log("Displaying:", displayedProducts.length);
    }
  }, [search, isSearchActive, displayedProducts.length]);

  const getBadgeColor = (level: string) => {
    switch (level) {
      case "Low":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200/60";
      case "Medium":
        return "bg-amber-50 text-amber-700 border border-amber-200/60";
      case "High":
        return "bg-rose-50 text-rose-700 border border-rose-200/60";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200/60";
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center font-medium text-slate-500 animate-pulse border border-slate-200/80 shadow-sm">
        Checking and loading top winning products...
      </div>
    );
  }

  return (
    <section className="mt-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>🔥</span> Today's Winning Products
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Ranked directly by highest winning probability and market velocity.
          </p>
        </div>

        <div className="rounded-xl bg-indigo-600 px-5 py-2.5 text-white shadow-sm shadow-indigo-200">
          <p className="text-[10px] uppercase font-semibold tracking-wider opacity-80">Available Items</p>
          <h2 className="text-xl font-bold leading-tight">{displayedProducts.length}</h2>
        </div>
      </div>

      {displayedProducts.length === 0 && (
        <div className="rounded-2xl bg-white p-12 text-center border border-slate-200/80 shadow-sm text-slate-500 font-medium">
          No products found
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayedProducts.map((product) => {
          const winningProbability = product.score?.winningProbability ?? product.ai_score ?? 0;
          const launchStatus = product.score?.launchStatus ?? "Unknown";

          return (
            <div
              key={String(product.id)}
              className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="relative">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={
                      product.image?.trim()
                        ? product.image
                        : "https://picsum.photos/600"
                    }
                    alt={product.name || product.title}
                    className="h-60 w-full object-cover"
                  />

                  <div className="absolute left-3 top-3 rounded-full bg-slate-900/80 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white shadow-sm">
                    🏆 AI Pick
                  </div>

                  <div className="absolute right-3 top-3 rounded-full bg-emerald-500 text-white font-bold text-xs px-3 py-1 shadow-sm">
                    {winningProbability}%
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="line-clamp-2 text-base font-bold text-slate-900 leading-snug">
                    {product.name || product.title}
                  </h3>

                  <p className="mt-1 text-xs font-medium text-slate-400">{product.category}</p>

                  <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                      <p className="text-slate-400 font-medium">Buy Price</p>
                      <h3 className="mt-0.5 text-lg font-bold text-slate-800">
                        ${product.buy_price}
                      </h3>
                    </div>

                    <div className="rounded-xl bg-emerald-50/50 p-3 border border-emerald-100">
                      <p className="text-slate-400 font-medium">Sell Price</p>
                      <h3 className="mt-0.5 text-lg font-bold text-emerald-600">
                        ${product.selling_price}
                      </h3>
                    </div>

                    <div className="rounded-xl bg-purple-50/50 p-3 border border-purple-100">
                      <p className="text-slate-400 font-medium">Profit</p>
                      <h3 className="mt-0.5 text-lg font-bold text-purple-600">
                        ${product.profit}
                      </h3>
                    </div>

                    <div className="rounded-xl bg-indigo-50/50 p-3 border border-indigo-100">
                      <p className="text-slate-400 font-medium">Trend Score</p>
                      <h3 className="mt-0.5 text-lg font-bold text-indigo-600">
                        {product.trend_score}%
                      </h3>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-xs font-semibold text-slate-700">
                      <span>Winning Probability</span>
                      <span>{winningProbability}%</span>
                    </div>

                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 transition-all duration-500"
                        style={{ width: `${winningProbability}%` }}
                      />
                    </div>

                    <div className="mt-2.5">
                      <span
                        className={`inline-block rounded-md px-2.5 py-0.5 text-xs font-bold ${
                          launchStatus === "Launch Now"
                            ? "bg-emerald-100 text-emerald-800"
                            : launchStatus === "Watch"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {launchStatus}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    <span
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${getBadgeColor(
                        product.competition
                      )}`}
                    >
                      Comp: {product.competition}
                    </span>

                    <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100">
                      {product.platform}
                    </span>

                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      🌍 {product.country}
                    </span>
                  </div>

                  {product.ai_reason && (
                    <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/40 p-3 text-xs">
                      <h4 className="mb-1 font-bold text-indigo-900 flex items-center gap-1">
                        🤖 AI Insight
                      </h4>
                      <p className="leading-relaxed text-slate-600">
                        {product.ai_reason}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0 mt-auto">
                <div className="grid grid-cols-3 gap-2">
                  <Link
                    href={`/products/${product.id}`}
                    className="rounded-xl bg-slate-900 py-2.5 text-center font-semibold text-white hover:bg-slate-800 text-xs flex items-center justify-center transition"
                  >
                    View Details
                  </Link>
                  {isFree ? (
                    <button
                      onClick={() =>
                        alert(
                          "🔒 Upgrade your subscription to unlock verified supplier contacts!"
                        )
                      }
                      className="rounded-xl bg-slate-100 py-2.5 text-center font-semibold text-slate-400 text-xs flex items-center justify-center gap-1 cursor-pointer hover:bg-slate-200 transition"
                    >
                      🏭 Supplier
                    </button>
                  ) : (
                    <a
                      href={product.supplier_url || product.product_url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl bg-emerald-600 py-2.5 text-center font-semibold text-white hover:bg-emerald-700 text-xs flex items-center justify-center transition"
                    >
                      Supplier
                    </a>
                  )}

                  {isFree ? (
                    <button
                      onClick={() =>
                        alert(
                          "🔒 Unlock AI Reports and deep insights by upgrading to Pro/Premium!"
                        )
                      }
                      className="rounded-xl bg-slate-100 py-2.5 text-center font-semibold text-slate-400 text-xs flex items-center justify-center gap-1 cursor-pointer hover:bg-slate-200 transition"
                    >
                      🔒 Report
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="rounded-xl bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-700 text-xs flex items-center justify-center transition"
                    >
                      🤖 AI Report
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isFree && filtered.length > 3 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/20 p-6 text-center min-h-[380px]">
            <span className="text-4xl mb-3">🔒</span>
            <h3 className="text-lg font-bold text-slate-900">
              Unlock {filtered.length - 3}+ More Hot Products
            </h3>
            <p className="mt-2 text-xs text-slate-500 max-w-xs leading-relaxed">
              Upgrade to Pro or Premium to view all curated winning products.
            </p>
            <a
              href="/pricing"
              className="mt-5 rounded-xl bg-indigo-600 px-6 py-2.5 font-semibold text-xs text-white hover:bg-indigo-700 transition"
            >
              🚀 Upgrade Plan
            </a>
          </div>
        )}
      </div>
    </section>
  );
}