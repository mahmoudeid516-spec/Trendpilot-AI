import type { Product } from "../types/Product";

export function generateAdvice(product: Product): string[] {
  const advice: string[] = [];

  if (product.competition === "Low") {
    advice.push("Low competition makes this product easier to enter.");
  }

  if (product.profit >= 30) {
    advice.push("Healthy profit margin allows room for advertising.");
  }

  if (product.trend_score >= 80) {
    advice.push("The trend is strong and demand is growing.");
  }

  if (product.ai_score >= 90) {
    advice.push("AI confidence is very high.");
  }

  return advice;
}