import type { Product } from "../types/Product";

export function generateAdvice(product: Product): string[] {
  const advice: string[] = [];

  // AI Score
  if (product.ai_score >= 95) {
    advice.push("Excellent AI confidence based on multiple market indicators.");
  } else if (product.ai_score >= 85) {
    advice.push("High AI confidence with strong market potential.");
  } else {
    advice.push("AI recommends testing this product before scaling.");
  }

  // Competition
  if (product.competition === "Low") {
    advice.push("Low competition makes market entry easier.");
  } else if (product.competition === "Medium") {
    advice.push("Moderate competition requires strong creatives.");
  } else {
    advice.push("High competition detected. Focus on branding and differentiation.");
  }

  // Profit
  if (product.profit >= 30) {
    advice.push("Excellent profit margin for paid advertising.");
  } else if (product.profit >= 15) {
    advice.push("Healthy profit margin with good scaling potential.");
  } else {
    advice.push("Profit margin is limited. Optimize pricing before scaling.");
  }

  // Trend
  if (product.trend_score >= 90) {
    advice.push("Demand is growing rapidly.");
  } else if (product.trend_score >= 75) {
    advice.push("Product shows stable market demand.");
  } else {
    advice.push("Demand is currently average. Validate with additional research.");
  }

  // Opportunity
  if ((product.opportunity_score ?? 0) >= 90) {
    advice.push("Strong Buy according to the TrendPilot AI engine.");
  } else if ((product.opportunity_score ?? 0) >= 75) {
    advice.push("Good opportunity with room for growth.");
  } else {
    advice.push("Proceed carefully and test with a small advertising budget.");
  }

  return advice;
}