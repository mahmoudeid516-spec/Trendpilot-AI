"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Search, 
  Bot, 
  BarChart3, 
  CheckCircle2, 
  Activity, 
  TrendingUp,
  Zap 
} from "lucide-react";
import { getProfile } from "../../services/profile";

type Props = {
  totalProducts: number;
  winningProducts: number;
  onFindProducts?: () => void;
  onAskAI?: () => void;
  onViewAnalytics?: () => void;
};

export default function DashboardHero({
  totalProducts,
  winningProducts,
  onFindProducts,
  onAskAI,
  onViewAnalytics,
}: Props) {
  const [name, setName] = useState<string | null>(null);
  const [loadingName, setLoadingName] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getProfile();
        if (profile?.full_name) {
          setName(profile.full_name);
        } else {
          setName("User");
        }
      } catch {
        setName("User");
      } finally {
        setLoadingName(false);
      }
    }

    loadProfile();
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const statCards = [
    {
      label: "Business Health",
      value: "92%",
      status: "Excellent",
      statusColor: "text-emerald-300",
    },
    {
      label: "AI Reports",
      value: totalProducts.toLocaleString(),
      status: "Generated",
      statusColor: "text-amber-300",
    },
    {
      label: "Winning Products",
      value: winningProducts.toLocaleString(),
      status: "Available",
      statusColor: "text-cyan-300",
    },
    {
      label: "Success Rate",
      value: "96%",
      status: "AI Optimized",
      statusColor: "text-emerald-300",
    },
  ];

  return (
    <section className="mb-10 text-white">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-800 via-purple-700 to-indigo-800 p-6 sm:p-10 shadow-2xl border border-white/10">
        
        {/* Glow Effects Background */}
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          
          {/* Left Column: Greeting & Status */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs sm:text-sm font-semibold text-purple-100 backdrop-blur-md border border-white/10">
              <Sparkles size={16} className="text-amber-300 animate-pulse" />
              <span>AI Powered Ecommerce Dashboard</span>
            </div>

            <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
              👋 Welcome back,
              <br />
              {loadingName ? (
                <div className="mt-2 h-10 sm:h-12 w-48 rounded-xl bg-white/20 animate-pulse" />
              ) : (
                <span className="text-yellow-300 drop-shadow-sm">
                  {name}
                </span>
              )}
            </h1>

            <p className="mt-4 max-w-xl text-base sm:text-lg text-purple-100 leading-relaxed">
              Ready to discover your next winning product? Analyze competitors, generate high-converting AI marketing scripts, and scale your store faster.
            </p>

            {/* Sub Status Badges */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-md border border-white/10">
                <p className="text-[10px] font-bold uppercase tracking-wider text-purple-200">
                  Today
                </p>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  {today}
                </h3>
              </div>

              <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/15 px-4 py-2.5 backdrop-blur-md">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                  Winning Today
                </p>
                <h3 className="text-lg font-extrabold text-white mt-0.5">
                  {winningProducts}
                </h3>
              </div>

              <div className="rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-md border border-white/10 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-purple-200">
                    AI Status
                  </p>
                  <h3 className="text-xs font-bold text-emerald-300 mt-0.5">
                    GPT + Scanner Active
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:w-[420px] shrink-0">
            {statCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-3xl bg-white/10 p-5 backdrop-blur-md border border-white/10 hover:bg-white/15 transition duration-200"
              >
                <p className="text-xs font-medium text-purple-200">
                  {card.label}
                </p>
                <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
                  {card.value}
                </h2>
                <p className={`mt-2 text-xs font-semibold ${card.statusColor}`}>
                  {card.status}
                </p>
              </motion.div>
            ))}
          </div>

        </div>

        {/* Bottom Bar: Quick Actions */}
        <div className="relative z-10 mt-8 rounded-2xl bg-white/10 p-5 backdrop-blur-md border border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs font-bold uppercase tracking-wider text-purple-200 flex items-center gap-1.5">
            <Zap size={14} className="text-yellow-300 fill-yellow-300" />
            Quick Actions
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onFindProducts}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-purple-900 shadow-md transition hover:bg-purple-50 active:scale-95"
            >
              <Search size={15} />
              Find Products
            </button>

            <button
              onClick={onAskAI}
              className="flex items-center gap-2 rounded-xl bg-purple-500/80 hover:bg-purple-500 border border-purple-400/30 px-4 py-2.5 text-xs font-bold text-white transition active:scale-95"
            >
              <Bot size={15} />
              Ask AI Copilot
            </button>

            <button
              onClick={onViewAnalytics}
              className="flex items-center gap-2 rounded-xl bg-indigo-500/80 hover:bg-indigo-500 border border-indigo-400/30 px-4 py-2.5 text-xs font-bold text-white transition active:scale-95"
            >
              <BarChart3 size={15} />
              Analytics
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}