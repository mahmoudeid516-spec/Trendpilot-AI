"use client";

import type { Product } from "../../../types/Product";

type Decision = {
  verdict: string;
  confidence: number;
  winningProbability: number;
  risk: string;
  difficulty: string;
  demand: string;
};

type Market = {
  recommendedBudget: number;
};

type Props = {
  product: Product;
  decision: Decision;
  market: Market;
};

export default function ProductHero({
  product,
  decision,
  market,
}: Props) {
  return (
    <div className="space-y-8">
      {/* Main Hero */}

      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 p-8 text-white rounded-3xl">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
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
              {decision.confidence}
            </div>

            <p className="uppercase tracking-wider">
              AI Score
            </p>
          </div>
        </div>
      </div>

      {/* AI Decision */}

      <div className="rounded-3xl border border-purple-200 bg-gradient-to-r from-purple-700 to-indigo-700 p-8 text-white">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
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
    </div>
  );
}