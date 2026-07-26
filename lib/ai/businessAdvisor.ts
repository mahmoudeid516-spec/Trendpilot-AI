import type { ProductLike } from "../../types/Product";

export function generateBusinessAdvisor(product: ProductLike) {
    const profit = Number(product.profit ?? 0);
    const buyPrice = Number(product.buy_price ?? 0);
    const aiScore = Number(product.ai_score ?? 0);
    const trendScore = Number(product.trend_score ?? 0);
    const roi =
      Math.round(
        (profit / Math.max(1, buyPrice)) * 100
      ) || 0;
  
    return {
      overall_rating: Math.min(aiScore, 99),
  
      should_sell:
        aiScore >= 85 ? "YES" : "MAYBE",
  
      expected_roi: `${roi}%`,
  
      winning_countries: [
        "USA",
        "UK",
        "Germany"
      ],
  
      target_audience: [
        "18-34",
        "Online Shoppers",
        product.category ?? "General"
      ],
  
      marketing_angles: [
        "Problem → Solution",
        "Before & After",
        "UGC Videos"
      ],
  
      ad_budget: "$20/day",
  
      organic_potential:
        trendScore >= 90 ? 95 : 80,
  
      scaling_potential:
        aiScore >= 90 ? 94 : 82,
  
      seasonality: "All Year",
  
      suggested_price: `$${Number(product.selling_price ?? 0)}`,
  
      upsells: [
        "Premium Version",
        "Accessories",
        "Bundle Offer"
      ]
    };
  }