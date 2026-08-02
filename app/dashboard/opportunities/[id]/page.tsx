import { notFound } from "next/navigation";
import { getOpportunityById } from "../../../../services/opportunities";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OpportunityDetailsPage({
  params,
}: Props) {
  const { id } = await params;

  const product = await getOpportunityById(Number(id));

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl p-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-2xl border bg-white p-6 object-contain"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold">
            {product.name}
          </h1>

          <div className="flex gap-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
              {product.marketplace}
            </span>

            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
              {product.category}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="rounded-xl border p-4">
              <p className="text-sm text-gray-500">
                Opportunity Score
              </p>

              <p className="text-2xl font-bold text-green-600">
                {product.opportunityScore}%
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-sm text-gray-500">
                Trend Score
              </p>

              <p className="text-2xl font-bold text-cyan-600">
                {product.trendScore}%
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-sm text-gray-500">
                Estimated Profit
              </p>

              <p className="text-2xl font-bold text-purple-600">
                ${product.estimatedProfit}
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-sm text-gray-500">
                Confidence
              </p>

              <p className="text-2xl font-bold text-blue-600">
                {product.confidence}%
              </p>
            </div>
          </div>

          <div className="rounded-xl border p-4 space-y-2">
            <p>
              <strong>Selling Price:</strong>{" "}
              ${product.sellingPrice ?? 0}
            </p>

            <p>
              <strong>Buy Price:</strong>{" "}
              ${product.buyPrice ?? 0}
            </p>

            <p>
              <strong>Rating:</strong>{" "}
              {product.rating ?? "-"} ⭐
            </p>

            <p>
              <strong>Reviews:</strong>{" "}
              {product.reviews?.toLocaleString() ?? "-"}
            </p>

            <p>
              <strong>Sales:</strong>{" "}
              {product.sales?.toLocaleString() ?? "-"}
            </p>

            <p>
              <strong>Competition:</strong>{" "}
              {product.competition}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-5">
            <h2 className="mb-2 text-lg font-bold">
              AI Analysis
            </h2>

            <p className="text-gray-600">
              {product.aiExplanation}
            </p>
          </div>

          {product.productUrl && (
            <a
              href={product.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Open Product
            </a>
          )}
        </div>
      </div>
    </div>
  );
}