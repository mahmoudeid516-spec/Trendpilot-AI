"use client";

import { PRODUCT_COUNT_OPTIONS } from "../../lib/services/productCount";

export type SearchPhase = "idle" | "searching" | "analyzing" | "done" | "error" | "empty";

type Props = {
  keyword: string;
  setKeyword: (value: string) => void;
  count: number;
  setCount: (value: number) => void;
  onSearch: () => void;
  phase: SearchPhase;
};

// These two labels map 1:1 to the two real network requests this panel
// makes (search, then analysis) -- no fabricated intermediate stages.
const PHASE_LABEL: Partial<Record<SearchPhase, string>> = {
  searching: "Searching for products...",
  analyzing: "Analyzing market and building AI report...",
};

const PIPELINE_STEPS = ["Search", "Real Products", "Opportunity Score", "Analysis"];

export default function SearchControls({ keyword, setKeyword, count, setCount, onSearch, phase }: Props) {
  const isBusy = phase === "searching" || phase === "analyzing";

  return (
    <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
        🔎 Product Search Engine
      </span>

      <h2 className="mt-3 text-2xl font-bold text-gray-900">Find Winning Products</h2>
      <p className="mt-1 text-sm text-gray-500">
        Search real products and identify the best opportunities to sell.
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs font-medium text-gray-400">
        {PIPELINE_STEPS.map((step, i) => (
          <span key={step} className="flex items-center gap-1.5">
            <span className="rounded-full bg-gray-100 px-2.5 py-1">{step}</span>
            {i < PIPELINE_STEPS.length - 1 && <span>&rarr;</span>}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 md:flex-row">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isBusy) onSearch();
          }}
          placeholder="e.g. wireless earbuds, smart watch..."
          className="flex-1 rounded-xl border px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="flex items-center gap-2 rounded-xl border px-4 py-3 text-sm text-gray-500">
          Analyze
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            disabled={isBusy}
            className="font-semibold text-gray-900 outline-none disabled:opacity-60"
          >
            {PRODUCT_COUNT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option} products
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={onSearch}
          disabled={isBusy}
          className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isBusy ? "Working..." : "Search Products"}
        </button>
      </div>

      {isBusy && (
        <div className="mt-5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div className="h-2 w-full animate-pulse rounded-full bg-blue-600" />
          </div>
          <p className="mt-2 text-sm font-medium text-gray-500">{PHASE_LABEL[phase]}</p>
        </div>
      )}
    </div>
  );
}
