"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Sparkles, ShieldCheck, Trophy, Target, Package } from "lucide-react";
import type { Product } from "../../types/Product";

type Props = {
  products: Product[];
};

const COLOR_PALETTE = [
  { stroke: "#6366f1", fill: "#6366f1", bg: "bg-indigo-500", text: "text-indigo-600" },
  { stroke: "#10b981", fill: "#10b981", bg: "bg-emerald-500", text: "text-emerald-600" },
  { stroke: "#f59e0b", fill: "#f59e0b", bg: "bg-amber-500", text: "text-amber-600" },
];

export default function ProductComparison({ products }: Props) {
  const topProducts = useMemo(() => products.slice(0, 3), [products]);
  
  const winner = useMemo(() => {
    if (!topProducts.length) return null;
    return [...topProducts].sort((a, b) => (b.ai_score ?? 0) - (a.ai_score ?? 0))[0];
  }, [topProducts]);

  if (products.length < 2) return null;

  const chartData = useMemo(() => {
    return [
      { metric: "AI Score", full: 100, ...Object.fromEntries(topProducts.map((p, i) => [`p${i}`, p.ai_score ?? 0])) },
      { metric: "Opp. Score", full: 100, ...Object.fromEntries(topProducts.map((p, i) => [`p${i}`, Math.round(p.opportunity_score ?? 0)])) },
    ];
  }, [topProducts]);

  return (
    <div className="mt-10 space-y-8">
      {/* Premium Hero Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> AI Intelligence
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          AI Product Comparison
        </h2>
        <p className="text-sm text-slate-500">
          Compare top-performing products with advanced predictive analytics.
        </p>
      </div>

      {/* Product Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topProducts.map((p, index) => {
          const isWinner = winner?.id === p.id;
          const colorTheme = COLOR_PALETTE[index % COLOR_PALETTE.length];

          return (
            <motion.div
              key={p.id}
              whileHover={{ y: -4 }}
              className={`group relative bg-white rounded-3xl p-6 border transition-all duration-300 shadow-sm hover:shadow-xl ${
                isWinner ? "border-amber-300 ring-2 ring-amber-400/20" : "border-slate-200/80"
              }`}
            >
              {isWinner && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-400 text-white px-4 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1 shadow-md shadow-amber-500/20 tracking-wide">
                  <Trophy className="w-3.5 h-3.5" /> BEST CHOICE
                </div>
              )}

              {/* Product Thumbnail / Avatar */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200/60 overflow-hidden flex items-center justify-center shrink-0">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600`}>
                  {p.platform || "Marketplace"}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 truncate mb-1" title={p.name}>
                {p.name}
              </h3>
              <p className="text-xs text-slate-400 mb-5">
                Market Index: <span className="font-semibold text-slate-600">{p.category || "General"}</span>
              </p>

              <div className="space-y-3.5 pt-2 border-t border-slate-100">
                <MetricBar label="AI Score" value={p.ai_score ?? 0} color={colorTheme.bg} />
                <MetricBar label="Opportunity Score" value={Math.round(p.opportunity_score ?? 0)} color="bg-emerald-500" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Comparison Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radar Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" /> Market Radar Analysis
            </h4>
            <div className="flex items-center gap-3 text-xs font-medium">
              {topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLOR_PALETTE[i].stroke }} />
                  <span className="text-slate-600 truncate max-w-[80px]">{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData}>
                <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", color: "#fff", border: "none", fontSize: "12px" }} 
                />
                {topProducts.map((_, i) => (
                  <Radar 
                    key={i} 
                    dataKey={`p${i}`} 
                    stroke={COLOR_PALETTE[i].stroke} 
                    fill={COLOR_PALETTE[i].fill} 
                    fillOpacity={0.25} 
                  />
                ))}
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Recommendation Summary */}
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border border-slate-800 shadow-xl">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4">
              <ShieldCheck className="w-4 h-4 text-indigo-400" /> AI Executive Summary
            </div>
            <h4 className="font-extrabold text-2xl text-white tracking-tight mb-3">
              AI Recommendation
            </h4>

            {winner && (
              <p className="text-slate-300 text-sm leading-relaxed">
                Based on our predictive models and market algorithms,{" "}
                <span className="text-amber-300 font-bold">{winner.name}</span> demonstrates the highest potential profitability. 
                {winner.competition && (
                  <> With a competition index rated as <span className="text-indigo-300 font-semibold">{winner.competition}</span>,</>
                )}{" "}
                we strongly recommend prioritizing this product for your upcoming inventory and advertising campaigns.
              </p>
            )}
          </div>

          {winner && (
            <div className="mt-6 pt-6 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Top Asset Confidence</p>
                <p className="text-2xl font-black text-emerald-400 mt-0.5">{winner.ai_score ?? 0}%</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Opportunity Index</p>
                <p className="text-2xl font-black text-indigo-400 mt-0.5">{Math.round(winner.opportunity_score ?? 0)}/100</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-semibold mb-1.5 text-slate-700">
        <span>{label}</span>
        <span className="font-mono font-bold">{value}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full ${color}`} 
        />
      </div>
    </div>
  );
}