export function analyzeCompetition(product: any) {

  let score = 80;

  if (product.competition === "Low")
    score = 95;

  if (product.competition === "Medium")
    score = 82;

  if (product.competition === "High")
    score = 60;

  let recommendation = "";

  if (score >= 90) {
    recommendation =
      "Excellent opportunity with low competition. Strong recommendation to launch.";
  }

  else if (score >= 75) {
    recommendation =
      "Good opportunity. Differentiate your branding and creatives.";
  }

  else {
    recommendation =
      "Highly competitive. Consider niche targeting or a different supplier.";
  }

  return {
    competition_score: score,
    recommendation,
  };
}