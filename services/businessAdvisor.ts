import { mapApifyProduct } from "./productMapper";
import type { ApifyProductSource } from "./productMapper";
import type { Product } from "../types/Product";

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
  profit: number;
  competition: string;
}) {
  const competition = competitionScore(product.competition);

  return Number(
    (
      product.ai_score * 0.4 +
      product.trend_score * 0.3 +
      Math.min(product.profit * 2, 100) * 0.2 +
      competition * 0.1
    ).toFixed(1)
  );
}

type ScoreableProduct = ApifyProductSource | Product;

function toMappedProduct(product: ScoreableProduct): Product {
  if ("ai_score" in product && "trend_score" in product && "profit" in product) {
    return product;
  }

  return mapApifyProduct(product);
}

export function scoreProducts(products: ScoreableProduct[]) {
  const scored = products.map((product) => {
    const mapped = toMappedProduct(product);

    return {
      ...mapped,
      opportunity_score: calculateOpportunityScore({
        ai_score: mapped.ai_score,
        trend_score: mapped.trend_score,
        profit: mapped.profit,
        competition: mapped.competition,
      }),
    };
  });

  return scored.sort(
    (a, b) => (b.opportunity_score ?? 0) - (a.opportunity_score ?? 0)
  );
}

export function getBestProduct(products: ScoreableProduct[]) {
  if (!products.length) return null;

  return scoreProducts(products)[0];
}