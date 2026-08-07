"use client";
import { getRecommendation } from "@/lib/ai/recommendationEngine";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Bot,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Heart,
  PackageSearch,
  Package,
  ShoppingBag,
  Store,
  Tv,
} from "lucide-react";

export type Product = {
  id: number;
  image: string;
  name: string;
  platform: string;
  ai_score: number;
  trend_score: number;
  profit?: number;
  buy_price?: number;
  selling_price?: number;
  supplier: string;
  supplier_url: string;
  product_url: string;
  competition: string;
  country: string;
  category: string;
  description?: string;
  ai_reason?: string;
  opportunity_score?: number;
  ai_verdict?: string;
success_probability?: number;
};

type Props = {
  search: string;
  platform: string;
  refreshKey: number;
  onTopProductChange?: (product: Product | null) => void;
  onSelectProduct: (product: Product) => void;
};

const PAGE_SIZE = 8;

export default function ProductsTable({
  search,
  platform,
  refreshKey,
  onTopProductChange,
  onSelectProduct,
}: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"ai" | "opportunity" | "profit" | "trend" | "competition">("ai");

  const loadProducts = async () => {
  setLoading(true);

  try {
    const endpoint = search?.trim()
      ? `/api/discover?search=${encodeURIComponent(search)}`
      : "/api/live-market";

    const response = await fetch(endpoint, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to load products");
    }

    const data = await response.json();

const cleanProducts = Array.isArray(data)
  ? data.filter((p) => p && p.name)
  : [];

setProducts(cleanProducts);
  } catch (error) {
    console.error(error);
    setProducts([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
  loadProducts();
}, [refreshKey, search]);

  const filtered = useMemo(() => {
    const safeProducts = products.filter(
  (p) => p && p.name && p.ai_score != null
);
    const deduped = new Map<string, Product>();

    for (const item of safeProducts) {
      const dedupeKey = `${(item.name || "").trim().toLowerCase()}::${(item.platform || "").trim().toLowerCase()}`;
      if (!deduped.has(dedupeKey)) {
        deduped.set(dedupeKey, item);
      }
    }

    const base = Array.from(deduped.values());

    const filteredBase = base.filter((p) => {
      const productName = (p.name ?? "").toLowerCase();
      const searchText = (search ?? "").toLowerCase();

      const matchSearch = searchText === "" || productName.includes(searchText);
      const matchPlatform = platform === "All" || (p.platform ?? "") === platform;

      return matchSearch && matchPlatform;
    });

    return filteredBase.sort((a, b) => {
      const aiDiff = Number(b.ai_score || 0) - Number(a.ai_score || 0);

      if (sortBy === "ai") return aiDiff;
      if (sortBy === "opportunity") {
        return Number(b.opportunity_score ?? b.ai_score ?? 0) - Number(a.opportunity_score ?? a.ai_score ?? 0);
      }
      if (sortBy === "profit") return Number(b.profit || 0) - Number(a.profit || 0);
      if (sortBy === "trend") return Number(b.trend_score || 0) - Number(a.trend_score || 0);

      const competitionRank = (value: string) => {
        if (value === "Low") return 3;
        if (value === "Medium") return 2;
        if (value === "High") return 1;
        return 0;
      };

      return competitionRank(b.competition) - competitionRank(a.competition) || aiDiff;
    });
  }, [products, search, platform, sortBy]);

  useEffect(() => {
    onTopProductChange?.(filtered[0] ?? null);
  }, [filtered, onTopProductChange]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  function competitionColor(level: string) {
    switch (level) {
      case "Low":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";
      case "Medium":
        return "border-amber-200 bg-amber-50 text-amber-700";
      case "High":
        return "border-rose-200 bg-rose-50 text-rose-700";
      default:
        return "border-slate-200 bg-slate-100 text-slate-700";
    }
  }

  function scoreColor(score: number) {
    if (score >= 80) return "from-emerald-600 to-sky-600";
    if (score >= 60) return "from-sky-600 to-indigo-600";
    if (score >= 40) return "from-amber-600 to-orange-600";
    return "from-rose-600 to-pink-600";
  }

  function platformBadge(platformName: string) {
    if (platformName === "Shopify") {
      return { icon: Store, label: "Shopify" };
    }
    if (platformName === "Amazon") {
      return { icon: ShoppingBag, label: "Amazon" };
    }
    if (platformName === "TikTok Shop") {
      return { icon: Tv, label: "TikTok" };
    }

    return { icon: Package, label: platformName || "Unknown" };
  }

  function toggleFavorite(productId: number) {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }

  return (
    <motion.section
      className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Product Opportunity Table</h2>
          <p className="mt-1 text-sm text-slate-600">Sorted by AI score with trend and margin context for quick decisions.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
            <Bot size={13} />
            Showing {paginated.length} of {filtered.length}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700"
          >
            <option value="ai">Sort: AI Score</option>
            <option value="opportunity">Sort: Opportunity</option>
            <option value="profit">Sort: Profit</option>
            <option value="trend">Sort: Trend</option>
            <option value="competition">Sort: Competition</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="max-h-[760px] overflow-auto">
          <table className="w-full min-w-[1080px] table-fixed">
            <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur">
              <tr className="border-b border-slate-200 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                <th className="w-[36%] px-4 py-4">Product</th>
                <th className="w-[11%] px-4 py-4">Marketplace</th>
                <th className="w-[9%] px-4 py-4">AI Score</th>
                <th className="w-[10%] px-4 py-4">Competition</th>
                <th className="w-[10%] px-4 py-4">Est. Profit</th>
                <th className="w-[9%] px-4 py-4">Trend</th>
                <th className="w-[8%] px-4 py-4">Country</th>
                <th className="w-[7%] px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading
                ? Array.from({ length: 6 }).map((_, skeletonIdx) => (
                    <tr key={`skeleton-${skeletonIdx}`} className="border-b border-slate-200 bg-white">
                      <td className="px-4 py-4">
                        <div className="flex animate-pulse items-center gap-4">
                          <div className="h-28 w-28 rounded-2xl bg-slate-200" />
                          <div className="w-full space-y-2">
                            <div className="h-4 w-2/3 rounded bg-slate-200" />
                            <div className="h-3 w-1/3 rounded bg-slate-200" />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4"><div className="h-7 w-24 animate-pulse rounded-full bg-slate-200" /></td>
                      <td className="px-4 py-4"><div className="h-12 w-12 animate-pulse rounded-full bg-slate-200" /></td>
                      <td className="px-4 py-4"><div className="h-7 w-20 animate-pulse rounded-full bg-slate-200" /></td>
                      <td className="px-4 py-4"><div className="h-5 w-24 animate-pulse rounded bg-slate-200" /></td>
                      <td className="px-4 py-4"><div className="h-8 w-20 animate-pulse rounded bg-slate-200" /></td>
                      <td className="px-4 py-4"><div className="h-4 w-16 animate-pulse rounded bg-slate-200" /></td>
                      <td className="px-4 py-4"><div className="ml-auto h-8 w-20 animate-pulse rounded bg-slate-200" /></td>
                    </tr>
                  ))
                : null}

              {paginated.map((product, idx) => {
                const platformInfo = platformBadge(product.platform);
                const PlatformIcon = platformInfo.icon;
                const opportunity = Math.round(product.opportunity_score ?? product.ai_score ?? 0);
                const recommendation = getRecommendation(
  product.ai_score,
  opportunity,
  product.profit ?? 0,
  product.competition
);

                return (
                  <motion.tr
                    key={product.id}
                    className={`group border-b border-slate-200 text-sm transition-colors duration-150 hover:bg-indigo-50/45 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.35 }}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <Image
                          src={product.image || "https://picsum.photos/220"}
                          alt={product.name}
                          width={120}
                          height={120}
                          loading="lazy"
                          sizes="120px"
                          unoptimized
                          className="h-28 w-28 rounded-2xl border border-slate-200 object-cover"
                        />

                        <div className="min-w-0">
                          <p className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900">{product.name}</p>
                          <p className="mt-1 text-xs text-slate-500">{product.category}</p>

                          <p
  className={`mt-1 text-xs font-semibold ${
    recommendation === "Strong Buy"
      ? "text-emerald-600"
      : recommendation === "Worth Testing"
      ? "text-amber-600"
      : "text-rose-600"
  }`}
>
  {recommendation}
</p>

                        <p className="mt-1 text-xs font-semibold text-emerald-600">
                       {product.ai_verdict}
                        </p>

                        <p className="text-[11px] text-slate-500">
                        Success {product.success_probability}%
                         </p>

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-sky-100 bg-sky-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-700">
                              Opportunity {opportunity}
                            </span>
                            <span className="rounded-full border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-indigo-700">
                              {product.trend_score >= 70 ? "Trending" : "Stable"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-700">
                        <PlatformIcon size={13} />
                        {platformInfo.label}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white">
                        <span className={`bg-gradient-to-r bg-clip-text text-sm font-bold text-transparent ${scoreColor(Number(product.ai_score || 0))}`}>
                          {product.ai_score}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${competitionColor(product.competition)}`}>
                        {product.competition}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        ${Number(product.profit || 0).toLocaleString()} profit
                      </span>
                      <p className="mt-2 text-[11px] text-slate-500">Buy ${Number(product.buy_price || 0)} • Sell ${Number(product.selling_price || 0)}</p>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex h-8 items-end gap-1">
                        {[26, 34, 42, 56, 68].map((height, trendIdx) => (
                          <span
                            key={trendIdx}
                            className="w-1.5 rounded-t-sm bg-gradient-to-t from-indigo-500 to-sky-400"
                            style={{ height: `${Math.max(16, height + (product.trend_score % 18) - 8)}%` }}
                          />
                        ))}
                      </div>
                    </td>

                    

                    <td className="px-4 py-4 text-xs text-slate-700">{product.country || "-"}</td>

                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2 opacity-70 transition-opacity duration-200 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => toggleFavorite(product.id)}
                          className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                            favorites.includes(product.id)
                              ? "border-rose-200 bg-rose-50 text-rose-700"
                              : "border-slate-300 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-700"
                          }`}
                          title="Favorite"
                        >
                          <Heart size={14} className={favorites.includes(product.id) ? "fill-current" : ""} />
                        </button>

                        <a
                          href={product.product_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-sky-200 bg-sky-50 text-sky-700 transition hover:border-sky-300"
                          title="Open product"
                        >
                          <ExternalLink size={14} />
                        </a>

                        <button
  type="button"
  onClick={() => {
    console.log("Clicked:", product);
    onSelectProduct(product);
  }}
  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700"
>
  <FileText size={14} />
</button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>

          {!loading && filtered.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500">
                <PackageSearch className="h-7 w-7" />
              </div>
              <p className="text-lg font-semibold text-slate-900">No products found</p>
              <p className="mt-2 text-sm text-slate-600">Adjust your query or platform filters to find new opportunities.</p>
              <button
                type="button"
                onClick={() => {
                  setPage(1);
                }}
                className="mt-4 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                Reset view
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          Page {currentPage} of {totalPages}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={14} />
            Prev
          </button>

          <div className="hidden items-center gap-1 sm:flex">
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
              const pageNumber = idx + 1;
              const isActive = pageNumber === currentPage;

              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={`h-8 w-8 rounded-lg border text-xs font-semibold transition ${
                    isActive
                      ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                      : "border-slate-300 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-700"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </motion.section>
  );
}
