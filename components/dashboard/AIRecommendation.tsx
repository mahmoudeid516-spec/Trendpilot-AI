import type { Product } from "../../types/Product";
import { generateAdvice } from "../../services/advisor";

type Props = {
  product: Product;
};

export default function AIRecommendation({
  product,
}: Props) {
 
  const advice = generateAdvice(product);

  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl text-white p-8 mt-10">

      <h2 className="text-3xl font-bold">
        🤖 TrendPilot Recommendation
      </h2>

      <p className="mt-2 text-purple-100">
        Based on your search, our AI recommends:
      </p>

      <h3 className="text-4xl font-bold mt-6">
        {product.name}
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mt-8">

        <div className="bg-white/10 rounded-xl p-4 text-center">
          <p className="text-sm">Opportunity</p>
          <h4 className="text-3xl font-bold">
            {product.opportunity_score?.toFixed(1)}
          </h4>
        </div>

        <div className="bg-white/10 rounded-xl p-4 text-center">
          <p className="text-sm">AI Score</p>
          <h4 className="text-3xl font-bold">
            {product.ai_score}%
          </h4>
        </div>

        <div className="bg-white/10 rounded-xl p-4 text-center">
          <p className="text-sm">Profit</p>
          <h4 className="text-3xl font-bold">
            ${product.profit}
          </h4>
        </div>

        <div className="bg-white/10 rounded-xl p-4 text-center">
          <p className="text-sm">Competition</p>
          <h4 className="text-2xl font-bold">
            {product.competition}
          </h4>
        </div>

        <div className="bg-white/10 rounded-xl p-4 text-center">
          <p className="text-sm">Trend</p>
          <h4 className="text-3xl font-bold">
            {product.trend_score}
          </h4>
        </div>

      </div>

      <div className="bg-white/10 rounded-2xl p-6 mt-8">

        <h3 className="text-xl font-bold mb-4">
          Why TrendPilot recommends this product
        </h3>

        <ul className="space-y-2">

        {advice.map((item) => (
            <li key={item}>
              {item}
            </li>
          ))}

        </ul>

      </div>

    </div>
  );
}