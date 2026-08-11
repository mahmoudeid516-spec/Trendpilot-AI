"use client";

import { useState } from "react";
import ProductComparison from "./ProductComparison";
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
import Card from "../ui/Card";
import Eyebrow from "../ui/Eyebrow";

export default function AICommandCenter() {
  const [prompt, setPrompt] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasAsked, setHasAsked] = useState(false);

  async function handleAskAI() {
    if (!prompt.trim()) return;

    setLoading(true);
    setHasAsked(true);

    try {
      const filters = await aiSearch(prompt);

      const products = await productSearch(filters);

      const scoredProducts = scoreProducts(products);

      setResults(scoredProducts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const bestProduct = getBestProduct(results);

  return (
    <Card padding="none">
      <div className="flex flex-col gap-4 border-b border-[var(--border-subtle)] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="min-w-0">
          <Eyebrow icon="🧠" label="AI Strategic Advisor" tone="ai" />
          <h2 className="mt-3 break-words text-2xl font-bold text-[var(--ink-900)] sm:text-[28px]">
            Ask TrendPilot AI
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--ink-500)]">
            Get market insights, product ideas, and strategic recommendations.
            Ask a question the way you&apos;d ask a research analyst &mdash;
            not a product database.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-start rounded-full border border-[var(--accent-positive)]/25 bg-[var(--accent-positive-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-positive)] sm:self-auto">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-positive)]" />
          AI Online &middot; GPT Connected
        </div>
      </div>

      <div className="p-5 sm:p-8">

        <SearchInput
          prompt={prompt}
          setPrompt={setPrompt}
          loading={loading}
          onSearch={handleAskAI}
        />

        <div className="mt-6">
          <SuggestionChips
            onSelect={setPrompt}
          />
        </div>

        {loading && (
          <div className="mt-8 rounded-2xl border border-[var(--accent-ai)]/15 bg-[var(--accent-ai-soft)] p-6">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent-ai)]" />
              <p className="text-sm font-semibold text-[var(--accent-ai)]">
                Reasoning through your market question&hellip;
              </p>
            </div>

            <div className="mt-4 animate-pulse space-y-3">
              <div className="h-3 w-2/3 rounded bg-white/70" />
              <div className="h-3 w-full rounded bg-white/70" />
              <div className="h-3 w-4/5 rounded bg-white/70" />
            </div>
          </div>
        )}

        {!loading && hasAsked && results.length === 0 && (
          <div className="mt-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-8 text-center">
            <p className="text-2xl">🧭</p>
            <p className="mt-2 font-semibold text-[var(--ink-900)]">No matching opportunities found</p>
            <p className="mt-1 text-sm text-[var(--ink-500)]">
              Try rephrasing your question, or ask about a broader market or category.
            </p>
          </div>
        )}

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

    </Card>
  );
}
