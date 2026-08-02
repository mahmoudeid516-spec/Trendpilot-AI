"use client";

import { motion } from "framer-motion";
import { RefreshCw, Sparkles } from "lucide-react";

type Props = {
  onRefresh: () => void;
  refreshing: boolean;
};

export default function OpportunityHeader({ onRefresh, refreshing }: Props) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-3xl border border-white/75 bg-white/90 p-6 shadow-[0_40px_110px_-72px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:p-8"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full bg-violet-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-cyan-400/14 blur-3xl" />

      <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
            <Sparkles size={13} aria-hidden="true" />
            AI Opportunity Feed
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Today&apos;s AI Opportunities
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            AI-ranked products with the highest selling potential.
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          aria-label="Refresh rankings"
          className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={15}
            aria-hidden="true"
            className={refreshing ? "animate-spin" : ""}
          />
          {refreshing ? "Refreshing..." : "Refresh Rankings"}
        </button>
      </div>
    </motion.header>
  );
}
