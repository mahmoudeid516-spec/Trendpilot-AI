"use client";

import { PRODUCT_COUNT_OPTIONS } from "../../lib/services/dataforseoProductSearch";

export type SearchPhase = "idle" | "searching" | "analyzing" | "done" | "error" | "empty";

type Props = {
  keyword: string;
  setKeyword: (value: string) => void;
  count: number;
  setCount: (value: number) => void;
  onSearch: () => void;
  phase: SearchPhase;
};

const PHASE_LABEL: Partial<Record<SearchPhase, string>> = {
  searching: "Finding products...",
  analyzing: "Analyzing market data and building AI report...",
};

export default function SearchControls({ keyword, setKeyword, count, setCount, onSearch, phase }: Props) {
  const isBusy = phase === "searching" || phase === "analyzing";

  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900">Product Research</h2>
      <p className="mt-1 text-sm text-gray-500">
        Search Amazon products by keyword and get a full AI-powered market report.
      </p>

      <div className="mt-5 flex flex-col gap-3 md:flex-row">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isBusy) onSearch();
          }}
          placeholder="e.g. wireless earbuds"
          className="flex-1 rounded-xl border px-5 py-3 outline-none focus:ring-2 focus:ring-purple-500"
        />

        <select
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          disabled={isBusy}
          className="rounded-xl border px-4 py-3 disabled:opacity-60"
        >
          {PRODUCT_COUNT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option} Products
            </option>
          ))}
        </select>

        <button
          onClick={onSearch}
          disabled={isBusy}
          className="rounded-xl bg-purple-600 px-8 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:bg-gray-400"
        >
          {isBusy ? "Working..." : "Analyze Products"}
        </button>
      </div>

      {isBusy && (
        <div className="mt-5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div className="h-2 w-full animate-pulse rounded-full bg-purple-600" />
          </div>
          <p className="mt-2 text-sm font-medium text-gray-500">{PHASE_LABEL[phase]}</p>
        </div>
      )}
    </div>
  );
}
