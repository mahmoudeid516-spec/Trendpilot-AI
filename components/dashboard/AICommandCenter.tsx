"use client";

import { useState } from "react";

import { aiSearch } from "../../services/aiSearch";
import { productSearch } from "../../services/productSearch";
import {
  getBestProduct,
  scoreProducts,
} from "../../services/businessAdvisor";

import type { Product } from "../../types/Product";

import SearchInput from "./SearchInput";
import SuggestionChips from "./SuggestionChips";
import AIRecommendation from "./AIRecommendation";
import SearchResults from "./SearchResults";
import { Search, Sparkles } from "lucide-react";

export default function AICommandCenter() {
  const [prompt, setPrompt] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAskAI() {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");

    try {
      const filters = await aiSearch(prompt);

      const products = await productSearch(filters);

      // const scoredProducts = scoreProducts(products);

setResults(products);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const bestProduct = getBestProduct(results);

  const priorityPrompts = [
    "portable blender under $30 low competition",
    "high margin pet accessories shopify",
    "tiktok home gadgets rising trend",
  ];

  return (
    <section className="overflow-hidden rounded-[32px] border border-white/70 bg-white/88 shadow-[0_24px_65px_-45px_rgba(15,23,42,0.35)] backdrop-blur-xl">
      <div className="p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Primary Workflow
            </p>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              AI Search
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Describe your target market and let TrendPilot AI rank the best products to test next.
            </p>
          </div>

          <span className="inline-flex items-center gap-2 self-start rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-indigo-700 shadow-sm">
            <Sparkles size={13} />
            GPT connected
          </span>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Starter prompts</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {priorityPrompts.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPrompt(item)}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <SearchInput
          prompt={prompt}
          setPrompt={setPrompt}
          loading={loading}
          onSearch={handleAskAI}
        />

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
          <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            <Search size={13} /> Suggested prompts
          </p>
          <SuggestionChips
            onSelect={setPrompt}
          />
        </div>

        {loading && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="animate-pulse space-y-4">
              <div className="h-5 w-48 rounded bg-slate-200" />
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-4/5 rounded bg-slate-200" />
            </div>
          </div>
        )}

        {!loading && error ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">
            {error}
          </div>
        ) : null}

        {!loading && bestProduct && (
          <>
            <div className="mt-8">
              <AIRecommendation
                product={bestProduct}
              />
            </div>
            <div className="mt-8">
              <SearchResults
                results={results}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}