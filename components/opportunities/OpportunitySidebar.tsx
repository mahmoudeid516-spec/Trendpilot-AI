"use client";

import { motion } from "framer-motion";
import { BarChart3, Brain, Gauge, Lightbulb, Target, TrendingUp } from "lucide-react";
import type { OpportunitySummary } from "../../types/opportunity";

type Props = {
  summary: OpportunitySummary;
};

export default function OpportunitySidebar({ summary }: Props) {
  return (
    <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
      <SidebarPanel
        title="AI Summary"
        icon={<Brain size={16} className="text-indigo-700" />}
        content={<p className="text-sm leading-7 text-slate-700">{summary.aiSummary}</p>}
      />

      <SidebarPanel
        title="Top Categories"
        icon={<BarChart3 size={16} className="text-cyan-700" />}
        content={
          <div className="space-y-2">
            {summary.topCategories.length > 0 ? (
              summary.topCategories.map((entry) => (
                <div
                  key={entry.name}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <span className="font-medium text-slate-700">{entry.name}</span>
                  <span className="font-semibold text-slate-900">{entry.count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-600">No data available.</p>
            )}
          </div>
        }
      />

      <SidebarPanel
        title="Best Marketplace Today"
        icon={<Target size={16} className="text-violet-700" />}
        content={<p className="text-sm font-semibold text-slate-800">{summary.bestMarketplaceToday}</p>}
      />

      <SidebarPanel
        title="Highest Margin Product"
        icon={<TrendingUp size={16} className="text-emerald-700" />}
        content={
          summary.highestMarginProduct ? (
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">{summary.highestMarginProduct.name}</p>
              <p className="text-sm text-slate-600">
                ${summary.highestMarginProduct.estimatedProfit.toFixed(2)} estimated profit
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-600">No data available.</p>
          )
        }
      />

      <SidebarPanel
        title="Highest Confidence Product"
        icon={<Gauge size={16} className="text-blue-700" />}
        content={
          summary.highestConfidenceProduct ? (
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">{summary.highestConfidenceProduct.name}</p>
              <p className="text-sm text-slate-600">{summary.highestConfidenceProduct.confidence}% confidence</p>
            </div>
          ) : (
            <p className="text-sm text-slate-600">No data available.</p>
          )
        }
      />

      <SidebarPanel
        title="Quick Tips"
        icon={<Lightbulb size={16} className="text-amber-700" />}
        content={
          <ul className="space-y-2">
            {summary.quickTips.map((tip) => (
              <li key={tip} className="rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2 text-sm leading-6 text-amber-900">
                {tip}
              </li>
            ))}
          </ul>
        }
      />
    </aside>
  );
}

function SidebarPanel({
  title,
  icon,
  content,
}: {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <motion.section
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="rounded-3xl border border-white/70 bg-white/90 p-4 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur"
    >
      <h3 className="inline-flex items-center gap-2 text-sm font-bold text-slate-900">
        {icon}
        {title}
      </h3>
      <div className="mt-3">{content}</div>
    </motion.section>
  );
}
