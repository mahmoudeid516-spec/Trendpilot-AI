"use client";

import { X, TrendingUp, DollarSign, ShieldCheck } from "lucide-react";
import type { Product } from "./ProductsTable";
import Image from "next/image";
import { useEffect, useState } from "react";
import { generateAIReport } from "../../lib/services/reports";

type Props = {
  product: Product | null;
  onClose: () => void;
  onReportGenerated?: () => void;
};

function getRecommendation(
  aiScore: number,
  opportunity: number,
  competition: string
) {
  if (
    aiScore >= 85 &&
    opportunity >= 85 &&
    competition === "Low"
  ) {
    return "🟢 STRONG BUY";
  }

  if (
    aiScore >= 70 &&
    opportunity >= 70
  ) {
    return "🟡 TEST FIRST";
  }

  return "🔴 AVOID";
}

export default function ProductAnalysisDrawer({
  product,
  onClose,
  onReportGenerated,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  type AIReport = {
  business_verdict: string;
  opportunity_score: number;
  confidence_score: number;
  executive_summary: string;
  market_potential: string;
  demand_analysis: string;
  competition_analysis: string;

  target_audience: {
    primary_segments: string[];
  };

  marketing_angles: {
    awareness: string[];
  };

  swot_analysis: {
    strengths: string[];
  };

  risks: string[];

  recommendations: string[];
};
  const [report, setReport] = useState<AIReport | null>(null);

  useEffect(() => {
    setReport(null);
  }, [product]);

  async function generateReport() {
    if (!product || loading) return;

    try {
      setLoading(true);

      setLoadingStep("🤖 AI is analyzing product...");

      setTimeout(() => setLoadingStep("📈 Evaluating market..."), 800);
      setTimeout(() => setLoadingStep("💰 Calculating profitability..."), 1600);
      setTimeout(() => setLoadingStep("⚔️ Analyzing competition..."), 2400);
      setTimeout(() => setLoadingStep("📝 Preparing report..."), 3200);

      const data = await generateAIReport(
        {
          name: product.name,
          category: product.category,
          platform: product.platform,

          buy_price: product.buy_price,
          selling_price: product.selling_price,
          profit: product.profit,

          ai_score: product.ai_score,
          trend_score: product.trend_score,

          competition: product.competition,

          description: product.description,
        },
        {
          forceRegenerate: false,
        }
      );

     setReport(data.report as AIReport);

      onReportGenerated?.();
    } catch (err) {
      console.error(err);
      alert("Failed to generate report.");
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] ${
        product ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          product ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        className={`fixed right-0 top-0 z-[10000] h-screen w-[480px] overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ${
          product ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {product && (
          <>
            <div className="flex items-center justify-between border-b p-6">
              <h2 className="text-xl font-bold">
                AI Product Analysis
              </h2>

              <button onClick={onClose}>
                <X />
              </button>
            </div>

            <div className="space-y-6 p-6">

              <Image
                src={product.image}
                alt={product.name}
                width={500}
                height={500}
                unoptimized
                className="h-60 w-full rounded-2xl object-cover"
              />

              <h3 className="text-lg font-bold">
                {product.name}
              </h3>

              <p className="text-sm text-slate-500">
                {product.platform} • {product.category}
              </p>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="text-xs font-semibold uppercase text-emerald-700">
                  AI Recommendation
                </p>

                <h2 className="mt-2 text-3xl font-black text-emerald-600">
                  {getRecommendation(
                    product.ai_score,
                    product.opportunity_score ?? product.ai_score,
                    product.competition
                  )}
                </h2>

                <p className="mt-2 text-sm text-slate-600">
  Confidence{" "}
  {report?.confidence_score ??
    Math.min(99, product.ai_score + 8)}
  %
</p>
              </div>

              <div className="grid grid-cols-3 gap-3">

                <div className="rounded-xl border p-4 text-center">
                  <TrendingUp className="mx-auto mb-2" size={18} />
                  <p className="text-xs text-slate-500">AI Score</p>
                  <h3 className="font-bold">{product.ai_score}</h3>
                </div>

                <div className="rounded-xl border p-4 text-center">
                  <DollarSign className="mx-auto mb-2" size={18} />
                  <p className="text-xs text-slate-500">Profit</p>
                  <h3 className="font-bold">${product.profit}</h3>
                </div>

                <div className="rounded-xl border p-4 text-center">
                  <ShieldCheck className="mx-auto mb-2" size={18} />
                  <p className="text-xs text-slate-500">Competition</p>
                  <h3 className="font-bold">{product.competition}</h3>
                </div>

              </div>

              <div className="grid grid-cols-2 gap-3">

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Opportunity
                  </p>

                  <h3 className="mt-1 text-2xl font-bold">
                    {product.opportunity_score ?? product.ai_score}
                  </h3>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Trend
                  </p>

                  <h3 className="mt-1 text-2xl font-bold">
                    {product.trend_score}
                  </h3>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Buy Price
                  </p>

                  <h3 className="mt-1 text-2xl font-bold">
                    {(product.buy_price ?? 0) > 0
                      ? `$${product.buy_price}`
                      : "Unknown"}
                  </h3>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Sell Price
                  </p>

                  <h3 className="mt-1 text-2xl font-bold">
                    {(product.selling_price ?? 0) > 0
                      ? `$${product.selling_price}`
                      : "Unknown"}
                  </h3>
                </div>

              </div>
              {report && (

<div
  className={`rounded-2xl p-5 border ${
    product.ai_score >= 85
      ? "border-emerald-200 bg-emerald-50"
      : product.ai_score >= 70
      ? "border-yellow-200 bg-yellow-50"
      : "border-red-200 bg-red-50"
  }`}
>
    <h3 className="mb-6 text-xl font-bold text-slate-900">
      🤖 AI Executive Report
    </h3>

    <div className="space-y-5">

      <div className="rounded-xl bg-white p-4">
        <p className="text-xs uppercase text-slate-500">
          Business Verdict
        </p>

        <div
  className={`mt-3 rounded-xl px-4 py-3 text-center font-bold text-lg ${
    report.opportunity_score >= 80
      ? "bg-emerald-100 text-emerald-700"
      : report.opportunity_score >= 65
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-700"
  }`}
>
  {report.business_verdict}
</div>
      </div>

      <div className="grid grid-cols-2 gap-3">

        <div className="rounded-xl bg-white p-4">
          <p className="text-xs uppercase text-slate-500">
            Opportunity Score
          </p>

          <p className="mt-2 text-3xl font-bold">
            {report.opportunity_score}/100
          </p>
        </div>

        <div className="rounded-xl bg-white p-4">
          <p className="text-xs uppercase text-slate-500">
            Confidence Score
          </p>

          <p className="mt-2 text-3xl font-bold">
            {report.confidence_score}/100
          </p>
        </div>

      </div>

      <div className="rounded-xl bg-white p-4">
        <p className="text-xs uppercase text-slate-500">
          Executive Summary
        </p>

        <p className="mt-2 text-sm leading-6">
          {report.executive_summary}
        </p>
      </div>

      <div className="rounded-xl bg-white p-4">
        <p className="text-xs uppercase text-slate-500">
          Market Potential
        </p>

        <p className="mt-2 text-sm leading-6">
          {report.market_potential}
        </p>
      </div>

      <div className="rounded-xl bg-white p-4">
        <p className="text-xs uppercase text-slate-500">
          Demand Analysis
        </p>

        <p className="mt-2 text-sm leading-6">
          {report.demand_analysis}
        </p>
      </div>

      <div className="rounded-xl bg-white p-4">
        <p className="text-xs uppercase text-slate-500">
          Competition Analysis
        </p>

        <p className="mt-2 text-sm leading-6">
          {report.competition_analysis}
        </p>
      </div>

      <div className="rounded-xl bg-white p-4">

        <p className="text-xs uppercase text-slate-500">
          Target Audience
        </p>

        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {(report.target_audience.primary_segments ?? []).map((item: string) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>

      </div>

      <div className="rounded-xl bg-white p-4">

        <p className="text-xs uppercase text-slate-500">
          Marketing Strategy
        </p>

        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {(report.marketing_angles.awareness ?? []).map((item: string) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>

      </div>

      <div className="rounded-xl bg-white p-4">

        <p className="text-xs uppercase text-slate-500">
          SWOT Strengths
        </p>

        <ul className="mt-3 space-y-2">
          {(report.swot_analysis.strengths ?? []).map((item: string) => (
            <li key={item}>✅ {item}</li>
          ))}
        </ul>

      </div>

      <div className="rounded-xl bg-white p-4">

        <p className="text-xs uppercase text-slate-500">
          Risks
        </p>

        <ul className="mt-3 space-y-2">
          {(report.risks ?? []).map((item: string) => (
            <li key={item}>⚠️ {item}</li>
          ))}
        </ul>

      </div>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">

        <p className="text-xs uppercase text-slate-500">
          Recommended Action
        </p>

        <ul className="mt-3 space-y-2">
          {(report.recommendations ?? []).map((item: string) => (
            <li key={item}>🚀 {item}</li>
          ))}
        </ul>

      </div>

    </div>

  </div>
)}
<div className="mt-6 flex flex-col gap-3">

  {!report && (
    <>
      <button
        onClick={generateReport}
        disabled={loading}
        className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? loadingStep : "Generate AI Report"}
      </button>

      <a
        href={product.product_url}
        target="_blank"
        rel="noreferrer"
        className="w-full rounded-xl border border-slate-300 py-3 text-center font-semibold transition hover:bg-slate-100"
      >
        View on Amazon
      </a>
    </>
  )}

</div>

            </div>
          </>
        )}
      </aside>
    </div>
  );
}