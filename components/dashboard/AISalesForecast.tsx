"use client";

type Props = {
  product: any;
};

export default function AISalesForecast({ product }: Props) {
  if (!product) return null;

  const aiScore = Number(product.ai_score || 80);
  const profit = Number(product.profit || 20);

  const orders = Math.round(aiScore * 14);
  const revenue = orders * Number(product.selling_price || 30);
  const totalProfit = orders * profit;
  const confidence = Math.min(99, aiScore + 4);
  const risk =
  aiScore >= 90
    ? "Low"
    : aiScore >= 75
    ? "Medium"
    : "High";

  return (
    <div className="mt-8 rounded-3xl bg-white shadow-xl border border-gray-100 p-8">

      <h2 className="text-3xl font-bold mb-8">
      📈 30-Day AI Sales Forecast
      </h2>

      <div className="grid md:grid-cols-4 gap-6">

      <div className="mt-8 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 p-6">

<div className="flex flex-wrap items-center justify-between gap-6">

  <div>

    <p className="text-sm text-gray-500">
      AI Recommendation
    </p>

    <h3 className="mt-2 text-2xl font-bold">
      {confidence >= 90
        ? "🚀 Strong Buy"
        : confidence >= 75
        ? "✅ Worth Testing"
        : "⚠️ Needs Validation"}
    </h3>

  </div>

  <div>

    <p className="text-sm text-gray-500">
      Risk Level
    </p>

    <h3
      className={`mt-2 text-2xl font-bold ${
        risk === "Low"
          ? "text-green-600"
          : risk === "Medium"
          ? "text-orange-500"
          : "text-red-600"
      }`}
    >
      {risk}
    </h3>

  </div>

</div>

</div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
          <p className="text-gray-500">Expected Orders</p>
          <h2 className="text-4xl font-bold mt-3">
            {orders}
          </h2>
        </div>

        <div className="rounded-2xl border border-green-100 bg-green-50 p-6 shadow-sm">
          <p className="text-gray-500">Revenue</p>
          <h2 className="text-4xl font-bold mt-3">
            ${revenue.toLocaleString()}
          </h2>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-purple-50 p-6 shadow-sm">
          <p className="text-gray-500">Profit</p>
          <h2 className="text-4xl font-bold mt-3">
            ${totalProfit.toLocaleString()}
          </h2>
        </div>

        <div className="rounded-2xl border border-orange-100 bg-orange-50 p-6 shadow-sm">
          <p className="text-gray-500">Confidence</p>
          <h2 className="text-4xl font-bold mt-3">
            {confidence}%
          </h2>
        </div>

      </div>

    </div>
  );
}