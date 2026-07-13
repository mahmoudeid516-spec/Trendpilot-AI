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

  return (
    <div className="mt-8 rounded-3xl bg-white shadow-xl border border-gray-100 p-8">

      <h2 className="text-3xl font-bold mb-8">
        📈 AI Sales Forecast
      </h2>

      <div className="grid md:grid-cols-4 gap-6">

        <div className="rounded-2xl bg-blue-50 p-6">
          <p className="text-gray-500">Expected Orders</p>
          <h2 className="text-4xl font-bold mt-3">
            {orders}
          </h2>
        </div>

        <div className="rounded-2xl bg-green-50 p-6">
          <p className="text-gray-500">Revenue</p>
          <h2 className="text-4xl font-bold mt-3">
            ${revenue.toLocaleString()}
          </h2>
        </div>

        <div className="rounded-2xl bg-purple-50 p-6">
          <p className="text-gray-500">Profit</p>
          <h2 className="text-4xl font-bold mt-3">
            ${totalProfit.toLocaleString()}
          </h2>
        </div>

        <div className="rounded-2xl bg-orange-50 p-6">
          <p className="text-gray-500">Confidence</p>
          <h2 className="text-4xl font-bold mt-3">
            {confidence}%
          </h2>
        </div>

      </div>

    </div>
  );
}