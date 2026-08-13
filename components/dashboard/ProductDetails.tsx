"use client";
import { useState } from "react";
import Image from "next/image";
import { analyzeProduct } from "../../services/decisionEngine";
import { generateMarketing } from "../../lib/services/generateMarketing";
import {
  getShopifyConnectionStatus,
  beginShopifyConnect,
  pushProductToShopify,
} from "../../lib/services/shopifyStoreClient";
import { analyzeMarket } from "../../services/marketAnalyzer";
import SimilarProducts from "./SimilarProducts";
import { calculateROI } from "../../services/roiCalculator";
import type { Product } from "../../types/Product";
import { generateBusinessPlan } from "../../services/businessCoach";
import Pill from "../ui/Pill";
import MetricTile from "../ui/MetricTile";
import ScoreRing from "../ui/ScoreRing";
import ProgressBar from "../ui/ProgressBar";
import DataTierBadge, { type DataTier } from "../ui/DataTierBadge";
import { buttonClass } from "../ui/button";
import { toneForInverseScore, toneForScore, type Tone } from "../ui/tone";

type Props = {
  product: Product;
  allProducts?: Product[];
};

function ScoreRow({
  title,
  value,
  tone,
  tier,
}: {
  title: string;
  value: number | null;
  tone: Tone;
  tier?: DataTier;
}) {
  return (
    <div className="mb-4">
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm">
        <span className="flex items-center gap-2 font-medium text-[var(--ink-700)]">
          {title}
          {tier && <DataTierBadge tier={tier} />}
        </span>
        <span className="font-bold text-[var(--ink-900)]">{value === null ? "N/A" : `${value}%`}</span>
      </div>
      <ProgressBar value={value ?? 0} tone={value === null ? "neutral" : tone} />
    </div>
  );
}

