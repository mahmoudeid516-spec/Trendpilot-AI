"use client";

import { useState } from "react";
import { Flag, Funnel, Layers, Store } from "lucide-react";

type FiltersProps = {
  platform: string;
  setPlatform: (value: string) => void;
};

export default function Filters({
  platform,
  setPlatform,
}: FiltersProps) {
  const [category, setCategory] = useState("All");
  const [competition, setCompetition] = useState("All");
  const [country, setCountry] = useState("All");

  const platforms = ["All", "Shopify", "Amazon", "TikTok Shop", "AliExpress"];
  const categories = ["All", "Beauty", "Fitness", "Pets", "Home"];
  const competitions = ["All", "Low", "Medium", "High"];
  const countries = ["All", "United States", "United Kingdom", "Germany", "France"];

  function pillStyle(active: boolean) {
    if (active) {
      return "border-indigo-200 bg-indigo-50 text-indigo-700";
    }

    return "border-slate-300 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-700";
  }

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
        <Funnel size={13} />
        Refine Results
      </div>

      <div className="space-y-4">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            <Store size={13} /> Platform
          </p>
          <div className="flex flex-wrap gap-2">
            {platforms.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPlatform(item)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${pillStyle(platform === item)} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            <Layers size={13} /> Category
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${pillStyle(category === item)} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            <Funnel size={13} /> Competition
          </p>
          <div className="flex flex-wrap gap-2">
            {competitions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCompetition(item)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${pillStyle(competition === item)} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            <Flag size={13} /> Country
          </p>
          <div className="flex flex-wrap gap-2">
            {countries.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCountry(item)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${pillStyle(country === item)} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
