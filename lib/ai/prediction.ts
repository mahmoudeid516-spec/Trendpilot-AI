import type { ProductLike } from "../../types/Product";

export function predictSuccess(product: ProductLike) {

  const aiScore = Number(product.ai_score ?? 80);

  let trendStage = "Growing";

  if (aiScore >= 95) trendStage = "Exploding";
  else if (aiScore >= 88) trendStage = "Trending";
  else if (aiScore < 70) trendStage = "Declining";

  let marketSaturation = "Medium";

  if (product.competition === "Low")
    marketSaturation = "Low";

  if (product.competition === "High")
    marketSaturation = "High";

  let difficulty = "Medium";

  if (marketSaturation === "Low")
    difficulty = "Easy";

  if (marketSaturation === "High")
    difficulty = "Hard";

  return {
    success_probability: aiScore,
    trend_stage: trendStage,
    market_saturation: marketSaturation,
    difficulty,
  };
}