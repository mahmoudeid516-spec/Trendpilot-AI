export function predictSuccess(product: any) {
    let probability = 60;
  
    if (product.profit >= 30) probability += 15;
    else if (product.profit >= 20) probability += 10;
  
    if (product.competition === "Low") probability += 10;
    else if (product.competition === "Medium") probability += 5;
  
    if (product.trend_score >= 90) probability += 10;
    else if (product.trend_score >= 80) probability += 5;
  
    const successProbability = Math.min(probability, 99);
  
    let trendStage = "Growing";
  
    if (product.trend_score >= 95) {
      trendStage = "Exploding";
    } else if (product.trend_score >= 85) {
      trendStage = "Trending";
    } else if (product.trend_score < 70) {
      trendStage = "Declining";
    }
  
    let marketSaturation = "Medium";
  
    if (product.competition === "Low") {
      marketSaturation = "Low";
    } else if (product.competition === "High") {
      marketSaturation = "High";
    }
  
    let difficulty = "Medium";
  
    if (
      successProbability >= 90 &&
      product.competition === "Low"
    ) {
      difficulty = "Easy";
    } else if (product.competition === "High") {
      difficulty = "Hard";
    }
  
    return {
      success_probability: successProbability,
      trend_stage: trendStage,
      market_saturation: marketSaturation,
      difficulty,
    };
  }