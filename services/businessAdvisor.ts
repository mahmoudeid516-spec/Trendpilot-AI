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

export function scoreProducts(products: any[]) {
  const scored = products.map((product) => {
    const mapped = mapApifyProduct(product);

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

export function getBestProduct(products: any[]) {
  if (!products.length) return null;

  return scoreProducts(products)[0];
}