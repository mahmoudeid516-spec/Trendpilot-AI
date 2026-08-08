// Every field below is derived from the product's own real/estimated
// price and score inputs, or is explicitly framed as a generic starter
// idea -- never a specific claim about a country, season, or audience we
// have no real data for. winning_countries, target_audience, and
// seasonality were removed entirely (not backfilled with something else
// invented) because this app has no real geographic, demographic, or
// seasonal performance data to base them on.
export function generateBusinessAdvisor(product: any) {
  const roi =
    Math.round(
      (product.profit / product.buy_price) * 100
    ) || 0;

  const aiScore = Number(product.ai_score ?? 0);

  // Scales with the product's own AI score instead of a flat constant --
  // still a heuristic estimate, but at least tied to real per-product
  // input rather than identical for every product regardless of economics.
  const estimatedDailyAdBudget =
    aiScore >= 95
      ? 100
      : aiScore >= 90
      ? 70
      : aiScore >= 80
      ? 40
      : 20;

  return {
    overall_rating: Math.min(aiScore, 99),

    should_sell: aiScore >= 85 ? "YES" : "MAYBE",

    expected_roi: `${roi}%`,

    example_marketing_angles: [
      "Problem → Solution",
      "Before & After",
      "UGC Videos",
    ],

    estimated_daily_ad_budget: `$${estimatedDailyAdBudget}/day`,

    organic_potential:
      Number(product.trend_score ?? 0) >= 90 ? 95 : 80,

    scaling_potential: aiScore >= 90 ? 94 : 82,

    suggested_price: `$${product.selling_price}`,

    example_upsells: [
      "Premium Version",
      "Accessories",
      "Bundle Offer",
    ],

    estimate_note:
      "All ratings, budgets, and pricing above are heuristic estimates derived from this product's own AI score and price -- not verified market, geographic, demographic, or seasonal data. Marketing angles and upsells are generic starter ideas, not personalized analysis.",
  };
}
