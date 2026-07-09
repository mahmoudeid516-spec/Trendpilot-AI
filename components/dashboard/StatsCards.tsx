"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Props = {
  refreshKey: number;
};

export default function StatsCards({
  refreshKey,
}: Props) {
  const [totalProducts, setTotalProducts] = useState(0);
  const [avgScore, setAvgScore] = useState(0);
  const [avgProfit, setAvgProfit] = useState(0);
  const [shopifyProducts, setShopifyProducts] = useState(0);

  useEffect(() => {
    loadStats();
  }, [refreshKey]);

  async function loadStats() {
    const { data, error } = await supabase
      .from("products")
      .select("*");

    if (error || !data) return;

    setTotalProducts(data.length);

    const shopify = data.filter(
      (p: any) => p.platform === "Shopify"
    ).length;

    setShopifyProducts(shopify);

    if (data.length === 0) {
      setAvgScore(0);
      setAvgProfit(0);
      return;
    }

    const score =
      data.reduce(
        (sum: number, p: any) => sum + Number(p.ai_score || 0),
        0
      ) / data.length;

    const profit =
      data.reduce(
        (sum: number, p: any) => sum + Number(p.profit || 0),
        0
      ) / data.length;

    setAvgScore(Math.round(score));
    setAvgProfit(Math.round(profit));
  }

  const cards = [
    {
      title: "Products",
      value: totalProducts,
      icon: "📦",
      color: "text-blue-600",
    },
    {
      title: "Shopify",
      value: shopifyProducts,
      icon: "🛒",
      color: "text-green-600",
    },
    {
      title: "AI Score",
      value: `${avgScore}%`,
      icon: "🤖",
      color: "text-purple-600",
    },
    {
      title: "Avg Profit",
      value: `$${avgProfit}`,
      icon: "💰",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="grid md:grid-cols-4 gap-6 my-8">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="text-4xl mb-3">
            {card.icon}
          </div>

          <p className="text-gray-500">
            {card.title}
          </p>

          <h2
            className={`text-4xl font-bold mt-2 ${card.color}`}
          >
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}