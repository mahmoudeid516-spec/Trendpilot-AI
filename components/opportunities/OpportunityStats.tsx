"use client";

import { motion } from "framer-motion";
import { Layers3, ShieldCheck, Target, TrendingUp } from "lucide-react";
import type { OpportunityStats as OpportunityStatsType } from "../../types/opportunity";

type Props = {
  stats: OpportunityStatsType;
};

function toMoney(value: number): string {
  return `$${value.toFixed(2)}`;
}

const statStyles = [
  {
    label: "Products Scanned",
    key: "productsScanned",
    tone: "from-cyan-500 to-blue-600",
    icon: Layers3,
  },
  {
    label: "Average Opportunity",
    key: "averageOpportunity",
    tone: "from-violet-500 to-purple-600",
    icon: Target,
  },
  {
    label: "High Confidence Picks",
    key: "highConfidencePicks",
    tone: "from-emerald-500 to-teal-600",
    icon: ShieldCheck,
  },
  {
    label: "Average Profit",
    key: "averageProfit",
    tone: "from-amber-500 to-orange-600",
    icon: TrendingUp,
  },
] as const;

export default function OpportunityStats({ stats }: Props) {
  const valueMap: Record<(typeof statStyles)[number]["key"], string> = {
    productsScanned: String(stats.productsScanned),
    averageOpportunity: `${stats.averageOpportunity}%`,
    highConfidencePicks: String(stats.highConfidencePicks),
    averageProfit: toMoney(stats.averageProfit),
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.07,
          },
        },
      }}
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {statStyles.map((stat) => {
        const Icon = stat.icon;

        return (
          <motion.div
            key={stat.label}
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className={`rounded-2xl bg-gradient-to-br ${stat.tone} p-[1px] shadow-xl`}
          >
            <div className="rounded-2xl border border-white/70 bg-white/90 p-4">
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.13em] text-slate-600">
                <Icon size={16} aria-hidden="true" />
                {stat.label}
              </p>
              <p className="mt-2 text-3xl font-black text-slate-900">{valueMap[stat.key]}</p>
            </div>
          </motion.div>
        );
      })}
    </motion.section>
  );
}
