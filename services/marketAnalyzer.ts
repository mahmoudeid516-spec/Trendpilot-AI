export function analyzeMarket(product: any) {
    const ai = Number(product.ai_score ?? 0);
    const trend = Number(product.trend_score ?? 0);
    const profit = Number(product.profit ?? 0);
  
    const competition =
      product.competition === "Low"
        ? 20
        : product.competition === "Medium"
        ? 55
        : 85;
  
    const saturation = competition;
  
    const viralPotential = Math.min(
      100,
      Math.round(ai * 0.6 + trend * 0.4)
    );
  
    const evergreen = Math.min(
      100,
      Math.round(trend * 0.7 + 30)
    );
  
    const recommendedBudget =
      profit >= 25
        ? 300
        : profit >= 15
        ? 150
        : 75;
  
    const cpa = Math.max(
      5,
      Math.round(30 - ai / 5)
    );
  
    const cpm = Math.max(
      4,
      Math.round(20 - trend / 6)
    );
  
    return {
      saturation,
      viralPotential,
      evergreen,
      recommendedBudget,
      cpa,
      cpm,
    };
  }