"use client";

type Market = {
  viralPotential: number;
  recommendedBudget: number;
  cpm: number;
  cpa: number;
};

type Props = {
  market: Market;
  loading: boolean;
  marketing: string;
  onGenerateMarketing: () => void;
};

export default function MarketIntelligence({
  market,
  loading,
  marketing,
  onGenerateMarketing,
}: Props) {
  return (
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
                style={{
                  width: `${market.viralPotential}%`,
                }}
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
          onClick={onGenerateMarketing}
          disabled={loading}
          className="flex-1 rounded-xl bg-purple-600 py-4 font-bold text-white transition hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? "Generating..." : "🚀 Generate Marketing"}
        </button>

        <button className="flex-1 rounded-xl bg-green-600 py-4 font-bold text-white hover:bg-green-700">
          🛒 Import to Shopify
        </button>

      </div>

      {marketing && (

        <div className="rounded-2xl border bg-gray-50 p-6">

          <h3 className="mb-4 text-2xl font-bold">
            🤖 AI Marketing Strategy
          </h3>

          <pre className="whitespace-pre-wrap text-sm leading-7">
            {marketing}
          </pre>

        </div>

      )}

    </div>
  );
}