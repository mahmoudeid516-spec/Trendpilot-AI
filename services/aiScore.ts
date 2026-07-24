import type { Product } from "../types/Product";

export type AIScore = {
  overall: number;
  trend: number;
  profit: number;
  demand: number;
  competition: number;
  saturation: number;
  scalability: number;
  recommendation: string;
};

const clamp = (value: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, value));

const round = (value: number) => Math.round(clamp(value));

export function calculateAIScore(product: Product): AIScore {
  const trend = round(Number(product.trend_score ?? 50));

  const sellingPrice = Number(product.selling_price ?? 0);
  const buyPrice = Number(product.buy_price ?? 0);

  const profitMargin =
    sellingPrice > 0
      ? ((sellingPrice - buyPrice) / sellingPrice) * 100
      : 0;

  const profit = round(profitMargin);

  const demand = round(Number(product.ai_score ?? 70));

  const competition = round(
    100 - Math.min(Number(product.review_count ?? 0) / 100, 100)
  );

  const saturation = round(
    100 - Math.min(Number(product.orders ?? 0) / 500, 100)
  );

  const scalability = round(
    (trend + profit + demand) / 3
  );

  const overall = round(
    (
      trend +
      profit +
      demand +
      competition +
      saturation +
      scalability
    ) / 6
  );

  let recommendation = "";

  if (overall >= 90) {
    recommendation =
      "Excellent opportunity. Strong candidate for scaling with paid ads.";
  } else if (overall >= 75) {
    recommendation =
      "Good product with solid potential. Test before scaling aggressively.";
  } else if (overall >= 60) {
    recommendation =
      "Average opportunity. Needs better pricing or marketing.";
  } else {
    recommendation =
      "High risk. Consider searching for a stronger product.";
  }

  return {
    overall,
    trend,
    profit,
    demand,
    competition,
    saturation,
    scalability,
    recommendation,
  };
}