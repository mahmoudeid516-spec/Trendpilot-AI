"use client";

import ProductDetails from "./ProductDetails";
import AISalesForecast from "./AISalesForecast";
import MarketingKit from "./MarketingKit";
import AICopilot from "./AICopilot";
import { generateReport } from "../../lib/ai/generateReport";

type Props = {
  open: boolean;
  product: any;
  onClose: () => void;
  subscription: string;
};

export default function ProductDrawer({
  open,
  product,
  onClose,
  subscription,
}: Props) {
  if (!open || !product) return null;

  const report =
    product.score &&
    generateReport({
      productName: product.name,
      supplierPrice: Number(product.buy_price || 0),
      sellingPrice: Number(product.selling_price || 0),
      score: product.score,
    });

  return (
    <>
      {/* Background */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
      />

      {/* Drawer */}
      <div
        className="
        fixed
        right-0
        top-0
        z-50
        h-screen
        w-full
        max-w-[900px]
          overflow-y-auto
          bg-white
          shadow-2xl
          animate-in
          slide-in-from-right
          duration-300
        "
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white/95 px-8 py-6 backdrop-blur">
          <div>
          <h2 className="max-w-[650px] text-3xl font-bold leading-tight line-clamp-2">
              🤖 {product.name}
            </h2>

            <p className="text-sm text-gray-500">
              AI Product Intelligence
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-red-500 px-4 py-2 font-bold text-white transition hover:bg-red-600"
          >
            ✕ Close
          </button>
        </div>

        {/* Content */}
        <div className="space-y-10 bg-slate-50 p-8 md:p-10">

          {report && (
            <div className="rounded-3xl border border-indigo-200 bg-indigo-50 p-6">
              <h3 className="mb-4 text-2xl font-bold">
                🤖 AI Executive Report
              </h3>

              <p className="mb-5 text-gray-700">
                {report.summary}
              </p>

              <div className="grid gap-6 md:grid-cols-2">

                <div>
                  <h4 className="mb-2 font-bold text-green-700">
                    ✅ Strengths
                  </h4>

                  <ul className="space-y-2">
                    {report.strengths.map((item: string) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-2 font-bold text-red-700">
                    ⚠ Weaknesses
                  </h4>

                  <ul className="space-y-2">
                    {report.weaknesses.length === 0 ? (
                      <li>No significant weaknesses detected.</li>
                    ) : (
                      report.weaknesses.map((item: string) => (
                        <li key={item}>• {item}</li>
                      ))
                    )}
                  </ul>
                </div>

              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">

                <div className="rounded-2xl bg-white p-4 shadow">
                  <p className="text-sm text-gray-500">
                    Recommendation
                  </p>

                  <h3 className="mt-2 text-xl font-bold">
                    {report.recommendation}
                  </h3>
                </div>

                <div className="rounded-2xl bg-white p-4 shadow">
                  <p className="text-sm text-gray-500">
                    Margin
                  </p>

                  <h3 className="mt-2 text-xl font-bold">
                    {report.estimatedMargin}
                  </h3>
                </div>

                <div className="rounded-2xl bg-white p-4 shadow">
                  <p className="text-sm text-gray-500">
                    Suggested Price
                  </p>

                  <h3 className="mt-2 text-xl font-bold">
                    ${report.suggestedSellingPrice}
                  </h3>
                </div>

              </div>
            </div>
          )}

          <ProductDetails product={product} />

          {subscription !== "free" && (
            <>
              <AISalesForecast product={product} />

              <MarketingKit
                productName={product.name}
              />

<AICopilot product={product} />
            </>
          )}

        </div>
      </div>
    </>
  );
}