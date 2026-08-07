import type { DiscoveredProductInput } from "../normalizeDiscoverProducts";

function scoreProduct(product: DiscoveredProductInput) {
  let score = 0;

  // AI
  score += (product.ai_score ?? 0) * 0.30;

  // Opportunity
  score += (product.opportunity_score ?? 0) * 0.25;

  // Trend
  score += (product.trend_score ?? 0) * 0.20;

  // Profit
  score += Math.min(product.profit ?? 0, 50);

  // Rating
  score += (product.rating ?? 0) * 4;

  // Reviews
  const reviews = product.reviews ?? 0;

  if (reviews > 100 && reviews < 3000)
    score += 12;
  else if (reviews >= 3000)
    score += 5;

  // Sales
  if ((product.sales ?? 0) > 500)
    score += 10;

  // Amazon Choice
  if (product.is_amazon_choice)
    score += 12;

  // Best Seller
  if (product.is_best_seller)
    score += 10;

  // Competition
  switch (product.competition) {
    case "Low":
      score += 15;
      break;

    case "Medium":
      score += 5;
      break;

    case "High":
      score -= 10;
      break;
  }

  return score;
}

export function rankProducts(
  products: DiscoveredProductInput[]
) {
  return [...products].sort(
    (a, b) => scoreProduct(b) - scoreProduct(a)
  );
}