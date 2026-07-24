import type { Product } from "../types/Product";

export type DecisionResult = {
  verdict: "Strong Buy" | "Good Opportunity" | "Avoid";
  risk: "Low" | "Medium" | "High";
  difficulty: "Easy" | "Medium" | "Hard";
  demand: "Very High" | "High" | "Medium" | "Low";
  winningProbability: number;
  confidence: number;
  reasons: string[];
  // Optional enriched fields
  strengths?: string[];
  weaknesses?: string[];
  marketHealth?: "Bullish" | "Neutral" | "Bearish";
};

// --- Configuration Constants ---
const WEIGHTS = {
  AI_SCORE: 0.35,
  TREND_SCORE: 0.25,
  PROFIT: 0.20,
  COMPETITION: 0.10,
  MARKET_VALIDATION: 0.10, // Orders/Reviews
};

const COMPETITION_MAP = {
  Low: 100,
  Medium: 70,
  High: 30,
};

const THRESHOLDS = {
  STRONG_BUY: 85,
  GOOD_OPPORTUNITY: 65,
  PROFIT_BENCHMARK: 20,
  DEMAND_HIGH: 80,
  DEMAND_MEDIUM: 50,
};

// --- Helper Functions ---

const calculateCompetitionScore = (comp: string | undefined): number => {
  return COMPETITION_MAP[comp as keyof typeof COMPETITION_MAP] ?? 50;
};

const calculateProfitScore = (profit: number): number => {
  if (profit >= THRESHOLDS.PROFIT_BENCHMARK) return 100;
  if (profit >= 10) return 70;
  return 30;
};

const calculateMarketValidationScore = (reviews?: number, orders?: number): number => {
  const reviewScore = Math.min((reviews ?? 0) / 500, 1) * 100;
  const orderScore = Math.min((orders ?? 0) / 1000, 1) * 100;
  return (reviewScore + orderScore) / 2;
};

const calculateConfidence = (ai: number, reviews?: number): number => {
  const dataReliability = Math.min((reviews ?? 0) / 100, 1) * 20; // Up to 20% boost for data density
  return Math.min(ai + dataReliability, 100);
};

// --- Main Engine ---

export function analyzeProduct(product: Product): DecisionResult {
  const ai = Number(product.ai_score ?? 0);
  const trend = Number(product.trend_score ?? 0);
  const profit = Number(product.profit ?? 0);
  const competition = product.competition ?? "Medium";
  const orders = product.orders ?? 0;
  const reviews = product.reviews ?? 0;

  // Calculate Sub-scores
  const compScore = calculateCompetitionScore(competition);
  const profitScore = calculateProfitScore(profit);
  const validationScore = calculateMarketValidationScore(reviews, orders);

  // Weighted Winning Probability
  const winningProbability = Math.round(
    ai * WEIGHTS.AI_SCORE +
      trend * WEIGHTS.TREND_SCORE +
      profitScore * WEIGHTS.PROFIT +
      compScore * WEIGHTS.COMPETITION +
      validationScore * WEIGHTS.MARKET_VALIDATION
  );

  // Verdict Logic
  let verdict: DecisionResult["verdict"] = "Avoid";
  if (winningProbability >= THRESHOLDS.STRONG_BUY && competition === "Low") {
    verdict = "Strong Buy";
  } else if (winningProbability >= THRESHOLDS.GOOD_OPPORTUNITY) {
    verdict = "Good Opportunity";
  }

  // Risk & Difficulty (Inverse relationships to Competition/Confidence)
  const risk: DecisionResult["risk"] = competition === "Low" ? "Low" : competition === "Medium" ? "Medium" : "High";
  const difficulty: DecisionResult["difficulty"] = competition === "Low" ? "Easy" : competition === "Medium" ? "Medium" : "Hard";

  // Demand Logic
  const demand: DecisionResult["demand"] =
    trend >= THRESHOLDS.DEMAND_HIGH
      ? "Very High"
      : trend >= THRESHOLDS.DEMAND_MEDIUM
      ? "High"
      : trend >= 30
      ? "Medium"
      : "Low";

  // Intelligent Reason Generation
  const reasons: string[] = [];
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (ai >= 90) reasons.push("AI confidence is exceptional, suggesting high model certainty.");
  if (trend >= 90) reasons.push("Trend score is above 90, indicating massive consumer demand.");
  if (profit >= THRESHOLDS.PROFIT_BENCHMARK) reasons.push(`Estimated profit ($${profit}) exceeds the threshold for healthy scaling.`);
  if (competition === "Low") reasons.push("Competition is low, which significantly lowers your Customer Acquisition Cost (CAC).");
  if (winningProbability >= 80) reasons.push("Combined metrics indicate a high probability of success.");
  if (orders > 500) reasons.push("Proven market validation with significant order volume.");
  
  if (competition === "High") weaknesses.push("Market is saturated; requires unique creative angles to succeed.");
  if (profit < 10) weaknesses.push("Profit margins are tight; requires high conversion rates to be viable.");
  if (trend < 40) weaknesses.push("Market interest is currently cooling.");

  return {
    verdict,
    risk,
    difficulty,
    demand,
    winningProbability,
    confidence: calculateConfidence(ai, reviews),
    reasons,
    strengths,
    weaknesses,
    marketHealth: trend >= 75 ? "Bullish" : trend >= 40 ? "Neutral" : "Bearish",
  };
}