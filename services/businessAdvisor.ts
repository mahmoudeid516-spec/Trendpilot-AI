import { mapApifyProduct } from "./productMapper";

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

  // AI Analysis (25%)
  score += product.ai_score * 0.25;

  // Trend (20%)
  score += product.trend_score * 0.20;

  // Viral Potential (15%)
  score += product.viral_score * 0.15;

  // Profit (15%)
  score += Math.min(product.profit * 4, 100) * 0.15;

  // ROI (10%)
  score += Math.min(product.roi, 100) * 0.10;

  // Competition (10%)
  score += competitionScore(product.competition) * 0.10;

  // Cheap products sell easier
  if (product.buy_price >= 10 && product.buy_price <= 35)
    score += 3;

  // High sales
  if (product.sales >= 1000)
    score += 4;

  // Reviews
  if (product.reviews >= 200)
    score += 3;

  return Math.min(100, Number(score.toFixed(1)));
}

export function scoreProducts(products: any[]) {
  const scored = products.map((product) => {

    const mapped = mapApifyProduct(product);

    const opportunity = calculateOpportunityScore({
      ai_score: mapped.ai_score,
      trend_score: mapped.trend_score,
      viral_score: mapped.viral_score,
      profit: mapped.profit,
      roi: mapped.roi ?? 0,
      competition: mapped.competition,
      buy_price: mapped.buy_price,
      sales: mapped.sales,
      reviews: mapped.reviews,
    });

    return {
      ...mapped,
      opportunity_score: opportunity,

      decision:
        opportunity >= 90
          ? "Strong Buy"
          : opportunity >= 75
          ? "Test First"
          : "Avoid",
    };
  });

  return scored.sort(
    (a, b) => (b.opportunity_score ?? 0) - (a.opportunity_score ?? 0)
  );
}

export function getBestProduct(products: any[]) {
  if (!products.length) return null;

  return [...products].sort(
    (a, b) => (b.opportunity_score ?? 0) - (a.opportunity_score ?? 0)
  )[0];
}