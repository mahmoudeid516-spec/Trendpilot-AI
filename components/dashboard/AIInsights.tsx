"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Trophy, 
  BrainCircuit, 
  TrendingUp, 
  Rocket, 
  Lightbulb, 
  Activity, 
  ChevronRight 
} from "lucide-react";
  import type { Product } from "../../types/Product";

type Props = {
  products: Product[];

};

export default function AIInsights({ products }: Props) {
  const { avgAI, avgTrend, winningProducts, bestProduct } = useMemo(() => {
    const avgAI = products.length > 0
      ? Math.round(products.reduce((sum, p) => sum + Number(p.ai_score || 0), 0) / products.length)
      : 0;

    const avgTrend = products.length > 0
      ? Math.round(products.reduce((sum, p) => sum + Number(p.trend_score || 0), 0) / products.length)
      : 0;

    const winningProducts = products.filter((p) => Number(p.ai_score || 0) >= 90).length;
    const bestProduct = [...products].sort((a, b) => Number(b.ai_score || 0) - Number(a.ai_score || 0))[0];

    return { avgAI, avgTrend, winningProducts, bestProduct };
  }, [products]);

  const insights = [
    {
      title: "Top AI Product",
      description: bestProduct
        ? `${bestProduct.name} has the highest AI Score (${bestProduct.ai_score}%) and should be your first product to analyze.`
        : "Search for products to receive AI recommendations.",
      icon: Trophy,
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "AI Performance",
      description:
        avgAI >= 90
          ? `Excellent! Average AI Score is ${avgAI}%. These products have strong selling potential.`
          : `Average AI Score is ${avgAI}%. Consider searching for stronger products.`,
      icon: BrainCircuit,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Market Trend",
      description:
        avgTrend >= 80
          ? `Trend Score is ${avgTrend}%. Demand is currently very strong.`
          : `Trend Score is ${avgTrend}%. Keep monitoring before launching.`,
      icon: TrendingUp,
      color: "from-purple-500 to-indigo-500",
    },
    {
      title: "Winning Products",
      description: `${winningProducts} products currently have an AI Score above 90.`,
      icon: Rocket,
      color: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <section className="mt-12 space-y-8">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            Executive AI Insights
          </motion.h2>
          <p className="mt-2 text-slate-500 text-lg">Live intelligence derived from your product pipeline.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-bold text-slate-700">Live System Status</span>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Avg AI Score", value: `${avgAI}%`, icon: Activity },
          { label: "Market Trend", value: `${avgTrend}%`, icon: TrendingUp },
          { label: "Winners", value: winningProducts, icon: Trophy },
          { label: "Active Products", value: products.length, icon: BrainCircuit },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors"
          >
            <div className="flex items-center justify-between mb-2 text-slate-400">
              <stat.icon size={18} />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Insights Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {insights.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className={`absolute right-0 top-0 h-32 w-32 bg-gradient-to-br ${item.color} opacity-[0.03] rounded-bl-[100px]`} />
            
            <div className="flex gap-6 items-start">
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg`}>
                <item.icon size={28} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-slate-600">{item.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Recommendation Banner */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="flex gap-4 items-center">
          <div className="p-3 bg-white/10 rounded-xl">
            <Lightbulb className="text-amber-400" size={32} />
          </div>
          <div>
            <h4 className="font-bold text-lg">AI Recommendation</h4>
            <p className="text-slate-400">
              {winningProducts > 0 
                ? "Focus advertising budget on the highest scoring assets first." 
                : "Analyze more products to uncover market opportunities."}
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-500 transition-colors">
          View Detailed Reports <ChevronRight size={18} />
        </button>
      </motion.div>
    </section>
  );
}