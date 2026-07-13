"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Props = {
  refreshKey: number;
};

type Stats = {
  totalProducts: number;
  shopifyProducts: number;
  avgScore: number;
  avgProfit: number;
};

export default function StatsCards({
  refreshKey,
}: Props) {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    shopifyProducts: 0,
    avgScore: 0,
    avgProfit: 0,
  });

  useEffect(() => {
    loadStats();
  }, [refreshKey]);

  async function loadStats() {
    const { data, error } = await supabase
      .from("products")
      .select("*");

    if (error || !data) return;

    const totalProducts = data.length;

    const shopifyProducts = data.filter(
      (p: any) => p.platform === "Shopify"
    ).length;

    const avgScore =
      totalProducts === 0
        ? 0
        : Math.round(
            data.reduce(
              (sum: number, p: any) =>
                sum + Number(p.ai_score || 0),
              0
            ) / totalProducts
          );

    const avgProfit =
      totalProducts === 0
        ? 0
        : Math.round(
            data.reduce(
              (sum: number, p: any) =>
                sum + Number(p.profit || 0),
              0
            ) / totalProducts
          );

    setStats({
      totalProducts,
      shopifyProducts,
      avgScore,
      avgProfit,
    });
  }

  const cards = [
    {
      title: "Products",
      value: stats.totalProducts,
      icon: "📦",
      color: "from-blue-500 to-cyan-500",
      subtitle: "Database",
    },
    {
      title: "Shopify",
      value: stats.shopifyProducts,
      icon: "🛒",
      color: "from-green-500 to-emerald-500",
      subtitle: "Winning Products",
    },
    {
      title: "AI Score",
      value: `${stats.avgScore}%`,
      icon: "🤖",
      color: "from-purple-500 to-indigo-500",
      subtitle: "Average",
    },
    {
      title: "Avg Profit",
      value: `$${stats.avgProfit}`,
      icon: "💰",
      color: "from-orange-500 to-red-500",
      subtitle: "Per Product",
    },
  ];

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 my-8">
      {cards.map((card) => (
        <div
          key={card.title}
          className="relative overflow-hidden rounded-3xl bg-white p-7 shadow-lg border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
        >
          <div
            className={`absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br ${card.color} opacity-10`}
          />

          <div className="relative z-10">
            <div
              className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${card.color} text-3xl shadow-lg`}
            >
              {card.icon}
            </div>

            <p className="mt-6 text-sm font-medium uppercase tracking-wide text-gray-500">
              {card.title}
            </p>

            <h2 className="mt-2 text-4xl font-extrabold text-gray-900">
              {card.value}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {card.subtitle}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}