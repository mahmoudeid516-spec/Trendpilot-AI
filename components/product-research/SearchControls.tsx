"use client";

import { Search } from "lucide-react";
import { PRODUCT_COUNT_OPTIONS } from "../../lib/services/productCount";
import Card from "../ui/Card";
import { buttonClass } from "../ui/button";

export type SearchPhase = "idle" | "searching" | "analyzing" | "done" | "error" | "empty";

type Props = {
  keyword: string;
  setKeyword: (value: string) => void;
  count: number;
  setCount: (value: number) => void;
  platform: string;
  setPlatform: (value: string) => void;
  onSearch: () => void;
  phase: SearchPhase;
};

const PLATFORM_OPTIONS = [
  { value: "Amazon", label: "Amazon" },
  { value: "AliExpress", label: "AliExpress" },
  { value: "All", label: "All Sources" },
];

// These two labels map 1:1 to the two real network requests this panel
// makes (search, then analysis) -- no fabricated intermediate stages.
const PHASE_LABEL: Partial<Record<SearchPhase, string>> = {
  searching: "Searching for real products...",
  analyzing: "Analyzing market and building AI report...",
};

const PIPELINE_STEPS = ["Search", "Real Products", "Opportunity Score", "Market Analysis"];

export default function SearchControls({
  keyword,
  setKeyword,
  count,
  setCount,
  platform,
  setPlatform,
  onSearch,
  phase,
}: Props) {
  const isBusy = phase === "searching" || phase === "analyzing";

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-xs font-medium text-[var(--ink-400)]">
        {PIPELINE_STEPS.map((step, i) => (
          <span key={step} className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-[var(--surface-muted)] px-2.5 py-1">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent-data-soft)] text-[10px] font-bold text-[var(--accent-data)]">
                {i + 1}
              </span>
              {step}
            </span>
            {i < PIPELINE_STEPS.length - 1 && <span className="text-[var(--ink-400)]">&rarr;</span>}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 md:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-400)]" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isBusy) onSearch();
            }}
            placeholder="e.g. wireless earbuds, smart watch..."
            className="w-full rounded-xl border border-[var(--border-subtle)] py-3 pl-10 pr-4 text-[var(--ink-900)] outline-none tp-focus-ring placeholder:text-[var(--ink-400)]"
          />
        </div>

        <label className="flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] px-4 py-3 text-sm text-[var(--ink-500)]">
          Source
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            disabled={isBusy}
            className="font-semibold text-[var(--ink-900)] outline-none disabled:opacity-60"
          >
            {PLATFORM_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] px-4 py-3 text-sm text-[var(--ink-500)]">
          Analyze
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            disabled={isBusy}
            className="font-semibold text-[var(--ink-900)] outline-none disabled:opacity-60"
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
          className={buttonClass({ tone: "data", className: "px-8 py-3" })}
        >
          {isBusy ? "Working..." : "Search Products"}
        </button>
      </div>

      {isBusy && (
        <div className="mt-5">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--accent-data-soft)]">
            <div className="h-full w-full animate-pulse rounded-full bg-[var(--accent-data)]" />
          </div>
          <p className="mt-2 text-sm font-medium text-[var(--ink-500)]">{PHASE_LABEL[phase]}</p>
        </div>
      )}
    </Card>
  );
}
