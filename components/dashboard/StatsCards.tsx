"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import StatTile from "../ui/StatTile";
import type { Tone } from "../ui/tone";

type Props = {
  refreshKey: number;
};

type Stats = {
  totalProducts: number;
  shopifyProducts: number;
  avgScore: number;
  avgProfit: number;
};

type ProductStatsRow = {
  platform?: string;
  ai_score?: number;
  profit?: number;
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
    async function loadStats() {
      const { data, error } = await supabase
        .from("products")
        .select("*");

      if (error || !data) return;

      const rows = data as ProductStatsRow[];

      const totalProducts = rows.length;

      const shopifyProducts = rows.filter(
        (p) => p.platform === "Shopify"
      ).length;

      const avgScore =
        totalProducts === 0
          ? 0
          : Math.round(
              rows.reduce(
                (sum: number, p) =>
                  sum + Number(p.ai_score || 0),
                0
              ) / totalProducts
            );

      const avgProfit =
        totalProducts === 0
          ? 0
          : Math.round(
              rows.reduce(
                (sum: number, p) =>
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

    void loadStats();
  }, [refreshKey]);

  const cards: Array<{ title: string; value: string | number; icon: string; tone: Tone; subtitle: string }> = [
    { title: "Products", value: stats.totalProducts, icon: "📦", tone: "data", subtitle: "In your database" },
    { title: "Shopify", value: stats.shopifyProducts, icon: "🛒", tone: "positive", subtitle: "Winning products" },
    { title: "AI Score", value: `${stats.avgScore}%`, icon: "🤖", tone: "ai", subtitle: "Average confidence" },
    { title: "Avg Profit", value: `$${stats.avgProfit}`, icon: "💰", tone: "warning", subtitle: "Per product" },
  ];

  return (
    <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {cards.map((card) => (
        <StatTile key={card.title} {...card} />
      ))}
    </section>
  );
}
