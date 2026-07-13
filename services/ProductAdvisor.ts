import type { Product } from "../types/Product";

export function generateProductAdvice(
  product: Product
): string[] {

  const advice: string[] = [];

  if (product.ai_score >= 90) {
    advice.push("✅ AI strongly recommends this product.");
  } else if (product.ai_score >= 75) {
    advice.push("👍 Strong AI confidence.");
  } else {
    advice.push("⚠ AI confidence is moderate.");
  }

  if (product.trend_score >= 85) {
    advice.push("📈 Trend is growing rapidly.");
  } else if (product.trend_score >= 60) {
    advice.push("📊 Stable market demand.");
  } else {
    advice.push("📉 Trend is weak.");
  }

  if (product.profit >= 30) {
    advice.push("💰 Excellent profit margin.");
  } else if (product.profit >= 15) {
    advice.push("💵 Good profit opportunity.");
  } else {
    advice.push("⚠ Low profit margin.");
  }

  switch (product.competition) {
    case "Low":
      advice.push("🚀 Low competition makes scaling easier.");
      break;

    case "Medium":
      advice.push("⚖️ Medium competition.");
      break;

    case "High":
      advice.push("🔥 High competition.");
      break;

    default:
      advice.push("📌 Competition data unavailable.");
  }

  return advice;
}