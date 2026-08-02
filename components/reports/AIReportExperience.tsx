"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, RefreshCcw, Sparkles, WandSparkles } from "lucide-react";
import type { ReportProductInput } from "../../types/AIReport";
import { generateAIReport } from "../../lib/services/reports";
import ReportErrorCard from "./ReportErrorCard";
import ReportGenerationLoader from "./ReportGenerationLoader";

type Props = {
  product: ReportProductInput;
  onPersisted?: () => void;
};

const LOADING_STEPS = [
  "Analyzing Market...",
  "Scanning Competitors...",
  "Calculating Opportunity Score...",
  "Estimating Profit...",
  "Building Marketing Strategy...",
  "Generating AI Report...",
  "Almost Finished...",
];

export default function AIReportExperience({ product, onPersisted }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(8);
  const [stepIndex, setStepIndex] = useState(0);
  const [etaSeconds, setEtaSeconds] = useState(45);

  const productSignature = useMemo(
    () => `${product.id ?? "x"}:${product.name}:${product.platform ?? product.marketplace ?? ""}`,
    [product.id, product.marketplace, product.name, product.platform],
  );

  useEffect(() => {
    if (!loading) {
      return;
    }

    const startedAt = Date.now();
    const intervalId = window.setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
      const nextProgress = Math.min(94, 8 + elapsedSeconds * 5);
      const nextStepIndex = Math.min(LOADING_STEPS.length - 1, Math.floor(elapsedSeconds / 4));

      setProgress(nextProgress);
      setStepIndex(nextStepIndex);
      setEtaSeconds(Math.max(6, 45 - elapsedSeconds));
    }, 700);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [loading, productSignature]);

  async function handleGenerate(forceRegenerate = false) {
    try {
      setProgress(8);
      setStepIndex(0);
      setEtaSeconds(45);
      setLoading(true);
      setError("");

      const result = await generateAIReport(product, { forceRegenerate });

      setProgress(100);
      setEtaSeconds(0);
      onPersisted?.();
      router.push(`/dashboard/report/${result.reportId}`);
    } catch (err) {
  console.error("AI REPORT ERROR");
  console.error(err);

  if (err instanceof Error) {
    console.error(err.message);
  }

  setError(err instanceof Error ? err.message : "Failed to generate report.");
}
    finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-8 rounded-[32px] border border-violet-200/70 bg-gradient-to-b from-white via-white to-violet-50/45 p-5 shadow-[0_30px_80px_-50px_rgba(124,58,237,0.45)] sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-violet-700">
            <Sparkles size={13} />
            AI Report System
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Generate Premium Business Intelligence</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
            Generate one saved AI report for this product. If a report already exists, TrendPilot opens the stored version instead of regenerating it.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void handleGenerate(false)}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/40 bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#06B6D4] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          >
            <WandSparkles size={15} />
            Generate Report
          </button>

          <button
            type="button"
            onClick={() => void handleGenerate(true)}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCcw size={15} className={loading ? "animate-spin" : ""} />
            Regenerate
          </button>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <ReportGenerationLoader progress={progress} step={LOADING_STEPS[stepIndex]} etaSeconds={etaSeconds} />
        ) : null}

        {!loading && error ? (
          <ReportErrorCard
            title="Report generation failed"
            message={error}
            actionLabel="Retry"
            onAction={() => void handleGenerate(false)}
          />
        ) : null}

        {!loading && !error ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
            <p className="inline-flex items-center gap-2 font-semibold text-slate-900">
              <FileText size={16} className="text-violet-600" />
              What happens next
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-violet-200/60 bg-gradient-to-b from-violet-50/70 to-white p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Step 1</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">TrendPilot checks whether this product already has a saved report for your account.</p>
              </motion.div>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-cyan-200/60 bg-gradient-to-b from-cyan-50/70 to-white p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Step 2</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">If none exists, OpenAI generates one structured report which is validated and stored in Supabase.</p>
              </motion.div>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-emerald-200/60 bg-gradient-to-b from-emerald-50/70 to-white p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Step 3</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">The saved report opens on its own page and becomes available in your report history immediately.</p>
              </motion.div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}