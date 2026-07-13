export type BusinessPlan = {
    verdict: string;
    sellingPrice: number;
    expectedProfit: number;
    dailyBudget: number;
    breakEvenSales: number;
    bestCountries: string[];
    bestPlatform: string;
    strategy: string[];
  };
  
  export function generateBusinessPlan(product: any): BusinessPlan {
  
    const buyPrice = Number(product.buy_price ?? 0);
    const ai = Number(product.ai_score ?? 0);
    const competition = product.competition ?? "Medium";
  
    const sellingPrice = Math.round(buyPrice * 2.8 * 100) / 100;
  
    const expectedProfit = Math.round(
      (sellingPrice - buyPrice) * 100
    ) / 100;
  
    const dailyBudget =
      ai >= 95
        ? 100
        : ai >= 90
        ? 70
        : ai >= 80
        ? 40
        : 20;
  
    const breakEvenSales = Math.max(
      1,
      Math.ceil(dailyBudget / Math.max(expectedProfit, 1))
    );
  
    const verdict =
      ai >= 95 && competition === "Low"
        ? "Strong Buy"
        : ai >= 85
        ? "Good Opportunity"
        : "Test Carefully";
  
    return {
      verdict,
  
      sellingPrice,
  
      expectedProfit,
  
      dailyBudget,
  
      breakEvenSales,
  
      bestCountries: [
        "USA",
        "United Kingdom",
        "Canada",
        "Germany",
      ],
  
      bestPlatform:
        ai >= 90
          ? "TikTok Ads"
          : "Facebook Ads",
  
      strategy: [
        "Launch 3 video creatives.",
        "Test for 3 days.",
        "Scale the winning creative.",
        "Expand to new countries.",
      ],
    };
  }