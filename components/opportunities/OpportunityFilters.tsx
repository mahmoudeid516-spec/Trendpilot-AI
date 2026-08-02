"use client";

import { Filter, Search } from "lucide-react";
import type { Competition, Marketplace, Opportunity, OpportunityFiltersState } from "../../types/opportunity";

type Props = {
  filters: OpportunityFiltersState;
  categories: string[];
  onChange: (next: OpportunityFiltersState) => void;
};

type Option<T extends string> = {
  label: string;
  value: T;
};

const marketplaceOptions: Option<"All" | Marketplace>[] = [
  { label: "All", value: "All" },
  { label: "Amazon", value: "Amazon" },
  { label: "Shopify", value: "Shopify" },
  { label: "TikTok Shop", value: "TikTok Shop" },
  { label: "Etsy", value: "Etsy" },
  { label: "Walmart", value: "Walmart" },
];

const competitionOptions: Option<"All" | Competition>[] = [
  { label: "All", value: "All" },
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];

export default function OpportunityFilters({ filters, categories, onChange }: Props) {
  const categoryOptions: Option<string>[] = [
    { label: "All", value: "All" },
    ...categories.map((category) => ({ label: category, value: category })),
  ];

  return (
    <section className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-[0_22px_70px_-55px_rgba(15,23,42,0.42)] backdrop-blur-xl sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <Filter size={16} className="text-slate-600" aria-hidden="true" />
        <h2 className="text-lg font-bold text-slate-900">Filters</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <FilterSelect
          label="Marketplace"
          value={filters.marketplace}
          onChange={(value) => onChange({ ...filters, marketplace: value as "All" | Marketplace })}
          options={marketplaceOptions}
        />

        <FilterSelect
          label="Category"
          value={filters.category}
          onChange={(value) => onChange({ ...filters, category: value })}
          options={categoryOptions}
        />

        <FilterSelect
          label="Competition"
          value={filters.competition}
          onChange={(value) => onChange({ ...filters, competition: value as "All" | Competition })}
          options={competitionOptions}
        />

        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
          <label htmlFor="min-opportunity" className="text-xs font-semibold uppercase tracking-[0.13em] text-slate-600">
            Minimum Score
          </label>
          <div className="mt-3 flex items-center gap-3">
            <input
              id="min-opportunity"
              type="range"
              min={70}
              max={95}
              value={filters.minScore}
              onChange={(event) =>
                onChange({
                  ...filters,
                  minScore: Number(event.target.value),
                })
              }
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200"
              aria-label="Minimum opportunity score"
            />
            <span className="min-w-[42px] rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-700">
              {filters.minScore}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
          <label htmlFor="opportunity-search" className="text-xs font-semibold uppercase tracking-[0.13em] text-slate-600">
            Search
          </label>
          <div className="relative mt-2">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            <input
              id="opportunity-search"
              type="text"
              value={filters.search}
              onChange={(event) =>
                onChange({
                  ...filters,
                  search: event.target.value,
                })
              }
              placeholder="Search products"
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              aria-label="Search products"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterSelect<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (next: T) => void;
  options: Option<T>[];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
      <label className="text-xs font-semibold uppercase tracking-[0.13em] text-slate-600">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        aria-label={label}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
