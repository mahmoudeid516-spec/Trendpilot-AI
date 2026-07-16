"use client";

import { useState } from "react";

type AICommandCenterProps = {
  onAnalyze: (
    searchText: string,
    selectedPlatform: string
  ) => Promise<void>;
};

export default function AICommandCenter({
  onAnalyze,
}: AICommandCenterProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      // استخدم "all" كمنصة افتراضية إذا لم يكن هذا الكمبوننت يحتوي على اختيار منصة
      await onAnalyze(query, "all");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl border border-slate-700">
      <h2 className="text-xl font-bold mb-4">Ask AI Insight</h2>

      <p className="text-slate-400 text-sm mb-6">
        Get a professional breakdown of product profitability and market
        trends.
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter product name..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={handleAction}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl font-bold transition disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Ask AI"}
        </button>
      </div>
    </div>
  );
}