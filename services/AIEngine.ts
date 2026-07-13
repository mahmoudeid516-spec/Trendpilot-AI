import type { Product } from "../types/Product";

export type AIReport = {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
  marketingAngle: string;
  tiktokHook: string;
  facebookHeadline: string;
  cta: string;
};

export function analyzeProduct(product: Product): AIReport {
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (product.ai_score >= 90) {
    strengths.push("Excellent AI confidence.");
  } else if (product.ai_score >= 75) {
    strengths.push("Strong AI confidence.");
  } else {
    weaknesses.push("AI confidence is below average.");
  }

  if (product.trend_score >= 85) {
    strengths.push("Rapidly growing trend.");
  } else if (product.trend_score < 60) {
    weaknesses.push("Trend is weak.");
  }

  if (product.profit >= 30) {
    strengths.push("Excellent profit margin.");
  } else {
    weaknesses.push("Profit margin is limited.");
  }

  if (product.competition === "Low") {
    strengths.push("Low competition.");
  } else if (product.competition === "High") {
    weaknesses.push("High competition.");
  }

  return {
    summary:
      "TrendPilot AI analyzed this product using AI score, trend, competition and profitability.",

    strengths,

    weaknesses,

    recommendation:
      strengths.length >= weaknesses.length
        ? "Recommended for testing."
        : "Needs more validation.",

    marketingAngle:
      "Focus on solving a daily problem while highlighting convenience and quality.",

    tiktokHook:
      "This product is going viral... here's why everyone wants it!",

    facebookHeadline:
      "Discover the product everyone's talking about.",

    cta:
      "Start selling today before the competition catches up."
  };
}