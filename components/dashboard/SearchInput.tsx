"use client";

import { AudioLines, Sparkles } from "lucide-react";

type Props = {
  prompt: string;
  loading: boolean;
  setPrompt: (value: string) => void;
  onSearch: () => void;
};

export default function SearchInput({
  prompt,
  loading,
  setPrompt,
  onSearch,
}: Props) {
  return (
    <div className="mt-6">
      <div className="relative flex-1">
        <Sparkles className="pointer-events-none absolute left-5 top-6 h-5 w-5 text-indigo-400" />

        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch();
            }
          }}
          placeholder="Describe a product opportunity, market, or pricing target..."
          className="w-full rounded-3xl border border-slate-300 bg-white py-5 pl-14 pr-40 text-base font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
        />

        <button
          type="button"
          className="absolute right-32 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 transition hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          title="Voice search"
        >
          <AudioLines className="h-4 w-4" />
        </button>

        <button
          onClick={onSearch}
          disabled={loading}
          className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>
      </div>
    </div>
  );
}
