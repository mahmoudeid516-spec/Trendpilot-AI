"use client";

import { motion } from "framer-motion";
import { Sparkles, Radar, Zap, TrendingUp, ShieldCheck, ArrowUpRight } from "lucide-react";

type Metric = {
  label: string;
  value: string;
  change: string;
  changeColor: string;
};

type Props = {
  name: string;
  winningProductsCount?: number;
  marketTrendPercent?: number;
  aiAccuracyPercent?: number;
  onScanProducts?: () => void;
  onUpgrade?: () => void;
};

export default function DashboardHeader({
  name,
  winningProductsCount = 128,
  marketTrendPercent = 23,
  aiAccuracyPercent = 98.7,
  onScanProducts,
  onUpgrade,
}: Props) {
  const metrics: Metric[] = [
    {
      label: "Winning Products",
      value: winningProductsCount.toLocaleString(),
      change: "+12% from yesterday",
      changeColor: "text-indigo-400",
    },
    {
      label: "Market Trend",
      value: `+${marketTrendPercent}%`,
      change: "Bullish signal active",
      changeColor: "text-emerald-400",
    },
    {
      label: "AI Accuracy",
      value: `${aiAccuracyPercent}%`,
      change: "High confidence level",
      changeColor: "text-purple-400",
    },
  ];

  return (
    <header className="relative w-full overflow-hidden rounded-3xl bg-slate-950 p-1">
      {/* Background Glow Overlay */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6 rounded-[22px] bg-slate-900/60 p-6 sm:p-8 shadow-2xl backdrop-blur-xl border border-white/10">
        
        {/* Top Section: Title & Actions */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
                <Sparkles size={12} className="text-indigo-400" />
                AI Business Assistant
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Welcome back,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-purple-400">
                  {name}
                </span>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
                Market analysis is complete. Your dashboard is updated with today's high-potential opportunities.
              </p>
            </div>
          </div>

          {/* Action Buttons & Status */}
          <div className="flex flex-col items-start lg:items-end gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-emerald-400 font-medium backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]"></span>
              GPT + Scanner Online
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={onScanProducts}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:from-indigo-500 hover:to-indigo-400 active:scale-95 shadow-lg shadow-indigo-600/25"
              >
                <Radar size={16} />
                Scan Products
              </button>
              <button
                onClick={onUpgrade}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-95"
              >
                <Zap size={16} className="text-amber-400 fill-amber-400" />
                Upgrade
              </button>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-2">
          {metrics.map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group rounded-2xl border border-white/5 bg-white/5 p-5 transition-all duration-200 hover:bg-white/[0.08] hover:border-white/10"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-400">{metric.label}</p>
                <ArrowUpRight size={16} className="text-slate-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {metric.value}
              </h3>
              <div className={`mt-2 text-xs font-medium ${metric.changeColor}`}>
                {metric.change}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </header>
  );
}