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
      tone: "text-violet-700",
      accent: "border-l-violet-500",
      glow: "from-violet-500/30",
    },
    {
      title: "Market Alert",
      text: "Phone accessory keywords are overbidding today. Pause new spend in saturated accessory clusters until CPM normalizes.",
      icon: AlertTriangle,
      tone: "text-amber-700",
      accent: "border-l-amber-500",
      glow: "from-amber-400/30",
    },
    {
      title: "Trending Category",
      text: "Portable kitchen and hydration products keep accelerating across TikTok Shop and Shopify, especially short-form ad formats.",
      icon: TrendingUp,
      tone: "text-emerald-700",
      accent: "border-l-emerald-500",
      glow: "from-emerald-400/30",
    },
    {
      title: "Best Country",
      text: "United Kingdom is currently leading conversion efficiency for utility products, with lower competition pressure than US.",
      icon: Globe2,
      tone: "text-sky-700",
      accent: "border-l-sky-500",
      glow: "from-sky-400/30",
    },
    {
      title: "Seasonal Insight",
      text: "Back-to-routine demand is lifting repeat-use products. Bundle-friendly SKUs should outperform impulse-only products this month.",
      icon: Compass,
      tone: "text-violet-700",
      accent: "border-l-fuchsia-500",
      glow: "from-fuchsia-400/30",
    },
  ];

  const categoryMap: Record<string, { category: string; badge: string; tone: string; border: string; glow: string }> = {
    "Today&apos;s Opportunity": {
      category: "Opportunity",
      badge: "High Opportunity",
      tone: "text-emerald-700",
      border: "border-l-emerald-500",
      glow: "from-emerald-500/30",
    },
    "Market Alert": {
      category: "Risk",
      badge: "Watch Risk",
      tone: "text-rose-700",
      border: "border-l-rose-500",
      glow: "from-rose-500/30",
    },
    "Trending Category": {
      category: "Growth",
      badge: "Strong Demand",
      tone: "text-cyan-700",
      border: "border-l-cyan-500",
      glow: "from-cyan-500/30",
    },
    "Best Country": {
      category: "Competition",
      badge: "Competitive",
      tone: "text-orange-700",
      border: "border-l-orange-500",
      glow: "from-orange-500/30",
    },
    "Seasonal Insight": {
      category: "Marketing",
      badge: "Campaign Window",
      tone: "text-violet-700",
      border: "border-l-violet-500",
      glow: "from-violet-500/30",
    },
  };

  return (
    <section>
      <motion.div
        className="relative overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-br from-white via-slate-50/95 to-indigo-50/70 p-6 shadow-[0_36px_110px_-68px_rgba(15,23,42,0.45)] sm:p-7 lg:p-8"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.35 }}
      >
        <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-cyan-500/12 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full bg-violet-500/12 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(34,211,238,0.12),transparent_35%),radial-gradient(circle_at_100%_0%,rgba(139,92,246,0.12),transparent_35%)]" />

        <div className="relative z-10">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Executive Briefing</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Executive Insights</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">AI-generated strategic observations for this product.</p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700 shadow-sm">
              <Bot size={14} aria-hidden="true" />
              AI Active
            </div>
          </div>

          <motion.div
            className="grid gap-4 md:grid-cols-2"
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
          >
            {briefItems.map((item, index) => {
              const Icon = item.icon;
              const visual = categoryMap[item.title] ?? {
                category: "Growth",
                badge: "Strategic Insight",
                tone: item.tone,
                border: item.accent,
                glow: item.glow,
              };

              return (
                <motion.article
                  key={item.title}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  whileHover={{ y: -6 }}
                  className={`relative overflow-hidden rounded-3xl border border-slate-200/85 border-l-[5px] ${visual.border} bg-white p-5 shadow-lg transition-shadow duration-200 hover:shadow-xl sm:p-6`}
                >
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${visual.glow} via-transparent to-transparent opacity-70`} />

                  <div className="relative flex items-start justify-between gap-3">
                    <div className="inline-flex items-center gap-2.5">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
                        <Icon size={16} className={visual.tone} aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">{visual.category}</p>
                        <p className="text-base font-bold text-slate-900">{item.title}</p>
                      </div>
                    </div>

                    <span className={`inline-flex shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${visual.tone} bg-white/90 border-current/20`}>
                      {visual.badge}
                    </span>
                  </div>

                  <p className="relative mt-4 text-sm leading-7 text-slate-700">{item.text}</p>
                </motion.article>
              );
            })}
          </motion.div>

          <div className="mt-6 rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-5 shadow-lg backdrop-blur sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-700">AI recommendation</p>
            <p className="mt-2 text-sm leading-7 text-indigo-900">
              Prioritize products with AI scores above 90 and medium competition, then launch short-form creative tests within 48 hours.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}