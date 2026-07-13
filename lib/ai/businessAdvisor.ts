export function generateBusinessAdvisor(product: any) {
    const roi =
      Math.round(
        (product.profit / product.buy_price) * 100
      ) || 0;
  
    return {
      overall_rating: Math.min(product.ai_score, 99),
  
      should_sell:
        product.ai_score >= 85 ? "YES" : "MAYBE",
  
      expected_roi: `${roi}%`,
  
      winning_countries: [
        "USA",
        "UK",
        "Germany"
      ],
  
      target_audience: [
        "18-34",
        "Online Shoppers",
        product.category
      ],
  
      marketing_angles: [
        "Problem → Solution",
        "Before & After",
        "UGC Videos"
      ],
  
      ad_budget: "$20/day",
  
      organic_potential:
        product.trend_score >= 90 ? 95 : 80,
  
      scaling_potential:
        product.ai_score >= 90 ? 94 : 82,
  
      seasonality: "All Year",
  
      suggested_price: `$${product.selling_price}`,
  
      upsells: [
        "Premium Version",
        "Accessories",
        "Bundle Offer"
      ]
    };
  }