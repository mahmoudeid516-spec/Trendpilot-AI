export type DecisionResult = {
    verdict: "Strong Buy" | "Good Opportunity" | "Avoid";
    risk: "Low" | "Medium" | "High";
    difficulty: "Easy" | "Medium" | "Hard";
    demand: "Very High" | "High" | "Medium" | "Low";
    winningProbability: number;
    confidence: number;
    reasons: string[];
  };
  
  export function analyzeProduct(product: any): DecisionResult {
    const ai = Number(product.ai_score ?? 0);
    const trend = Number(product.trend_score ?? 0);
    const profit = Number(product.profit ?? 0);
    const competition = product.competition ?? "Medium";
  
    const winningProbability = Math.min(
      100,
      Math.round(
        ai * 0.4 +
        trend * 0.3 +
        Math.min(profit * 2, 100) * 0.2 +
        (competition === "Low"
          ? 100
          : competition === "Medium"
          ? 70
          : 30) * 0.1
      )
    );
  
    let verdict: DecisionResult["verdict"] = "Avoid";
  
    if (
      winningProbability >= 90 &&
      competition === "Low"
    ) {
      verdict = "Strong Buy";
    } else if (winningProbability >= 70) {
      verdict = "Good Opportunity";
    }
  
    const risk =
      competition === "Low"
        ? "Low"
        : competition === "Medium"
        ? "Medium"
        : "High";
  
    const difficulty =
      competition === "Low"
        ? "Easy"
        : competition === "Medium"
        ? "Medium"
        : "Hard";
  
    const demand =
      trend >= 90
        ? "Very High"
        : trend >= 75
        ? "High"
        : trend >= 50
        ? "Medium"
        : "Low";

        const reasons: string[] = [];

if (ai >= 90) {
  reasons.push("Excellent AI confidence.");
}

if (trend >= 90) {
  reasons.push("High market demand.");
}

if (profit >= 15) {
  reasons.push("Strong profit margin.");
}

if (competition === "Low") {
  reasons.push("Low competition.");
}

if (winningProbability >= 90) {
  reasons.push("Excellent winning probability.");
}
  
return {
    verdict,
    risk,
    difficulty,
    demand,
    winningProbability,
    confidence: ai,
    reasons,
  };
  }