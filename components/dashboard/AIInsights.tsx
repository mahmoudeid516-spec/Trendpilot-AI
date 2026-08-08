import type { Product } from "../../types/Product";

type Insight = {
  title: string;
  description: string;
  icon: string;
  color: string;
};

// Every insight here is derived from the user's own saved products --
// nothing here claims market-wide knowledge (best country, viral category,
// etc.) that this app has no real data source for. If that changes (a real
// trend/demand data source is added), this can grow back into genuine
// market intelligence -- until then, it should not pretend to have it.
function buildInsights(products: Product[]): Insight[] {
  const insights: Insight[] = [];

  const byOpportunity = [...products].sort(
    (a, b) => (b.opportunity_score ?? 0) - (a.opportunity_score ?? 0)
  );
  const topProduct = byOpportunity[0];

  if (topProduct) {
    insights.push({
      title: "Top Opportunity",
      description: `"${topProduct.name}" has your highest Opportunity Score (${
        topProduct.opportunity_score ?? 0
      }%) among saved products.`,
      icon: "🚀",
      color: "from-green-500 to-emerald-500",
    });
  }

  const highCompetitionCount = products.filter(
    (p) => p.competition === "High"
  ).length;

  if (highCompetitionCount > 0) {
    insights.push({
      title: "Competition Watch",
      description: `${highCompetitionCount} of your saved product${
        highCompetitionCount === 1 ? "" : "s"
      } face${highCompetitionCount === 1 ? "s" : ""} high competition. Consider differentiated creatives or a narrower niche for these.`,
      icon: "⚠️",
      color: "from-orange-500 to-red-500",
    });
  }

  const platformCounts = new Map<string, number>();
  for (const p of products) {
    const key = p.platform || "Unknown";
    platformCounts.set(key, (platformCounts.get(key) ?? 0) + 1);
  }
  const topPlatform = [...platformCounts.entries()].sort((a, b) => b[1] - a[1])[0];

  if (topPlatform) {
    insights.push({
      title: "Most-Saved Platform",
      description: `${topPlatform[0]} accounts for ${topPlatform[1]} of your ${products.length} saved product${
        products.length === 1 ? "" : "s"
      }.`,
      icon: "🌎",
      color: "from-blue-500 to-cyan-500",
    });
  }

  const categoryCounts = new Map<string, number>();
  for (const p of products) {
    const key = p.category || "Uncategorized";
    categoryCounts.set(key, (categoryCounts.get(key) ?? 0) + 1);
  }
  const topCategory = [...categoryCounts.entries()].sort((a, b) => b[1] - a[1])[0];

  if (topCategory) {
    insights.push({
      title: "Most-Saved Category",
      description: `${topCategory[0]} is your most-saved category (${topCategory[1]} product${
        topCategory[1] === 1 ? "" : "s"
      }).`,
      icon: "🔥",
      color: "from-pink-500 to-purple-500",
    });
  }

  const highScoreCount = products.filter(
    (p) => (p.ai_score ?? 0) >= 90 && p.competition !== "High"
  ).length;

  insights.push({
    title: "AI Tip",
    description:
      highScoreCount > 0
        ? `You have ${highScoreCount} product${
            highScoreCount === 1 ? "" : "s"
          } with AI Score ≥ 90 and manageable competition -- good candidates to test first.`
        : "Search for products above to start building your saved list -- insights here are generated from your own saved products.",
    icon: "🤖",
    color: "from-violet-500 to-indigo-500",
  });

  return insights;
}

type Props = {
  products: Product[];
};

export default function AIInsights({ products }: Props) {
  const insights = buildInsights(products);
  const hasProducts = products.length > 0;

  return (
    <section className="mt-10">

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-3xl font-bold">
            🤖 AI Insights
          </h2>

          <p className="text-gray-500 mt-2">
            {hasProducts
              ? `Based on your ${products.length} saved product${products.length === 1 ? "" : "s"}.`
              : "Save products to generate insights."}
          </p>

        </div>

        {hasProducts && (
          <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
            From your data
          </span>
        )}

      </div>

      {!hasProducts ? (
        <div className="rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-lg">
          <p className="text-xl font-bold text-gray-700">
            No insights yet
          </p>
          <p className="mt-2 text-gray-500">
            Search for a product above and save results to see AI insights based on your own data.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">

          {insights.map((item) => (

            <div
              key={item.title}
              className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-7 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >

              <div
                className={`absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br ${item.color} opacity-10`}
              />

              <div className="relative z-10 flex gap-5">

                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${item.color} text-3xl shadow-lg`}
                >
                  {item.icon}
                </div>

                <div>

                  <h3 className="text-xl font-bold text-gray-900">
                    {item.title}
                  </h3>

                  <p className="mt-3 leading-7 text-gray-600">
                    {item.description}
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>
      )}

    </section>
  );
}
