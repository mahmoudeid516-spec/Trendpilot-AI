export function calculateAIScore(product: any) {
    let score = 50;
  
    // Profit
    if (product.profit >= 30) score += 15;
    else if (product.profit >= 20) score += 10;
    else if (product.profit >= 10) score += 5;
  
    // Competition
    if (product.competition === "Low") score += 15;
    else if (product.competition === "Medium") score += 8;
  
    // Trend
    if (product.trend_score >= 90) score += 15;
    else if (product.trend_score >= 80) score += 10;
  
    // Selling Price
    if (product.selling_price >= 25) score += 5;
  
    return Math.min(score, 99);
  }