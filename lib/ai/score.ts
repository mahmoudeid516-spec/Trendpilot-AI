export function calculateAIScore(product: any) {

  let score = 50;

  const profit = Number(product.profit ?? 0);
  const trend = Number(
    product.trend_score ??
    product.market_score ??
    80
  );

  const selling = Number(
    product.selling_price ?? 30
  );

  // Profit
  if (profit >= 40) score += 15;
  else if (profit >= 30) score += 12;
  else if (profit >= 20) score += 10;
  else if (profit >= 10) score += 5;

  // Trend
  if (trend >= 95) score += 15;
  else if (trend >= 90) score += 12;
  else if (trend >= 85) score += 10;
  else if (trend >= 80) score += 8;

  // Competition
  switch (product.competition) {

    case "Low":
      score += 12;
      break;

    case "Medium":
      score += 8;
      break;

    case "High":
      score += 3;
      break;
  }

  // Margin
  const margin =
    selling > 0
      ? (profit / selling) * 100
      : 0;

  if (margin >= 60) score += 5;
  else if (margin >= 50) score += 4;
  else if (margin >= 40) score += 3;

  return Math.min(score, 99);
}