"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

type SearchBarProps = {
  search: string;
  setSearch: (value: string) => void;
  platform: string;
  setPlatform: (value: string) => void;
  onSearch: (search: string, platform: string) => void;
};

const RECENT_SEARCHES_KEY = "trendpilot:recent-searches";

export default function SearchBar({
  search,
  setSearch,
  platform,
  setPlatform,
  onSearch,
}: SearchBarProps) {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const popularSearches = useMemo(
    () => [
      "wireless pet camera",
      "portable blender",
      "home workout bands",
      "kitchen organization set",
    ],
    []
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      onSearch(search, platform);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [search, platform, onSearch]);

  useEffect(() => {
    let timeoutId: number | undefined;
    const deferRecentSearchesUpdate = (next: string[]) => {
      timeoutId = window.setTimeout(() => {
        setRecentSearches(next);
      }, 0);
    };

    const raw = window.localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) {
      return () => {
        if (timeoutId) {
          window.clearTimeout(timeoutId);
        }
      };
    }

    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        const next = parsed
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean)
          .slice(0, 6);
        deferRecentSearchesUpdate(next);
      } else {
        deferRecentSearchesUpdate([]);
      }
    } catch {
      deferRecentSearchesUpdate([]);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  function pushRecent(value: string) {
    const term = value.trim();
    if (!term) return;

    setRecentSearches((prev) => {
      const next = [term, ...prev.filter((item) => item.toLowerCase() !== term.toLowerCase())].slice(0, 6);
      try {
        window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
      } catch {
        // Ignore quota/security errors to keep the dashboard interactive.
      }
      return next;
    });
  }

  function runSearch(value: string, selectedPlatform: string) {
    pushRecent(value);
    onSearch(value, selectedPlatform);
  }

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            aria-label="Search products"
            placeholder="Search products, categories, or intent..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <select
          aria-label="Filter by platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="All">All Platforms</option>
          <option value="Shopify">Shopify</option>
          <option value="Amazon">Amazon</option>
          <option value="TikTok Shop">TikTok Shop</option>
          <option value="AliExpress">AliExpress</option>
        </select>

        <button
          type="button"
          onClick={() => runSearch(search, platform)}
          className="rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          Update Table
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Popular Searches</p>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setSearch(item);
                  runSearch(item, platform);
                }}
                className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-700"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Recent Searches</p>
          {recentSearches.length === 0 ? (
            <p className="text-xs text-slate-500">Your recent queries will appear here.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((item, index) => (
                <button
                  key={`${item}-${index}`}
                  type="button"
                  onClick={() => {
                    setSearch(item);
                    runSearch(item, platform);
                  }}
                  className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-700"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
