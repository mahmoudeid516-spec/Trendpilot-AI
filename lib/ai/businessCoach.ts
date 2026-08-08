export type BusinessPlan = {
  verdict: string;
  sellingPrice: number;
  expectedProfit: number;
  dailyBudget: number;
  breakEvenSales: number;
  bestPlatform: string;
  strategy: string[];
  estimateNote: string;
};

// Every field here is either derived from the product's own real/estimated
// price and score inputs, or an explicitly generic checklist -- never an
// invented claim about a specific country, season, or ad performance we
// have no data for. `bestCountries` and any seasonality claim were removed
// entirely rather than backfilled, because this app has no real
// geographic or seasonal performance data to base them on.
export function generateBusinessPlan(product: any): BusinessPlan {

  const buyPrice = Number(product.buy_price ?? 0);
  const ai = Number(product.ai_score ?? 0);
  const competition = product.competition ?? "Medium";

  // Heuristic markup assumption, not a verified resale price -- same
  // caveat as the pricing estimates produced elsewhere in the app.
  const sellingPrice = Math.round(buyPrice * 2.8 * 100) / 100;

  const expectedProfit = Math.round(
    (sellingPrice - buyPrice) * 100
  ) / 100;

  const dailyBudget =
    ai >= 95
      ? 100
      : ai >= 90
      ? 70
      : ai >= 80
      ? 40
      : 20;

  const breakEvenSales = Math.max(
    1,
    Math.ceil(dailyBudget / Math.max(expectedProfit, 1))
  );

  const verdict =
    ai >= 95 && competition === "Low"
      ? "Strong Buy"
      : ai >= 85
      ? "Good Opportunity"
      : "Test Carefully";

  return {
    verdict,

    sellingPrice,

    expectedProfit,

    dailyBudget,

    breakEvenSales,

    bestPlatform:
      ai >= 90
        ? "TikTok Ads"
        : "Facebook Ads",

    strategy: [
      "Launch 3 video creatives.",
      "Test for 3 days.",
      "Scale the winning creative.",
      "Expand to new countries.",
    ],

    estimateNote:
      "Pricing, budget, and platform recommendations are heuristic estimates from this product's own AI score, competition, and buy price -- not verified market, seasonal, or geographic performance data.",
  };
}
