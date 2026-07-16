"use client";
import { useState } from "react";
import { analyzeProduct } from "../../services/decisionEngine";
import { generateMarketing } from "../../lib/services/generateMarketing";
import { analyzeMarket } from "../../services/marketAnalyzer";
import SimilarProducts from "./SimilarProducts";
import { calculateROI } from "../../services/roiCalculator";
import type { Product } from "../../types/Product";
import { generateBusinessPlan } from "../../services/businessCoach";


type Props = {
  product: Product;
  allProducts?: Product[];
};

function ScoreBar({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex justify-between mb-2">
        <span className="font-medium">{title}</span>
        <span className="font-bold">{value}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`${color} h-3 rounded-full transition-all duration-700`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function ProductDetails({
  product,
  allProducts = [],
}: Props) {
  if (!product) return null;

  const [marketing, setMarketing] = useState("");
const [loading, setLoading] = useState(false);

async function handleGenerateMarketing() {
  try {
    setLoading(true);

    const result = await generateMarketing(product);

    setMarketing(result);

  } catch (error: any) {
    alert(error.message);
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

  return (
    <section className="mt-10 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 p-8 text-white">

        <div className="flex justify-between items-center">

          <div>

            <h2 className="text-4xl font-bold">
              {product.name}
            </h2>

            <div className="mt-4 inline-flex rounded-full bg-green-500 px-4 py-2 text-sm font-bold">
  🏆 {decision.verdict}
</div>

            <p className="mt-3 text-purple-100">
              {product.category}
            </p>

          </div>

          <div className="text-center">

            <div className="text-6xl font-bold">
              {aiScore}
            </div>

            <p>AI SCORE</p>

          </div>

        </div>

      </div>

      <div className="mb-8 rounded-3xl border border-purple-200 bg-gradient-to-r from-purple-700 to-indigo-700 p-8 text-white">

<div className="flex items-center justify-between">

  <div>

    <p className="text-purple-200 text-sm">
      FINAL AI DECISION
    </p>

    <h2 className="text-5xl font-bold mt-2">
      {decision.verdict}
    </h2>

    <p className="mt-3 text-purple-100">
      Winning Probability {decision.winningProbability}%
    </p>
    <div className="mt-5 flex flex-wrap gap-3">

<span className="rounded-full bg-white/20 px-4 py-2 text-sm">
  🛒 {product.platform}
</span>

<span className="rounded-full bg-white/20 px-4 py-2 text-sm">
  🌍 {product.country}
</span>

<span className="rounded-full bg-white/20 px-4 py-2 text-sm">
  💰 ${product.profit} Profit
</span>

</div>

  </div>

  <div className="text-right">

    <div className="text-6xl font-bold">
      {decision.confidence}
    </div>

    <p>AI Confidence</p>

  </div>

</div>

<div className="grid md:grid-cols-4 gap-5 mt-8">

  <div className="bg-white/10 rounded-xl p-4">
    <p>Risk</p>
    <h3 className="text-2xl font-bold">
      {decision.risk}
    </h3>
  </div>

  <div className="bg-white/10 rounded-xl p-4">
    <p>Difficulty</p>
    <h3 className="text-2xl font-bold">
      {decision.difficulty}
    </h3>
  </div>

  <div className="bg-white/10 rounded-xl p-4">
    <p>Demand</p>
    <h3 className="text-2xl font-bold">
      {decision.demand}
    </h3>
  </div>

  <div className="bg-white/10 rounded-xl p-4">
    <p>Budget</p>
    <h3 className="text-2xl font-bold">
      ${market.recommendedBudget}
    </h3>
  </div>

</div>

</div>
     
      <div className="grid lg:grid-cols-3 gap-10 p-8">

      <div className="mb-8">
  <img
    src={product.image}
    alt={product.name}
    className="w-full h-[420px] rounded-3xl object-cover border border-gray-200 shadow-2xl"
  />

  <div className="grid grid-cols-2 gap-3 mt-5">

    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm">
      <p className="text-gray-500 text-sm">Buy Price</p>
      <p className="font-bold text-xl">
        ${product.buy_price}
      </p>
    </div>

    <div className="rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm">
      <p className="text-gray-500 text-sm">Selling Price</p>
      <p className="font-bold text-xl">
        ${product.selling_price}
      </p>
    </div>

    <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5 shadow-sm">
      <p className="text-gray-500 text-sm">Profit</p>
      <p className="font-bold text-green-700 text-xl">
        ${product.profit}
      </p>
    </div>

    <div className="bg-purple-100 rounded-xl p-4">
      <p className="text-gray-500 text-sm">Platform</p>
      <p className="font-bold">
        {product.platform}
      </p>
    </div>

  </div>
</div>

        <div>

        <ScoreBar
  title={`Demand (${decision.demand})`}
  value={Math.min(100, aiScore)}
  color="bg-pink-500"
/>

          <ScoreBar
            title="Profit Score"
            value={profit}
            color="bg-green-500"
          />

<ScoreBar
  title={`Risk (${decision.risk})`}
  value={
    decision.risk === "Low"
      ? 20
      : decision.risk === "Medium"
      ? 55
      : 90
  }
  color="bg-red-500"
/>

          <ScoreBar
            title="Winning Probability"
            value={winning}
            color="bg-purple-600"
          />

        </div>

        <div className="space-y-6">

  <div className="rounded-2xl bg-blue-50 p-6">

    <h3 className="font-bold text-xl mb-4">
      📊 AI Market Intelligence
    </h3>

    <div className="space-y-3">

      <div>
        <div className="flex justify-between mb-1">
          <span>🔥 Viral Potential</span>
          <span>{market.viralPotential}%</span>
        </div>

        <div className="w-full h-3 bg-gray-200 rounded-full">
          <div
            className="h-3 bg-pink-500 rounded-full"
            style={{ width: `${market.viralPotential}%` }}
          />
        </div>
      </div>

      <p>
        💰 Recommended Budget:
        <strong> ${market.recommendedBudget}</strong>
      </p>

      <p>
        📢 Estimated CPM:
        <strong> ${market.cpm}</strong>
      </p>

      <p>
        🎯 Estimated CPA:
        <strong> ${market.cpa}</strong>
      </p>

    </div>

  </div>

  <div className="flex gap-4">

    <button
      onClick={handleGenerateMarketing}
      disabled={loading}
      className="flex-1 rounded-xl bg-purple-600 text-white py-4 font-bold hover:bg-purple-700 disabled:opacity-50 transition"
    >
      {loading ? "Generating..." : "🚀 Generate Marketing"}
    </button>

    <button className="flex-1 rounded-xl bg-green-600 text-white py-4 font-bold hover:bg-green-700 transition">
      🛒 Import to Shopify
    </button>

  </div>

  {marketing && (
    <div className="mt-8 rounded-2xl border bg-gray-50 p-6">
      <h3 className="text-2xl font-bold mb-4">
        🤖 AI Marketing Strategy
      </h3>

      <pre className="whitespace-pre-wrap text-sm leading-7">
        {marketing}
      </pre>
    </div>
  )}

  {/* AI Business Coach */}

  <div className="rounded-2xl bg-green-50 border border-green-200 p-6">

    <h3 className="text-2xl font-bold mb-5">
      💼 AI Business Coach
    </h3>

    <div className="grid md:grid-cols-2 gap-6">

      <div>

        <p className="mb-3">
          <strong>Verdict:</strong> {plan.verdict}
        </p>

        <p className="mb-3">
          <strong>Suggested Selling Price:</strong> ${plan.sellingPrice}
        </p>

        <p className="mb-3">
          <strong>Expected Profit:</strong> ${plan.expectedProfit}
        </p>

        <p className="mb-3">
          <strong>Daily Budget:</strong> ${plan.dailyBudget}
        </p>

        <p>
          <strong>Break-even Sales:</strong> {plan.breakEvenSales} sales/day
        </p>

      </div>

      <div>

        <p className="mb-3">
          <strong>Best Platform:</strong> {plan.bestPlatform}
        </p>

        <p className="font-bold mb-2">
          Best Countries
        </p>

        <ul className="list-disc ml-5 space-y-1">

          {plan.bestCountries.map((country) => (
            <li key={country}>{country}</li>
          ))}

        </ul>

        <p className="font-bold mt-5 mb-2">
          Launch Strategy
        </p>

        <ol className="list-decimal ml-5 space-y-1">

          {plan.strategy.map((step) => (
            <li key={step}>{step}</li>
          ))}

        </ol>

      </div>

    </div>

  </div>

  {/* ROI Calculator */}

  <div className="rounded-2xl bg-yellow-50 border border-yellow-200 p-6">

    <h3 className="text-2xl font-bold mb-5">
      💰 ROI Calculator
    </h3>

    <div className="space-y-3">

      <div className="flex justify-between">
        <span>Revenue</span>
        <strong>${roi.revenue.toFixed(2)}</strong>
      </div>

      <div className="flex justify-between">
        <span>Product Cost</span>
        <strong>${roi.productCost.toFixed(2)}</strong>
      </div>

      <div className="flex justify-between">
        <span>Advertising</span>
        <strong>${(roi.totalCost - roi.productCost).toFixed(2)}</strong>
      </div>

      <div className="flex justify-between">
        <span>Net Profit</span>
        <strong className="text-green-600">
          ${roi.profit.toFixed(2)}
        </strong>
      </div>

      <div className="mt-5">

        <p className="mb-2 font-bold">
          ROI
        </p>

        <div className="w-full h-4 bg-gray-200 rounded-full">

          <div
            className="h-4 bg-green-500 rounded-full"
            style={{
              width: `${Math.min(100, Math.max(0, roi.roi))}%`,
            }}
          />

        </div>

        <p className="mt-2 text-center text-2xl font-bold">
          {roi.roi}%
        </p>

      </div>

    </div>

  </div>

</div>

</div>

<SimilarProducts
  current={product}
  products={allProducts}
/>

</section>);
}