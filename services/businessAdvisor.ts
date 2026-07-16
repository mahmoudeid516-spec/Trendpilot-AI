function competitionScore(level: string) {
  switch (level) {
    case "Low":
      return 100;

    case "Medium":
      return 70;

    case "High":
      return 30;

    default:
      return 50;
  }
}

function calculateOpportunityScore(product: {
  ai_score: number;
  trend_score: number;
  viral_score: number;
  profit: number;
  roi: number;
  competition: string;
  buy_price: number;
  sales: number;
  reviews: number;
}) {

  let score = 0;

  // AI
  score += product.ai_score * 0.25;

  // Trend
  score += product.trend_score * 0.20;

  // Viral
  score += product.viral_score * 0.15;

  // Profit
  score += Math.min(product.profit * 4, 100) * 0.15;

  // ROI
  score += Math.min(product.roi, 100) * 0.10;

  // Competition
  score += competitionScore(product.competition) * 0.10;

  // Cheap Products
  if (product.buy_price >= 5 && product.buy_price <= 30)
    score += 5;

  // High Sales
  if (product.sales >= 5000)
    score += 8;
  else if (product.sales >= 1000)
    score += 5;

  // Reviews
  if (product.reviews >= 1000)
    score += 5;
  else if (product.reviews >= 300)
    score += 3;

  return Math.min(100, Number(score.toFixed(1)));
}

export function scoreProducts(products: any[]) {

  const scored = products.map((product) => {

    const opportunity = calculateOpportunityScore({

      ai_score: Number(product.ai_score ?? 0),

      trend_score: Number(product.trend_score ?? 0),

      viral_score: Number(product.viral_score ?? 0),

      profit: Number(product.profit ?? 0),

      roi: Number(product.roi ?? 0),

      competition: product.competition ?? "Medium",

      buy_price: Number(product.buy_price ?? 0),

      sales: Number(product.sales ?? 0),

      reviews: Number(product.reviews ?? 0),

    });

    return {

      ...product,

      opportunity_score: opportunity,

      winning_probability: Math.round(
        opportunity * 0.6 +
        Number(product.ai_score ?? 0) * 0.4
      ),

      decision:
        opportunity >= 90
          ? "🔥 Strong Buy"
          : opportunity >= 75
          ? "🟡 Test First"
          : "❌ Avoid",

    };

  });

  return scored.sort(
    (a, b) =>
      (b.opportunity_score ?? 0) -
      (a.opportunity_score ?? 0)
  );
}

export function getBestProduct(products: any[]) {

  if (!products.length) return null;

  return [...products].sort(
    (a, b) =>
      (b.opportunity_score ?? 0) -
      (a.opportunity_score ?? 0)
  )[0];

}