import { calculateProfitScore } from "./profitScore";
import { calculateTrendScore } from "./trendScore";
import { calculateCompetitionScore } from "./competitionScore";
import { calculateMarketingScore } from "./marketingScore";
import { calculateTrustScore } from "./trustScore";

export type Product = {
  supplierPrice: number;
  sellingPrice: number;
  rating: number;
  orders: number;
  shippingDays: number;
  trendScore: number;
  competitionScore: number;
  marketingScore: number;
};

export type ProductScore = {
  winningProbability: number;
  profitScore: number;
  trendScore: number;
  competitionScore: number;
  marketingScore: number;
  trustScore: number;
  launchStatus: "Launch Now" | "Watch" | "Skip";
};

export function calculateWinningProbability(
  product: Product
): ProductScore {

  const profitScore = calculateProfitScore(
    product.supplierPrice,
    product.sellingPrice
  );

  const trendScore = calculateTrendScore(product.trendScore);

  const competitionScore = calculateCompetitionScore(
    product.competitionScore
  );

  const marketingScore = calculateMarketingScore(
    product.marketingScore
  );

  const trustScore = calculateTrustScore(
    product.rating,
    product.orders,
    product.shippingDays
  );

  const winningProbability =
    profitScore +
    trendScore +
    competitionScore +
    marketingScore +
    trustScore;

  let launchStatus: ProductScore["launchStatus"] = "Skip";

  if (winningProbability >= 90) {
    launchStatus = "Launch Now";
  } else if (winningProbability >= 75) {
    launchStatus = "Watch";
  }

  return {
    winningProbability,
    profitScore,
    trendScore,
    competitionScore,
    marketingScore,
    trustScore,
    launchStatus,
  };
}