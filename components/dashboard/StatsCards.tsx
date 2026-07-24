"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "../../lib/supabase";

interface DatabaseProduct {
  platform?: string;
  ai_score?: number | string;
  profit?: number | string;
}

interface Stats {
  totalProducts: number;
  shopifyProducts: number;
  avgScore: number;
  avgProfit: number;
}

type Props = {
  refreshKey: number;
};

export default function StatsCards({ refreshKey }: Props) {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    shopifyProducts: 0,
    avgScore: 0,
    avgProfit: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadStats();
  }, [refreshKey]);

  async function loadStats() {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("platform, ai_score, profit");

    if (error || !data) {
      setLoading(false);
      return;
    }

    const typedData = data as DatabaseProduct[];
    const totalProducts = typedData.length;

    const shopifyProducts = typedData.filter((p) => p.platform === "Shopify").length;

    const avgScore =
      totalProducts === 0
        ? 0
        : Math.round(
            typedData.reduce((sum, p) => sum + Number(p.ai_score || 0), 0) / totalProducts
          );

    const avgProfit =
      totalProducts === 0
        ? 0
        : Math.round(
            typedData.reduce((sum, p) => sum + Number(p.profit || 0), 0) / totalProducts
          );

    setStats({
      totalProducts,
      shopifyProducts,
      avgScore,
      avgProfit,
    });
    setLoading(false);
  }

  const kpiData = useMemo(
    () => [
      {
        title: "Total Products",
        value: stats.totalProducts.toString(),
        icon: "📦",
        trend: "↗ +12%",
        trendColor: "text-emerald-500",
        color: "bg-blue-500",
      },
      {
        title: "Shopify Items",
        value: stats.shopifyProducts.toString(),
        icon: "🛒",
        trend: "↗ +5%",
        trendColor: "text-emerald-500",
        color: "bg-emerald-500",
      },
      {
        title: "Avg AI Score",
        value: `${stats.avgScore}%`,
        icon: "🤖",
        trend: "Stable",
        trendColor: "text-blue-500",
        color: "bg-indigo-500",
      },
      {
        title: "Avg Profit",
        value: `$${stats.avgProfit}`,
        icon: "💰",
        trend: "↗ +8%",
        trendColor: "text-emerald-500",
        color: "bg-orange-500",
      },
    ],
    [stats]
  );

  if (loading) {
    return (
      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 my-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-40 rounded-3xl bg-gray-100 animate-pulse border border-gray-200" />
        ))}
      </section>
    );
  }

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 my-8">
      {kpiData.map((card) => (
        <div
          key={card.title}
          className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 hover:border-indigo-100"
        >
          <div className="flex justify-between items-start mb-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
            >
              <span className="text-xl">{card.icon}</span>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full bg-gray-50 ${card.trendColor}`}>
              {card.trend}
            </span>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-400 group-hover:text-gray-600 transition-colors">
              {card.title}
            </p>
            <h2 className="mt-1 text-3xl font-extrabold text-gray-900 tracking-tight">
              {card.value}
            </h2>
          </div>
          
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gray-50 overflow-hidden">
            <div className={`h-full ${card.color} opacity-20`} style={{ width: '100%' }} />
          </div>
        </div>
      ))}
    </section>
  );
}