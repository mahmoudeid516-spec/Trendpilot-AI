"use client";

import { useState } from "react";
import type { Product } from "../../types/Product";
import type { ProductAnalysisResponse, ProductWithAnalysis } from "../../types/analysis";
import { DEFAULT_PRODUCT_COUNT } from "../../lib/services/dataforseoProductSearch";
import { productSearch } from "../../services/productSearch";
import { importProducts } from "../../lib/importers/importProducts";
import { ensureUniqueProductIds } from "../../lib/services/productIdentity";
import { explainProduct } from "../../lib/scoring/explainProduct";
import { selectTopPicks } from "../../lib/scoring/topPicks";
import SearchControls, { type SearchPhase } from "./SearchControls";
import MarketOverview from "./MarketOverview";
import AIMarketReport from "./AIMarketReport";
import TopPicks from "./TopPicks";
import ProductGrid from "./ProductGrid";

type Props = {
  onProductsSaved?: () => void;
};

// Used only if the /api/product-analysis request itself fails outright
// (network error, 500) -- not the normal "OpenAI unavailable" case, which
// that endpoint already handles server-side. This keeps deterministic
// scoring/top-picks/per-product analysis working even if the analysis
// endpoint can't be reached at all, since these are pure functions with no
// server-only dependencies.
function buildLocalFallback(keyword: string, products: Product[], reason: string): ProductAnalysisResponse {
  const productsWithAnalysis: ProductWithAnalysis[] = products.map((product) => ({
    ...product,
    analysis: explainProduct(product),
  }));

  return {
    keyword,
    products_analyzed: products.length,
    ai_available: false,
    summary: {
      verdict: "AI Analysis Unavailable",
      overall_score: 0,
      demand: "Medium",
      competition: "Medium",
      profitability: "Medium",
      risk: "Medium",
      explanation: `Products loaded successfully, but AI market analysis could not be reached (${reason}). Product scoring, Top Picks and per-product analysis below are still real, computed data.`,
    },
    market_analysis: {
      overview: "Not available.",
      demand_analysis: "Not available.",
      competition_analysis: "Not available.",
      trend_analysis: "Not available.",
      profitability_analysis: "Not available.",
      positioning: "Not available.",
      risk_analysis: "Not available.",
      opportunity_analysis: "Not available.",
      strategy: "Not available.",
      recommended_product_profile: "Not available.",
      final_recommendation: "Not available.",
    },
    top_picks: selectTopPicks(products),
    products: productsWithAnalysis,
  };
}

export default function ProductResearchPanel({ onProductsSaved }: Props) {
  const [keyword, setKeyword] = useState("");
  const [count, setCount] = useState(DEFAULT_PRODUCT_COUNT);
  const [phase, setPhase] = useState<SearchPhase>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<ProductAnalysisResponse | null>(null);
  const [requestedCount, setRequestedCount] = useState(DEFAULT_PRODUCT_COUNT);
  const [searchedAt, setSearchedAt] = useState<Date | null>(null);

  async function handleSearch() {
    if (phase === "searching" || phase === "analyzing") return;

    const trimmed = keyword.trim();
    if (!trimmed) {
      setErrorMessage("Please enter a keyword to search.");
      setPhase("error");
      return;
    }

    setErrorMessage(null);
    setResult(null);
    setPhase("searching");
    setRequestedCount(count);

    let products: Product[];
    try {
      const raw = await productSearch({ keyword: trimmed, count });
      products = ensureUniqueProductIds(raw as Product[]);
    } catch (error) {
      console.error("Product search failed:", error);
      setErrorMessage(error instanceof Error ? error.message : "Product search failed.");
      setPhase("error");
      return;
    }

    if (products.length === 0) {
      setPhase("empty");
      setSearchedAt(new Date());
      return;
    }

    // Persist to Supabase, same as the previous search flow -- keeps the
    // saved-products library and dashboard stats in sync.
    importProducts(products).catch((error) => {
      console.error("Failed to save searched products:", error);
    });
    onProductsSaved?.();

    setPhase("analyzing");

    try {
      const response = await fetch("/api/product-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: trimmed, products }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || `Analysis request failed (HTTP ${response.status})`);
      }

      const analysis: ProductAnalysisResponse = await response.json();
      setResult(analysis);
    } catch (error) {
      console.error("Product analysis request failed, using local fallback:", error);
      const reason = error instanceof Error ? error.message : "unknown error";
      setResult(buildLocalFallback(trimmed, products, reason));
    }

    setSearchedAt(new Date());
    setPhase("done");
  }

  return (
    <div className="space-y-8">
      <SearchControls
        keyword={keyword}
        setKeyword={setKeyword}
        count={count}
        setCount={setCount}
        onSearch={handleSearch}
        phase={phase}
      />

      {phase === "error" && errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          <p className="font-semibold">Search failed</p>
          <p className="mt-1">{errorMessage}</p>
        </div>
      )}

      {phase === "empty" && (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-500">
          <p className="text-lg font-semibold text-gray-700">No products found</p>
          <p className="mt-1">Try a different or broader keyword.</p>
        </div>
      )}

      {phase === "done" && result && (
        <>
          <MarketOverview
            keyword={result.keyword}
            requestedCount={requestedCount}
            returnedCount={result.products_analyzed}
            searchedAt={searchedAt}
            summary={result.summary}
            aiAvailable={result.ai_available}
          />

          <AIMarketReport marketAnalysis={result.market_analysis} aiAvailable={result.ai_available} />

          <TopPicks picks={result.top_picks} />

          <ProductGrid products={result.products} />
        </>
      )}
    </div>
  );
}
