"use client";
import { useState } from "react";
import { analyzeProduct } from "../../services/decisionEngine";
import { generateMarketing } from "../../lib/services/generateMarketing";
import { analyzeMarket } from "../../services/marketAnalyzer";

type Props = {
  product: any;
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

export default function ProductDetails({ product }: Props) {
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

    <h2 className="text-4xl font-bold mt-2">
      {decision.verdict}
    </h2>

    <p className="mt-3 text-purple-100">
      Winning Probability {decision.winningProbability}%
    </p>

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
    className="w-full rounded-2xl shadow-lg object-cover"
  />

  <div className="grid grid-cols-2 gap-3 mt-5">

    <div className="bg-gray-100 rounded-xl p-4">
      <p className="text-gray-500 text-sm">Buy Price</p>
      <p className="font-bold text-xl">
        ${product.buy_price}
      </p>
    </div>

    <div className="bg-gray-100 rounded-xl p-4">
      <p className="text-gray-500 text-sm">Selling Price</p>
      <p className="font-bold text-xl">
        ${product.selling_price}
      </p>
    </div>

    <div className="bg-green-100 rounded-xl p-4">
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

          <div className="rounded-2xl bg-purple-50 p-6">

            <h3 className="font-bold text-xl">
              🤖 AI Recommendation
            </h3>

            <p className="mt-3 text-gray-600 leading-7">
  {product.ai_reason ||
    `AI Analysis

• High demand detected in ${product.country}.

• Estimated profit is $${product.profit} per sale.

• Competition level: ${product.competition}.

• Recommended platform: ${product.platform}.

• This product has excellent viral potential and is suitable for TikTok Ads, Instagram Reels and Shopify stores.

• Recommended action: Launch immediately with video creatives.`}
</p>

          </div>

          <div className="rounded-2xl bg-blue-50 p-6">

  <h3 className="font-bold text-xl mb-4">
    📊 AI Market Analysis
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
      style={{
        width: `${market.viralPotential}%`,
      }}
    />
  </div>
</div>

    
      🌱 Evergreen Score:
      <div>
  <div className="flex justify-between mb-1">
    <span>🔥 Viral Potential</span>
    <span>{market.viralPotential}%</span>
  </div>

  <div className="w-full h-3 bg-gray-200 rounded-full">
    <div
      className="h-3 bg-pink-500 rounded-full"
      style={{
        width: `${market.viralPotential}%`,
      }}
    />
  </div>
</div>

    <p>
      📉 Market Saturation:
      <div>
  <div className="flex justify-between mb-1">
    <span>🔥 Viral Potential</span>
    <span>{market.viralPotential}%</span>
  </div>

  <div className="w-full h-3 bg-gray-200 rounded-full">
    <div
      className="h-3 bg-pink-500 rounded-full"
      style={{
        width: `${market.viralPotential}%`,
      }}
    />
  </div>
</div>
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

        </div>

      </div>

    </section>
  );
}