import type { Product } from "../../types/Product";
import { analyzeProduct } from "../../services/AIEngine";

type Props = {
  product: Product;
};

export default function AIReport({ product }: Props) {
  const report = analyzeProduct(product);

  return (
    <section className="mt-12 bg-white rounded-3xl shadow p-8">

      <h2 className="text-3xl font-bold mb-4">
        🤖 AI Business Report
      </h2>

      <p className="text-gray-600 mb-8">
        {report.summary}
      </p>

      <div className="grid md:grid-cols-2 gap-8">

        {/* Strengths */}

        <div>

          <h3 className="text-xl font-bold text-green-600 mb-4">
            Strengths
          </h3>

          <ul className="space-y-3">

            {report.strengths.map((item) => (

              <li
                key={item}
                className="bg-green-50 rounded-xl p-4"
              >
                ✅ {item}
              </li>

            ))}

          </ul>

        </div>

        {/* Weaknesses */}

        <div>

          <h3 className="text-xl font-bold text-red-500 mb-4">
            Weaknesses
          </h3>

          <ul className="space-y-3">

            {report.weaknesses.map((item) => (

              <li
                key={item}
                className="bg-red-50 rounded-xl p-4"
              >
                ⚠️ {item}
              </li>

            ))}

          </ul>

        </div>

      </div>

      <div className="mt-10 bg-purple-600 text-white rounded-2xl p-6">

        <h3 className="text-xl font-bold">
          Recommendation
        </h3>

        <p className="mt-2">
          {report.recommendation}
        </p>

      </div>

    </section>
  );
}