export default function ProductDetails({
  product,
  allProducts = [],
}: Props) {
  const [marketing, setMarketing] = useState("");
  const [loading, setLoading] = useState(false);
  const [shopifyLoading, setShopifyLoading] = useState(false);
  const [shopifyNeedsConnect, setShopifyNeedsConnect] = useState(false);
  const [shopifyShopInput, setShopifyShopInput] = useState("");
  const [shopifyResult, setShopifyResult] = useState<
    | { type: "success"; productId: string; adminUrl: string }
    | { type: "error"; text: string }
    | null
  >(null);

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

  async function handleImportToShopify() {
    if (shopifyLoading) return;

    setShopifyResult(null);

    try {
      setShopifyLoading(true);

      const status = await getShopifyConnectionStatus();

      if (!status.connected) {
        setShopifyNeedsConnect(true);
        return;
      }

      const result = await pushProductToShopify(product);

      setShopifyResult({
        type: "success",
        productId: result.shopify_product_id,
        adminUrl: result.shopify_admin_url,
      });
    } catch (error: unknown) {
      setShopifyResult({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to import product to Shopify.",
      });
    } finally {
      setShopifyLoading(false);
    }
  }

  async function handleConnectShopify() {
    const shop = shopifyShopInput.trim().toLowerCase();

    if (!shop) {
      setShopifyResult({ type: "error", text: "Enter your Shopify store domain." });
      return;
    }

    try {
      setShopifyLoading(true);
      setShopifyResult(null);

      const url = await beginShopifyConnect(shop);

      window.location.href = url;
    } catch (error: unknown) {
      setShopifyResult({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to start the Shopify connection.",
      });
      setShopifyLoading(false);
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
  // Canonical winning probability -- the same value shown on the product
  // card (lib/scoring/opportunityScore.ts). Not persisted for saved
  // products yet (see PRODUCT_INSERT_COLUMNS), so it can be undefined for
  // a product reopened from the Saved Product Library; hasWinningProbability
  // controls whether we show a real number or an honest "N/A".
  const hasWinningProbability = typeof product.winning_probability === "number";
  const winning = product.winning_probability ?? 0;

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
        <MetricTile
          label="Winning Prob."
          value={hasWinningProbability ? `${winning}%` : "N/A"}
          tone={hasWinningProbability ? toneForScore(winning) : "neutral"}
          size="sm"
        />
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

          <div className="mt-4 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--ink-400)]">Listing Details</h3>
            <DataTierBadge tier="real" />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
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
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-[var(--ink-900)]">Recommended Budget</p>
              <DataTierBadge tier="estimate" />
            </div>
            <p className="mt-1 text-2xl font-extrabold text-[var(--ink-900)]">${market.recommendedBudget}</p>
            <p className="mt-1 text-xs text-[var(--ink-400)]">A starting-point heuristic, not tied to real ad-platform data.</p>
          </div>
        </div>

        {/* Column 2: scored evidence */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-[var(--ink-400)]">Opportunity Breakdown</h3>

          <ScoreRow title={`Demand (${decision.demand})`} value={Math.min(100, aiScore)} tone="data" tier="estimate" />
          <ScoreRow title="Profit Score" value={profit} tone="positive" tier="estimate" />
          <ScoreRow title={`Risk (${decision.risk})`} value={riskValue} tone={toneForInverseScore(riskValue)} tier="estimate" />
          <ScoreRow
            title="Winning Probability"
            value={hasWinningProbability ? winning : null}
            tone={toneForScore(winning)}
            tier="real"
          />
        </div>

        {/* Column 3: market analysis + actions */}
        <div className="space-y-6">

          <div className="rounded-xl border border-[var(--accent-data)]/15 bg-[var(--accent-data-soft)] p-6">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h3 className="flex items-center gap-2 text-base font-bold text-[var(--ink-900)]">
                📊 Market Analysis
              </h3>
              <DataTierBadge tier="estimate" />
            </div>

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

            <button
              onClick={handleImportToShopify}
              disabled={shopifyLoading}
              className={buttonClass({ tone: "positive", className: "flex-1 py-3" })}
            >
              {shopifyLoading ? "Importing..." : "🛒 Import to Shopify"}
            </button>
          </div>

          {shopifyNeedsConnect && (
            <div className="rounded-xl border border-[var(--accent-positive)]/20 bg-[var(--accent-positive-soft)] p-5">
              <h3 className="mb-1 text-sm font-bold text-[var(--ink-900)]">Connect your Shopify store</h3>
              <p className="mb-3 text-xs text-[var(--ink-400)]">
                No connected Shopify store found. Enter your store domain to connect it, then import again.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  placeholder="your-store.myshopify.com"
                  value={shopifyShopInput}
                  onChange={(e) => setShopifyShopInput(e.target.value)}
                  className="tp-focus-ring min-h-11 flex-1 rounded-lg border border-[var(--border-subtle)] px-4 text-sm outline-none"
                />
                <button
                  onClick={handleConnectShopify}
                  disabled={shopifyLoading}
                  className={buttonClass({ tone: "positive", className: "min-h-11 px-5" })}
                >
                  {shopifyLoading ? "Connecting..." : "Connect Shopify"}
                </button>
              </div>
            </div>
          )}

          {shopifyResult && shopifyResult.type === "success" && (
            <div className="rounded-xl border border-[var(--accent-positive)]/20 bg-[var(--accent-positive-soft)] p-5 text-sm text-[var(--ink-900)]">
              Imported to Shopify (product ID {shopifyResult.productId}).{" "}
              <a
                href={shopifyResult.adminUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline"
              >
                View it in Shopify admin
              </a>
              .
            </div>
          )}

          {shopifyResult && shopifyResult.type === "error" && (
            <div className="rounded-xl border border-[var(--accent-risk)]/20 bg-[var(--accent-risk-soft)] p-5 text-sm text-[var(--ink-900)]">
              {shopifyResult.text}
            </div>
          )}

          {marketing && (
            <div className="rounded-xl border border-[var(--accent-ai)]/20 bg-[var(--accent-ai-soft)] p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-[var(--ink-900)]">AI Marketing Strategy</h3>
                <DataTierBadge tier="ai" />
              </div>

              <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-[var(--ink-700)]">
                {marketing}
              </pre>
            </div>
          )}

          {/* AI Business Coach -- deterministic planning output, not an AI call */}
          <div className="rounded-xl border border-[var(--border-subtle)] p-6">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-bold text-[var(--ink-900)]">💼 Business Coach</h3>
              <DataTierBadge tier="estimate" />
            </div>
            <p className="mb-4 mt-1 text-xs text-[var(--ink-400)]">
              Calculated from this product&apos;s price and AI score -- not real market data.
            </p>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <MetricTile label="Suggested Selling Price" value={`$${plan.sellingPrice}`} size="sm" />
              <MetricTile label="Estimated Profit" value={`$${plan.expectedProfit}`} tone="positive" size="sm" />
              <MetricTile label="Suggested Daily Budget" value={`$${plan.dailyBudget}`} size="sm" />
              <MetricTile label="Break-even" value={`${plan.breakEvenSales}/day`} size="sm" />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-400)]">Suggested Platform</p>
                <p className="mt-1 text-sm font-semibold text-[var(--ink-900)]">{plan.bestPlatform}</p>

                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-400)]">Best Countries</p>
                  <DataTierBadge tier="general" />
                </div>
                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-sm text-[var(--ink-700)]">
                  {plan.bestCountries.map((country) => (
                    <li key={country}>{country}</li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-400)]">Launch Strategy</p>
                  <DataTierBadge tier="general" />
                </div>
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
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-bold text-[var(--ink-900)]">💰 ROI Calculator</h3>
              <DataTierBadge tier="estimate" />
            </div>
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
