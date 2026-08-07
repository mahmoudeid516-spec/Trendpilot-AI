"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Copy, Megaphone, PackageCheck, Sparkles, Tag } from "lucide-react";
import { toast } from "sonner";

import type { Product } from "./ProductsTable";
import { generateMarketing } from "../../lib/services/generateMarketing";
import AIReportExperience from "../reports/AIReportExperience";

type Props = {
  product: Product | null;
  onReportGenerated?: () => void;
};

export default function ProductDetails({
  product,
  onReportGenerated,
}: Props) {
  const [marketing, setMarketing] = useState("");
  const [loading, setLoading] = useState(false);

  if (!product) return null;

  async function handleGenerateMarketing() {
    try {
      setLoading(true);

      const result = await generateMarketing(product!);

      setMarketing(result);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate marketing."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCopyMarketing() {
    if (!marketing) {
      return;
    }

    try {
      await navigator.clipboard.writeText(marketing);
      toast.success("Marketing strategy copied.");
    } catch {
      toast.error("Unable to copy marketing strategy.");
    }
  }

  const opportunityValue =
    product.opportunity_score !== undefined
      ? `${product.opportunity_score}%`
      : `$${product.profit}`;

  const premiumBadges = [
    {
      label: "AI Score",
      value: `${product.ai_score}%`,
      tone:
        "border-violet-200/70 bg-violet-100/70 text-violet-800",
    },
    {
      label: "Opportunity",
      value: opportunityValue,
      tone:
        "border-cyan-200/80 bg-cyan-100/70 text-cyan-800",
    },
    {
      label: "Competition",
      value: product.competition,
      tone:
        "border-amber-200/80 bg-amber-100/70 text-amber-800",
    },
    {
      label: "High Margin",
      value: `$${product.profit}`,
      tone:
        "border-emerald-200/80 bg-emerald-100/70 text-emerald-800",
    },
  ];

  return (
    <section className="mx-auto mt-8 w-full max-w-[1400px] space-y-8 rounded-[32px] border border-violet-100/70 bg-gradient-to-b from-white via-white to-violet-50/45 p-4 shadow-[0_40px_120px_-60px_rgba(124,58,237,0.45)] sm:p-6 lg:p-8">
      <motion.div
        className="relative overflow-hidden rounded-[32px] border border-violet-200/70 bg-gradient-to-br from-slate-100 via-slate-50 to-white p-4 shadow-[0_36px_90px_-45px_rgba(15,23,42,0.45)] sm:p-6 lg:p-7"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-br from-slate-100 via-white to-slate-100 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.7),0_30px_90px_-45px_rgba(15,23,42,0.45)]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 scale-110 bg-cover bg-center opacity-30 blur-3xl"
              style={{ backgroundImage: `url(${product.image})` }}
            />
            <div className="pointer-events-none absolute -left-12 top-12 h-56 w-56 rounded-full bg-fuchsia-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-8 h-60 w-60 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.85),transparent_46%)]" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-slate-950/8" />

            <div className="relative flex h-[420px] w-full items-center justify-center p-8 sm:h-[440px] sm:p-10 lg:h-[470px] lg:p-12">
              <Image
                src={product.image}
                alt={product.name}
                width={1600}
                height={900}
                className="h-full w-full object-contain drop-shadow-[0_28px_44px_rgba(15,23,42,0.28)]"
                priority
              />
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-900/10 to-transparent" />

            <motion.div
              className="absolute right-4 top-4 rounded-2xl border border-white/55 bg-white/80 px-4 py-3 shadow-xl backdrop-blur-xl sm:right-6 sm:top-6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-600">AI Score</p>
              <p className="mt-1 text-2xl font-black text-violet-700 sm:text-3xl">{product.ai_score}%</p>
            </motion.div>
          </div>

          <div className="rounded-[28px] border border-white/80 bg-white/80 p-5 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.42)] backdrop-blur-xl sm:p-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-violet-100/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-700">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              AI Product Intelligence
            </div>

            <h1 className="mt-4 overflow-hidden text-2xl font-black leading-tight text-slate-900 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] sm:text-[32px] lg:text-[48px]">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <MetaPill label="Category" value={product.category} />
              <MetaPill label="Marketplace" value={product.platform} />
              <MetaPill label="Country" value={product.country} />
            </div>

            <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {premiumBadges.map((badge, index) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index, duration: 0.25 }}
                  className={`flex items-center justify-between rounded-2xl border px-3.5 py-2.5 ${badge.tone}`}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">{badge.label}</p>
                  <p className="text-sm font-bold">{badge.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
      >
        <MetricCard
          title="Buy"
          value={`$${product.buy_price}`}
          gradient="from-orange-500 via-amber-500 to-yellow-500"
        />
        <MetricCard
          title="Sell"
          value={`$${product.selling_price}`}
          gradient="from-sky-500 via-blue-500 to-indigo-600"
        />
        <MetricCard
          title="Profit"
          value={`$${product.profit}`}
          gradient="from-violet-600 via-purple-500 to-fuchsia-500"
        />
        <MetricCard
          title="AI Score"
          value={`${product.ai_score}%`}
          gradient="from-emerald-500 via-teal-500 to-cyan-500"
        />
      </motion.div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleGenerateMarketing}
          disabled={loading}
          className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-xl disabled:opacity-60"
        >
          <Megaphone size={18} aria-hidden="true" />
          {loading ? "Generating..." : "Generate Marketing"}
        </button>

        <a
          href={product.product_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-white/60 bg-white/55 px-7 py-3 text-sm font-semibold text-slate-700 shadow-[0_10px_28px_-18px_rgba(15,23,42,0.55)] backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:border-slate-300 hover:bg-white/80 hover:text-slate-900 hover:shadow-md"
        >
          <PackageCheck size={18} aria-hidden="true" />
          Open Listing
        </a>
      </div>

      {marketing ? (
        <motion.div
          className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_70px_-45px_rgba(15,23,42,0.45)]"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 py-3 text-slate-100">
            <h3 className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide">
              <Tag className="h-4 w-4 text-cyan-300" />
              AI Marketing Strategy
            </h3>

            <button
              type="button"
              onClick={() => void handleCopyMarketing()}
              className="inline-flex items-center gap-1 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
            >
              <Copy size={12} />
              Copy
            </button>
          </div>

          <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-5 py-5">
            <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap font-mono text-[13px] leading-7 text-slate-200">
              {marketing}
            </pre>
          </div>
        </motion.div>
      ) : null}

      <div className="pt-2">
        <AIReportExperience
          product={product}
          onPersisted={onReportGenerated}
        />
      </div>
    </section>
  );
}

function MetaPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-3.5 py-1.5 shadow-sm">
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</span>
      <span className="text-xs font-semibold text-slate-800">{value}</span>
    </div>
  );
}

function MetricCard({
  title,
  value,
  gradient,
}: {
  title: string;
  value: string;
  gradient: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      variants={{
        hidden: { opacity: 0, y: 14 },
        visible: { opacity: 1, y: 0 },
      }}
      className={`rounded-2xl bg-gradient-to-br ${gradient} p-[1px] shadow-[0_20px_45px_-28px_rgba(30,41,59,0.45)]`}
    >
      <div className="rounded-2xl bg-white/88 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">{title}</p>
        <h2 className="mt-3 text-3xl font-black leading-none text-slate-900 sm:text-4xl">{value}</h2>
      </div>
    </motion.div>
  );
}