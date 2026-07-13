import type { Product } from "../../types/Product";
import { generateAdvice } from "../../services/advisor";

type Props = {
  product: Product;
};

export default function AIRecommendation({ product }: Props) {
  const advice = generateAdvice(product);

  return (
    <div className="mt-10 rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white">
      <h2 className="text-3xl font-bold">
        🤖 TrendPilot Recommendation
      </h2>

      <p className="mt-2 text-purple-100">
        Based on your search, our AI recommends:
      </p>

      <div className="mt-6 inline-flex items-center rounded-full bg-yellow-400 px-4 py-2 font-bold text-black">
        🏆 AI TOP PICK
      </div>

      <h3 className="mt-6 text-4xl font-bold">
        {product.name}
      </h3>

      <p className="mt-3 text-lg">
        🔥 Winning Probability{" "}
        <strong
          className={`${
            (product.opportunity_score ?? 0) >= 90
              ? "text-green-300"
              : (product.opportunity_score ?? 0) >= 75
              ? "text-yellow-300"
              : "text-red-300"
          }`}
        >
          {product.opportunity_score?.toFixed(1)}%
        </strong>
      </p>

      <p className="mt-2 text-sm text-purple-100">
        {product.ai_score >= 95
          ? "Extremely High Confidence"
          : product.ai_score >= 85
          ? "High Confidence"
          : product.ai_score >= 70
          ? "Medium Confidence"
          : "Low Confidence"}
      </p>

      <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-5">
        <div className="rounded-xl bg-white/10 p-4 text-center">
          <p className="text-sm">Opportunity</p>

          <h4
            className={`text-3xl font-bold ${
              (product.opportunity_score ?? 0) >= 90
                ? "text-green-300"
                : (product.opportunity_score ?? 0) >= 75
                ? "text-yellow-300"
                : "text-red-300"
            }`}
          >
            {product.opportunity_score?.toFixed(1)}%
          </h4>
        </div>

        <div className="rounded-xl bg-white/10 p-4 text-center">
          <p className="text-sm">AI Score</p>

          <h4
            className={`text-3xl font-bold ${
              product.ai_score >= 90
                ? "text-green-300"
                : product.ai_score >= 75
                ? "text-yellow-300"
                : "text-red-300"
            }`}
          >
            {product.ai_score}%
          </h4>
        </div>

        <div className="rounded-xl bg-white/10 p-4 text-center">
          <p className="text-sm">Profit</p>

          <h4 className="text-3xl font-bold">
            ${product.profit}
          </h4>
        </div>

        <div className="rounded-xl bg-white/10 p-4 text-center">
          <p className="text-sm">Competition</p>

          <h4 className="text-2xl font-bold">
            {product.competition}
          </h4>
        </div>

        <div className="rounded-xl bg-white/10 p-4 text-center">
          <p className="text-sm">Trend</p>

          <h4 className="text-3xl font-bold">
            {product.trend_score}
          </h4>
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-white/10 p-6">
        <h3 className="mb-4 text-xl font-bold">
          Why TrendPilot recommends this product
        </h3>

        <div className="mb-5 rounded-xl bg-white/10 p-4">
          <p className="font-bold">AI Summary</p>

          <p className="mt-2 text-sm">
            This recommendation is based on demand,
            competition, profit margin, market trend,
            and AI opportunity analysis.
          </p>
        </div>

        <ul className="space-y-2">
          {advice.map((item) => (
            <li key={item}>✅ {item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}