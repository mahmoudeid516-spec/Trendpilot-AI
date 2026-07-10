export function analyzeCompetition(product: any) {
    let saturation = "Medium";
    let difficulty = "Medium";
  
    if (product.competition === "Low") {
      saturation = "Low";
      difficulty = "Easy";
    }
  
    if (product.competition === "High") {
      saturation = "High";
      difficulty = "Hard";
    }
  
    let recommendation = "";
  
    if (difficulty === "Easy") {
      recommendation =
        "Excellent opportunity. Launch as soon as possible.";
    } else if (difficulty === "Medium") {
      recommendation =
        "Good opportunity. Use strong branding and marketing.";
    } else {
      recommendation =
        "Highly competitive market. Focus on differentiation.";
    }
  
    return {
      saturation,
      difficulty,
      recommendation,
    };
  }