"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ensureUniqueProductIds } from "../../lib/services/productIdentity";
import { supabase } from "../../lib/supabase";
import type { Product } from "../../types/Product";
import Card from "../ui/Card";
import ProgressBar from "../ui/ProgressBar";
import { buttonClass } from "../ui/button";
import { toneForScore } from "../ui/tone";

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

  function competitionClasses(level: string) {
    switch (level) {
      case "Low":
        return "bg-[var(--accent-positive-soft)] text-[var(--accent-positive)]";
      case "Medium":
        return "bg-[var(--accent-warning-soft)] text-[var(--accent-warning)]";
      case "High":
        return "bg-[var(--accent-risk-soft)] text-[var(--accent-risk)]";
      default:
        return "bg-[var(--surface-muted)] text-[var(--ink-500)]";
    }
  }

  // table-layout: fixed + an explicit colgroup replaces the browser's
  // default auto layout, which was distributing the table's leftover
  // width unpredictably (mostly into the Product and Actions columns)
  // and pulling Actions away from the metric columns next to it. Product
  // is the only column left unsized (`auto`) so it -- and only it --
  // absorbs any extra width; every metric/action column keeps a fixed,
  // compact width so they always sit directly next to each other.
  const stickyProductCell = "sticky left-0 z-10 bg-[var(--surface-card)] group-hover:bg-[var(--surface-muted)]";

  return (
    <Card padding="none">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] table-fixed text-sm">
          <colgroup>
            <col />
            <col style={{ width: "88px" }} />
            <col style={{ width: "124px" }} />
            <col style={{ width: "64px" }} />
            <col style={{ width: "96px" }} />
            <col style={{ width: "88px" }} />
            <col style={{ width: "252px" }} />
          </colgroup>

          <thead>
            <tr className="border-b border-[var(--border-subtle)] text-left text-xs font-semibold uppercase tracking-wide text-[var(--ink-400)]">
              <th className={`px-4 py-4 font-semibold ${stickyProductCell} border-r border-[var(--border-subtle)]`}>
                Product
              </th>
              <th className="px-2 py-4 font-semibold">Platform</th>
              <th className="px-2 py-4 font-semibold">AI Score</th>
              <th className="px-2 py-4 font-semibold">Trend</th>
              <th className="px-2 py-4 font-semibold">Competition</th>
              <th className="px-2 py-4 font-semibold">Profit</th>
              <th className="px-4 py-4 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {stableDisplayedProducts.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <p className="text-2xl">📭</p>
                  <p className="mt-3 text-lg font-semibold text-[var(--ink-900)]">Your saved library is empty</p>
                  <p className="mt-1 text-[var(--ink-500)]">
                    Products you search for above and save will show up here for quick access later.
                  </p>
                </td>
              </tr>
            )}

            {stableDisplayedProducts.map((product) => (
              <tr
                key={String(product.id)}
                className="group border-b border-[var(--border-subtle)] transition-colors hover:bg-[var(--surface-muted)]"
              >
                <td className={`px-4 py-3.5 ${stickyProductCell} border-r border-[var(--border-subtle)]`}>
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={product.image || "https://picsum.photos/200"}
                        alt={product.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-[var(--ink-900)]" title={product.name}>
                        {product.name}
                      </h3>
                      <p className="truncate text-xs text-[var(--ink-400)]">{product.category}</p>
                    </div>
                  </div>
                </td>

                <td className="truncate px-2 py-3.5 text-xs font-medium text-[var(--ink-700)]">{product.platform}</td>

                <td className="px-2 py-3.5">
                  <ProgressBar value={product.ai_score} tone={toneForScore(product.ai_score)} />
                  <p className="mt-1.5 text-xs font-bold text-[var(--accent-positive)]">{product.ai_score}%</p>
                </td>

                <td className="px-2 py-3.5 text-sm font-bold text-[var(--accent-data)]">{product.trend_score}</td>

                <td className="px-2 py-3.5">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${competitionClasses(product.competition)}`}
                  >
                    {product.competition}
                  </span>
                </td>

                <td className="px-2 py-3.5 text-sm font-bold text-[var(--ink-900)]">${product.profit}</td>

                <td className="px-4 py-3.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <a
                      href={product.product_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonClass({ tone: "data", variant: "outline", size: "sm", className: "px-2.5" })}
                    >
                      View
                    </a>

                    <a
                      href={product.supplier_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonClass({ tone: "positive", variant: "outline", size: "sm", className: "px-2.5" })}
                    >
                      Supplier
                    </a>

                    <button
                      onClick={() => onSelectProduct(product)}
                      className={buttonClass({ tone: "ai", size: "sm", className: "px-2.5" })}
                    >
                      Report
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
