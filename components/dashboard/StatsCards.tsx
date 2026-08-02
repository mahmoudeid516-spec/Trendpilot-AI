"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { motion } from "framer-motion";
import { BarChart3, Box, CircleDollarSign, ShieldCheck } from "lucide-react";

type Props = {
  refreshKey: number;
};

type Stats = {
  totalProducts: number;
  shopifyProducts: number;
  avgScore: number;
  avgProfit: number;
};

type ProductRow = {
  platform: string | null;
  ai_score: number | string | null;
  profit: number | string | null;
};

export default function StatsCards({
  refreshKey,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    shopifyProducts: 0,
    avgScore: 0,
    avgProfit: 0,
  });

  const loadStats = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*");

    if (error || !data) {
      setLoading(false);
      return;
    }

    const rows = data as ProductRow[];

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

    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadStats();
  }, [refreshKey]);

  const [animatedValues, setAnimatedValues] = useState({
    totalProducts: 0,
    shopifyProducts: 0,
    avgScore: 0,
    avgProfit: 0,
  });

  useEffect(() => {
    let frame = 0;
    const duration = 900;
    const start = performance.now();

    const step = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimatedValues({
        totalProducts: Math.floor(stats.totalProducts * eased),
        shopifyProducts: Math.floor(stats.shopifyProducts * eased),
        avgScore: Math.floor(stats.avgScore * eased),
        avgProfit: Math.floor(stats.avgProfit * eased),
      });

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    };

    frame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [stats]);

  const cards = [
    {
      title: "Tracked Products",
      value: animatedValues.totalProducts,
      icon: Box,
      tint: "text-indigo-700",
      iconBg: "bg-indigo-50",
      subtitle: "Live products across all sources",
      delta: "+12.4%",
      suffix: "",
      trendTone: "text-emerald-700",
      colSpan: "lg:col-span-4",
    },
    {
      title: "Shopify Qualified",
      value: animatedValues.shopifyProducts,
      icon: ShieldCheck,
      tint: "text-sky-700",
      iconBg: "bg-sky-50",
      subtitle: "High-signal listings",
      delta: "+8.2%",
      suffix: "",
      trendTone: "text-emerald-700",
      colSpan: "lg:col-span-2",
    },
    {
      title: "Average AI Score",
      value: animatedValues.avgScore,
      icon: BarChart3,
      tint: "text-violet-700",
      iconBg: "bg-violet-50",
      subtitle: "Model confidence level",
      delta: "+3.1%",
      suffix: "%",
      trendTone: "text-emerald-700",
      colSpan: "lg:col-span-3",
    },
    {
      title: "Avg Profit",
      value: animatedValues.avgProfit,
      icon: CircleDollarSign,
      tint: "text-emerald-700",
      iconBg: "bg-emerald-50",
      subtitle: "Estimated gross margin",
      delta: "+6.9%",
      suffix: "$",
      trendTone: "text-emerald-700",
      colSpan: "lg:col-span-3",
    },
  ];

  if (loading) {
    return (
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={`stats-skeleton-${idx}`}
            className={`animate-pulse rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-[0_18px_44px_-32px_rgba(15,23,42,0.3)] ${
              idx === 0 ? "lg:col-span-4" : idx === 1 ? "lg:col-span-2" : "lg:col-span-3"
            }`}
          >
            <div className="h-4 w-28 rounded bg-slate-200" />
            <div className="mt-4 h-10 w-24 rounded bg-slate-200" />
            <div className="mt-4 h-3 w-40 rounded bg-slate-200" />
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const displayValue = card.title === "Avg Profit" ? `$${card.value.toLocaleString()}` : `${card.value.toLocaleString()}${card.suffix}`;

        return (
        <motion.div
          key={card.title}
          className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-[0_18px_44px_-32px_rgba(15,23,42,0.3)] transition-colors hover:border-indigo-200 ${card.colSpan}`}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: idx * 0.06, duration: 0.35 }}
          whileHover={{ y: -3 }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.06),transparent_42%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg} ${card.tint} shadow-sm`}>
                <Icon size={20} />
              </div>
              <span className={`rounded-full border border-emerald-100 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] shadow-sm ${card.trendTone}`}>
                {card.delta}
              </span>
            </div>

            <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              {card.title}
            </p>

            <h2 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">
              {displayValue}
            </h2>

            <p className="mt-2 text-xs font-medium text-slate-500">
              {card.subtitle}
            </p>
          </div>
        </motion.div>
      );})}
    </section>
  );
}