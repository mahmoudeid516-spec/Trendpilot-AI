export function analyzeProduct(product: any) {
    const sales = Number(product.sales || 0);
    const reviews = Number(product.reviews || 0);
  
    const aiScore = Number(product.ai_score || 0);
    const trendScore = Number(product.trend_score || 0);
    const viralScore = Number(product.viral_score || 0);
  
    const roi = Number(product.roi || 0);
    const profit = Number(product.profit || 0);
    const price = Number(product.buy_price || 0);
  
    let recommendation = "Avoid";
  
    if (aiScore >= 90)
      recommendation = "Strong Buy";
    else if (aiScore >= 75)
      recommendation = "Test First";
    else if (aiScore >= 60)
      recommendation = "Watch";
  
    const reasons: string[] = [];
  
    if (sales >= 1000)
      reasons.push("High sales volume");
  
    if (reviews >= 200)
      reasons.push("Many customer reviews");
  
    if (profit >= 20)
      reasons.push("Good profit margin");
  
    if (roi >= 100)
      reasons.push("Excellent ROI");
  
    if (price >= 5 && price <= 30)
      reasons.push("Ideal price for dropshipping");
  
    if (viralScore >= 80)
      reasons.push("High viral potential");
  
    if (trendScore >= 80)
      reasons.push("Strong market trend");
  
    return {
      ...product,
  
      recommendation,
  
      decision: recommendation,
  
      ai_reason:
        reasons.length > 0
          ? reasons.join(" • ")
          : "No strong signals detected.",
    };
  }