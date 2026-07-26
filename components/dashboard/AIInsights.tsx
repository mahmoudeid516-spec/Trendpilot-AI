import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bot,
  Compass,
  Globe2,
  Lightbulb,
  TrendingUp,
} from "lucide-react";

export default function AIInsights() {
  const briefItems = [
    {
      title: "Today&apos;s Opportunity",
      text: "Travel Blender Pro remains the top opportunity with high demand velocity, low creative fatigue and margin room above 35%.",
      icon: Lightbulb,
      tone: "text-indigo-700",
    },
    {
      title: "Market Alert",
      text: "Phone accessory keywords are overbidding today. Pause new spend in saturated accessory clusters until CPM normalizes.",
      icon: AlertTriangle,
      tone: "text-amber-700",
    },
    {
      title: "Trending Category",
      text: "Portable kitchen and hydration products keep accelerating across TikTok Shop and Shopify, especially short-form ad formats.",
      icon: TrendingUp,
      tone: "text-emerald-700",
    },
    {
      title: "Best Country",
      text: "United Kingdom is currently leading conversion efficiency for utility products, with lower competition pressure than US.",
      icon: Globe2,
      tone: "text-sky-700",
    },
    {
      title: "Seasonal Insight",
      text: "Back-to-routine demand is lifting repeat-use products. Bundle-friendly SKUs should outperform impulse-only products this month.",
      icon: Compass,
      tone: "text-violet-700",
    },
  ];

  return (
    <section>
      <motion.div
        className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.35 }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(99,102,241,0.08),transparent_35%)]" />

        <div className="relative z-10">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">AI Daily Brief</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Strategic Briefing</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">Generated from live demand, competition, pricing and margin signals.</p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
              <Bot size={14} />
              AI Active
            </div>
          </div>

          <div className="space-y-3">
            {briefItems.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className={item.tone} />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">{item.title}</p>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{item.text}</p>
                </article>
              );
            })}
          </div>

          <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-700">AI recommendation</p>
            <p className="mt-2 text-sm text-indigo-900">
              Prioritize products with AI scores above 90 and medium competition, then launch short-form creative tests within 48 hours.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}