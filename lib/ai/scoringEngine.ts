export type ScoreInput = {
  sellingPrice?: number;
  buyPrice?: number;
  profit?: number;

  rating?: number;
  reviews?: number;
  sales?: number;

  isAmazonChoice?: boolean;
  isBestSeller?: boolean;
};

export type ScoreResult = {
  aiScore: number;
  trendScore: number;
  opportunityScore: number;

  competition: "Low" | "Medium" | "High";
  successProbability: number;
  marketSaturation: "Low" | "Medium" | "High";
};

function clamp(value: number, min = 0, max = 99) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

export function calculateScores(
  input: ScoreInput
): ScoreResult {
  const rating = input.rating ?? 0;
  const reviews = input.reviews ?? 0;
  const sales = input.sales ?? 0;

  const sellingPrice = input.sellingPrice ?? 0;
  const buyPrice = input.buyPrice ?? 0;

  const profit =
    input.profit ??
    (sellingPrice > 0 && buyPrice > 0
      ? sellingPrice - buyPrice
      : 0);

  const margin =
    sellingPrice > 0
      ? (profit / sellingPrice) * 100
      : 0;

  // ------------------------------------
  // Competition
  // ------------------------------------

  let competition: "Low" | "Medium" | "High";

  if (
    reviews > 5000 ||
    sales > 10000 ||
    input.isBestSeller
  ) {
    competition = "High";
  } else if (
    reviews > 1000 ||
    sales > 3000
  ) {
    competition = "Medium";
  } else {
    competition = "Low";
  }

  // ------------------------------------
  // AI SCORE
  // ------------------------------------

  let ai = 0;

  // Rating (0-45)
  ai += (rating / 5) * 45;

  // Reviews (0-20)
  ai += Math.min(
    Math.log10(reviews + 1) * 5,
    20
  );

  // Sales (0-20)
  ai += Math.min(
    Math.log10(sales + 1) * 5,
    20
  );

  // Margin (0-10)
  ai += Math.min(margin / 5, 10);

  // Profit (0-10)
  ai += Math.min(profit / 5, 10);

  // Amazon Badges
  if (input.isAmazonChoice) ai += 5;
  if (input.isBestSeller) ai += 5;

  ai = clamp(ai);

  // ------------------------------------
  // TREND SCORE
  // ------------------------------------

  let trend = 0;

  trend += Math.min(
    Math.log10(sales + 1) * 30,
    50
  );

  trend += Math.min(
    Math.log10(reviews + 1) * 10,
    20
  );

  if (input.isBestSeller) trend += 15;
  if (input.isAmazonChoice) trend += 10;

  trend = clamp(trend);

  // ------------------------------------
  // OPPORTUNITY SCORE
  // ------------------------------------

  let opportunity =
    ai * 0.40 +
    trend * 0.25 +
    Math.min(profit, 40) * 0.50 +
    margin * 0.25;

  // Competition Bonus
  if (competition === "Low") {
    opportunity += 10;
  } else if (competition === "Medium") {
    opportunity += 5;
  }

  // Margin Bonus
  if (margin >= 40) {
    opportunity += 5;
  }

  // Amazon Choice Bonus
  if (input.isAmazonChoice) {
    opportunity += 3;
  }

  // Best Seller Bonus
  if (input.isBestSeller) {
    opportunity += 3;
  }

  opportunity = clamp(opportunity);

  // ------------------------------------
  // MARKET SATURATION
  // ------------------------------------

  let marketSaturation:
    | "Low"
    | "Medium"
    | "High";

  if (sales > 10000) {
    marketSaturation = "High";
  } else if (sales > 3000) {
    marketSaturation = "Medium";
  } else {
    marketSaturation = "Low";
  }

  // ------------------------------------
  // SUCCESS PROBABILITY
  // ------------------------------------

  const successProbability = clamp(
    opportunity * 0.45 +
      ai * 0.30 +
      trend * 0.25
  );

  return {
    aiScore: ai,
    trendScore: trend,
    opportunityScore: opportunity,
    competition,
    successProbability,
    marketSaturation,
  };
}