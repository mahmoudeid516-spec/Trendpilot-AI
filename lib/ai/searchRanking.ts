import { ensureUniqueProductIds, normalizeProductId } from "../services/productIdentity";
import type { Product } from "../../types/Product";

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

export function scoreProducts(products: Product[]) {
  const scored = products.map((product) => {
    const mapped = normalizeProductId(product);

    const aiScore = Number(mapped.ai_score ?? 0);
    const trendScore = Number(mapped.trend_score ?? 0);
    const viralScore = Number(mapped.viral_score ?? 0);
    const profit = Number(mapped.profit ?? 0);
    const roi = Number(mapped.roi ?? 0);
    const buyPrice = Number(mapped.buy_price ?? 0);
    const sales = Number(mapped.sales ?? 0);
    const reviews = Number(mapped.reviews ?? 0);

    const opportunity = calculateOpportunityScore({
      ai_score: aiScore,
      trend_score: trendScore,
      viral_score: viralScore,
      profit,
      roi,
      competition: mapped.competition,
      buy_price: buyPrice,
      sales,
      reviews,
    });

    return {
      ...mapped,
      ai_score: aiScore,
      trend_score: trendScore,
      viral_score: viralScore,
      profit,
      roi,
      buy_price: buyPrice,
      sales,
      reviews,
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

export function getBestProduct(products: Product[]) {
  if (!products.length) return null;

  return ensureUniqueProductIds([...products]).sort(
    (a, b) => (b.opportunity_score ?? 0) - (a.opportunity_score ?? 0)
  )[0];
}