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

export default function AICommandCenter() {
  const [prompt, setPrompt] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleAskAI() {
    if (!prompt.trim()) return;

    setLoading(true);

    try {
      const filters = await aiSearch(prompt);

      console.log("FILTERS:", filters);

      const products = await productSearch(filters);

      console.log("PRODUCTS:", products);

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
    <section className="mb-10 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl">

      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 p-8 text-white">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
              AI Copilot
            </span>

            <h2 className="mt-5 text-4xl font-bold">
              Ask TrendPilot AI
            </h2>

            <p className="mt-3 max-w-2xl text-purple-100">
              Find winning products, compare niches,
              discover profitable opportunities and receive
              AI-powered business recommendations.
            </p>

          </div>

          <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">

            <p className="text-sm text-purple-200">
              AI Status
            </p>

            <h3 className="mt-2 text-3xl font-bold text-green-300">
              ● Online
            </h3>

            <p className="mt-3 text-sm text-purple-100">
              GPT Connected
            </p>

          </div>

        </div>

      </div>

      <div className="p-8">

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

          <div className="mt-8 rounded-2xl border border-purple-100 bg-purple-50 p-6">

            <div className="animate-pulse space-y-4">

              <div className="h-5 w-48 rounded bg-purple-200" />

              <div className="h-4 w-full rounded bg-purple-100" />

              <div className="h-4 w-4/5 rounded bg-purple-100" />

            </div>

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

    </section>
  );
}