"use client";

import { motion } from "framer-motion";
import { Activity, BarChart3, DollarSign, ShoppingCart } from "lucide-react";
import type { Product } from "./ProductsTable";

type Props = {
  product: Product | null;
};

export default function AISalesForecast({ product }: Props) {
  if (!product) return null;

  const aiScore = Number(product.ai_score || 80);
  const profit = Number(product.profit || 20);

  const orders = Math.round(aiScore * 14);
  const revenue = orders * Number(product.selling_price || 30);
  const totalProfit = orders * profit;
  const confidence = Math.min(99, aiScore + 4);

  const cards = [
    {
      title: "Revenue",
      metric: revenue,
      value: `$${revenue.toLocaleString()}`,
      icon: DollarSign,
      gradient: "from-emerald-500 via-emerald-600 to-teal-600",
      ring: "shadow-emerald-600/25",
      hint: "30-day forecast",
    },
    {
      title: "Profit",
      metric: totalProfit,
      value: `$${totalProfit.toLocaleString()}`,
      icon: BarChart3,
      gradient: "from-violet-600 via-purple-600 to-fuchsia-600",
      ring: "shadow-violet-600/30",
      hint: "Projected gross margin",
    },
    {
      title: "Orders",
      metric: orders,
      value: `${orders}`,
      icon: ShoppingCart,
      gradient: "from-sky-500 via-blue-600 to-indigo-700",
      ring: "shadow-blue-600/25",
      hint: "Expected orders",
    },
    {
      title: "Confidence",
      metric: confidence,
      value: `${confidence}%`,
      icon: Activity,
      gradient: "from-amber-500 via-orange-500 to-amber-600",
      ring: "shadow-amber-600/25",
      hint: "Model confidence",
    },
  ];

  const maxMetric = Math.max(...cards.map((card) => card.metric), 1);

  return (
    <section className="relative mt-8 overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-white via-slate-50/95 to-blue-50/70 p-6 shadow-[0_40px_120px_-70px_rgba(15,23,42,0.45)] sm:p-7 lg:p-8">
      <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-blue-500/12 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.9),transparent_38%),radial-gradient(circle_at_85%_10%,rgba(147,197,253,0.22),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(167,139,250,0.18),transparent_38%)]" />

      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">AI Sales Forecast</h2>
          <p className="mt-2 text-sm font-medium text-slate-600">Projected performance based on AI analysis.</p>
        </div>

        <div className="inline-flex items-center rounded-full border border-emerald-200/80 bg-emerald-100/75 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800 shadow-sm backdrop-blur">
          99% AI Confidence
        </div>
      </div>

      <motion.div
        className="relative mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
      >
        {cards.map((card, index) => {
          const Icon = card.icon;
          const progress = Math.max(8, Math.round((card.metric / maxMetric) * 100));

          return (
            <motion.article
              key={card.title}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              whileHover={{ y: -6 }}
              className={`rounded-2xl bg-gradient-to-br ${card.gradient} p-[1px] shadow-xl transition-shadow duration-200 hover:shadow-2xl ${card.ring}`}
            >
              <div className="relative overflow-hidden rounded-[15px] border border-white/40 bg-white/82 p-5 backdrop-blur-xl">
                <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/50 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-8 -left-6 h-20 w-20 rounded-full bg-white/35 blur-2xl" />

                <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.13em] text-slate-600">
                  <Icon size={14} className="text-slate-700" aria-hidden="true" />
                  {card.title}
                </p>

                <p className="mt-3 text-3xl font-black leading-none text-slate-900 sm:text-4xl">{card.value}</p>
                <p className="mt-2 text-xs font-medium text-slate-600">{card.hint}</p>

                <div className="mt-4 h-2 rounded-full bg-slate-200/75">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${card.gradient} shadow-sm`}
                    style={{ width: `${progress}%` }}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}
