"use client";
import { useState } from "react";
import Image from "next/image";
import { analyzeProduct } from "../../services/decisionEngine";
import { generateMarketing } from "../../lib/services/generateMarketing";
import { analyzeMarket } from "../../services/marketAnalyzer";
import SimilarProducts from "./SimilarProducts";
import { calculateROI } from "../../services/roiCalculator";
import type { Product } from "../../types/Product";
import { generateBusinessPlan } from "../../services/businessCoach";
import Pill from "../ui/Pill";
import MetricTile from "../ui/MetricTile";
import ScoreRing from "../ui/ScoreRing";
import ProgressBar from "../ui/ProgressBar";
import { buttonClass } from "../ui/button";
import { toneForInverseScore, toneForScore, type Tone } from "../ui/tone";

type Props = {
  product: Product;
  allProducts?: Product[];
};

function ScoreRow({ title, value, tone }: { title: string; value: number; tone: Tone }) {
  return (
    <div className="mb-4">
      <div className="mb-1.5 flex justify-between text-sm">
        <span className="font-medium text-[var(--ink-700)]">{title}</span>
        <span className="font-bold text-[var(--ink-900)]">{value}%</span>
      </div>
      <ProgressBar value={value} tone={tone} />
    </div>
  );
}

export default function ProductDetails({
  product,
  allProducts = [],
}: Props) {
  const [marketing, setMarketing] = useState("");
  const [loading, setLoading] = useState(false);

  if (!product) return null;

  async function handleGenerateMarketing() {
    try {
      setLoading(true);

      const result = await generateMarketing(product);

      setMarketing(result);

    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Failed to generate marketing output.");
      }
    } finally {
      setLoading(false);
    }
  }

  const decision = analyzeProduct(product);
  const market = analyzeMarket(product);
  const aiScore = decision.confidence;
  const plan = generateBusinessPlan(product);
  const roi = calculateROI(
    Number(product.buy_price),
    Number(product.selling_price),
    200,
    50
  );
  const winning = decision.winningProbability;

  const profit = Math.min(
    100,
    Number(product.profit || 0)
  );

  const riskValue = decision.risk === "Low" ? 20 : decision.risk === "Medium" ? 55 : 90;

  const verdictTone: Tone =
    decision.verdict === "Strong Buy" ? "positive" : decision.verdict === "Good Opportunity" ? "warning" : "risk";
  const verdictIcon = decision.verdict === "Strong Buy" ? "🏆" : decision.verdict === "Good Opportunity" ? "👍" : "⚠️";

  return (
    <section className="overflow-hidden rounded-2xl bg-[var(--surface-card)]">

      {/* Header: identity + the one number worth seeing first (AI confidence). */}
      <div className="flex flex-wrap items-start justify-between gap-6 border-b border-[var(--border-subtle)] p-6 sm:p-8">
        <div className="min-w-0 pr-8">
          <Pill tone={verdictTone}>{verdictIcon} {decision.verdict}</Pill>
          <h2 className="mt-3 break-words text-2xl font-bold text-[var(--ink-900)] sm:text-3xl">{product.name}</h2>
          <p className="mt-2 text-sm text-[var(--ink-500)]">{product.category}</p>
        </div>

        <ScoreRing value={aiScore} tone={toneForScore(aiScore)} label="AI Score" size={104} />
      </div>

      {/* Final AI decision strip -- the investment-summary row. */}
      <div className="grid grid-cols-2 gap-4 border-b border-[var(--border-subtle)] bg-[var(--surface-muted)] p-6 sm:grid-cols-3 lg:grid-cols-6 sm:p-8">
        <div className="col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-400)]">Final AI Decision</p>
          <p className="mt-1 text-xl font-extrabold text-[var(--ink-900)]">{decision.verdict}</p>
        </div>
        <MetricTile label="Report Win Prob." value={`${winning}%`} tone={toneForScore(winning)} size="sm" hint="Independent estimate" />
        <MetricTile label="Risk" value={decision.risk} tone={toneForInverseScore(riskValue)} size="sm" />
        <MetricTile label="Difficulty" value={decision.difficulty} tone="neutral" size="sm" />
        <MetricTile label="Demand" value={decision.demand} tone="data" size="sm" />
      </div>

      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-3">

        {/* Column 1: identity + pricing */}
        <div>
          <div className="relative h-56 w-full overflow-hidden rounded-2xl">
            <Image src={product.image} alt={product.name} fill unoptimized className="object-cover" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[var(--surface-muted)] p-4">
              <p className="text-xs text-[var(--ink-400)]">Buy Price</p>
              <p className="mt-1 text-lg font-bold text-[var(--ink-900)]">${product.buy_price}</p>
            </div>

            <div className="rounded-xl bg-[var(--surface-muted)] p-4">
              <p className="text-xs text-[var(--ink-400)]">Selling Price</p>
              <p className="mt-1 text-lg font-bold text-[var(--ink-900)]">${product.selling_price}</p>
            </div>

            <div className="rounded-xl bg-[var(--accent-positive-soft)] p-4">
              <p className="text-xs text-[var(--ink-400)]">Profit</p>
              <p className="mt-1 text-lg font-bold text-[var(--accent-positive)]">${product.profit}</p>
            </div>

            <div className="rounded-xl bg-[var(--accent-data-soft)] p-4">
              <p className="text-xs text-[var(--ink-400)]">Platform</p>
              <p className="mt-1 text-lg font-bold text-[var(--accent-data)]">{product.platform}</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-[var(--border-subtle)] p-5">
            <p className="mb-1 text-sm font-bold text-[var(--ink-900)]">Recommended Budget</p>
            <p className="text-2xl font-extrabold text-[var(--ink-900)]">${market.recommendedBudget}</p>
            <p className="mt-1 text-xs text-[var(--ink-400)]">Estimated -- a starting-point heuristic, not tied to real ad-platform data.</p>
          </div>
        </div>

        {/* Column 2: scored evidence */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-[var(--ink-400)]">Opportunity Breakdown</h3>

          <ScoreRow title={`Demand (${decision.demand})`} value={Math.min(100, aiScore)} tone="data" />
          <ScoreRow title="Profit Score" value={profit} tone="positive" />
          <ScoreRow title={`Risk (${decision.risk})`} value={riskValue} tone={toneForInverseScore(riskValue)} />
          <ScoreRow title="Winning Probability (this report's estimate)" value={winning} tone={toneForScore(winning)} />
        </div>

        {/* Column 3: market analysis + actions */}
        <div className="space-y-6">

          <div className="rounded-xl border border-[var(--accent-data)]/15 bg-[var(--accent-data-soft)] p-6">
            <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-[var(--ink-900)]">
              📊 Market Analysis
            </h3>

            <div className="space-y-4">
              <ScoreRow title="Viral Potential" value={market.viralPotential} tone="data" />

              <div className="grid grid-cols-2 gap-3 text-sm">
                <p className="text-[var(--ink-700)]">
                  Est. CPM <strong className="block text-[var(--ink-900)]">${market.cpm}</strong>
                </p>
                <p className="text-[var(--ink-700)]">
                  Est. CPA <strong className="block text-[var(--ink-900)]">${market.cpa}</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleGenerateMarketing}
              disabled={loading}
              className={buttonClass({ tone: "ai", className: "flex-1 py-3" })}
            >
              {loading ? "Generating..." : "🚀 Generate Marketing"}
            </button>

            <button className={buttonClass({ tone: "positive", className: "flex-1 py-3" })}>
              🛒 Import to Shopify
            </button>
          </div>

          {marketing && (
            <div className="rounded-xl border border-[var(--accent-ai)]/20 bg-[var(--accent-ai-soft)] p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-[var(--ink-900)]">AI Marketing Strategy</h3>
                <Pill tone="ai">AI-Generated</Pill>
              </div>

              <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-[var(--ink-700)]">
                {marketing}
              </pre>
            </div>
          )}

          {/* AI Business Coach -- deterministic planning output, not an AI call */}
          <div className="rounded-xl border border-[var(--border-subtle)] p-6">
            <h3 className="text-base font-bold text-[var(--ink-900)]">💼 Business Coach</h3>
            <p className="mb-4 mt-1 text-xs text-[var(--ink-400)]">
              General guidance heuristics -- not calculated from this product&apos;s real market data.
            </p>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <MetricTile label="Suggested Selling Price" value={`$${plan.sellingPrice}`} size="sm" />
              <MetricTile label="Suggested Profit" value={`$${plan.expectedProfit}`} tone="positive" size="sm" />
              <MetricTile label="Suggested Daily Budget" value={`$${plan.dailyBudget}`} size="sm" />
              <MetricTile label="Break-even" value={`${plan.breakEvenSales}/day`} size="sm" />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-400)]">Suggested Platform</p>
                <p className="mt-1 text-sm font-semibold text-[var(--ink-900)]">{plan.bestPlatform}</p>

                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[var(--ink-400)]">Common Target Countries</p>
                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-sm text-[var(--ink-700)]">
                  {plan.bestCountries.map((country) => (
                    <li key={country}>{country}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-400)]">General Launch Playbook</p>
                <ol className="mt-1 list-decimal space-y-0.5 pl-4 text-sm text-[var(--ink-700)]">
                  {plan.strategy.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* ROI Calculator */}
          <div className="rounded-xl border border-[var(--border-subtle)] p-6">
            <h3 className="text-base font-bold text-[var(--ink-900)]">💰 ROI Calculator</h3>
            <p className="mb-4 mt-1 text-xs text-[var(--ink-400)]">
              Illustrative example only -- assumes 50 sales at $200 total ad spend, not real sales data.
            </p>

            <div className="space-y-2 text-sm text-[var(--ink-700)]">
              <div className="flex justify-between">
                <span>Revenue</span>
                <strong className="text-[var(--ink-900)]">${roi.revenue.toFixed(2)}</strong>
              </div>

              <div className="flex justify-between">
                <span>Product Cost</span>
                <strong className="text-[var(--ink-900)]">${roi.productCost.toFixed(2)}</strong>
              </div>

              <div className="flex justify-between">
                <span>Advertising</span>
                <strong className="text-[var(--ink-900)]">${(roi.totalCost - roi.productCost).toFixed(2)}</strong>
              </div>

              <div className="flex justify-between border-t border-[var(--border-subtle)] pt-2">
                <span>Net Profit</span>
                <strong className="text-[var(--accent-positive)]">${roi.profit.toFixed(2)}</strong>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="font-medium text-[var(--ink-700)]">ROI</span>
                <span className="font-bold text-[var(--ink-900)]">{roi.roi}%</span>
              </div>
              <ProgressBar value={Math.min(100, Math.max(0, roi.roi))} tone="positive" />
            </div>
          </div>

        </div>

      </div>

      <div className="px-6 pb-6 sm:px-8 sm:pb-8">
        <SimilarProducts current={product} products={allProducts} />
      </div>

    </section>
  );
}
