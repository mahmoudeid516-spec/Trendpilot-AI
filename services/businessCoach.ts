import type { Product } from "../types/Product";

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

// --- Configuration Constants ---
const CATEGORY_MULTIPLIERS: Record<string, number> = {
  Beauty: 3.5,
  Electronics: 2.0,
  Fashion: 3.0,
  Home: 2.8,
  default: 2.5,
};

const CATEGORY_COUNTRIES: Record<string, string[]> = {
  Beauty: ["USA", "UK", "Germany", "France"],
  Electronics: ["USA", "Canada", "Australia", "Japan"],
  Fashion: ["France", "Italy", "UK", "USA"],
  default: ["USA", "UK", "Canada", "Germany"],
};

// --- Helper Functions ---

const calculatePricing = (product: Product): { sellingPrice: number; expectedProfit: number } => {
  const buyPrice = Number(product.buy_price ?? 0);
  const baseMultiplier = CATEGORY_MULTIPLIERS[product.category] ?? CATEGORY_MULTIPLIERS.default;
  
  // Adjust multiplier based on competition
  const competitionModifier = product.competition === "High" ? 0.8 : 1.0;
  const finalMultiplier = baseMultiplier * competitionModifier;

  const sellingPrice = Math.round((buyPrice * finalMultiplier) * 100) / 100;
  const expectedProfit = Math.round((sellingPrice - buyPrice) * 100) / 100;

  return { sellingPrice, expectedProfit };
};

const determineBudget = (aiScore: number, trendScore: number): number => {
  const base = aiScore >= 90 ? 100 : aiScore >= 75 ? 50 : 25;
  const trendBonus = trendScore > 80 ? 1.5 : 1.0;
  return Math.round(base * trendBonus);
};

const generateActionPlan = (aiScore: number, competition: string): string[] => {
  const isHighPotential = aiScore >= 90 && competition !== "High";

  const baseSteps = [
    "Build high-conversion Shopify landing page.",
    "Set up pixel tracking and conversion API.",
    "Develop 3-5 high-quality UGC video creatives.",
  ];

  const strategySteps = isHighPotential
    ? [
        "Launch aggressive 'Launch Day' ad spend.",
        "Target top-tier countries only.",
        "A/B test hooks aggressively.",
      ]
    : [
        "Launch 'Testing Phase' campaign with smaller budget.",
        "Test 3 distinct audiences.",
        "Monitor CPM and CTR closely.",
      ];

  const scaleSteps = isHighPotential
    ? [
        "Scale winning creatives by 20% daily.",
        "Expand to lookalike audiences.",
        "Start influencer outreach program.",
      ]
    : [
        "Kill losing ads after 48 hours.",
        "Optimize product page based on heatmap data.",
      ];

  return [...baseSteps, ...strategySteps, ...scaleSteps];
};

// --- Main Engine ---

export function generateBusinessPlan(product: Product): BusinessPlan {
  const aiScore = Number(product.ai_score ?? 0);
  const trendScore = Number(product.trend_score ?? 0);
  const competition = product.competition ?? "Medium";
  
  const { sellingPrice, expectedProfit } = calculatePricing(product);
  const dailyBudget = determineBudget(aiScore, trendScore);
  
  const breakEvenSales = Math.max(
    1,
    Math.ceil(dailyBudget / Math.max(expectedProfit, 1))
  );

  // Verdict Logic
  const verdict =
    aiScore >= 90 && competition === "Low"
      ? "Strong Buy - Aggressive Scale"
      : aiScore >= 75
      ? "Good Opportunity - Validate"
      : "Test Carefully - High Risk";

  return {
    verdict,
    sellingPrice,
    expectedProfit,
    dailyBudget,
    breakEvenSales,
    bestCountries: CATEGORY_COUNTRIES[product.category] ?? CATEGORY_COUNTRIES.default,
    bestPlatform: aiScore >= 85 || product.category === "Fashion" ? "TikTok Ads" : "Facebook Ads",
    strategy: generateActionPlan(aiScore, competition),
  };
}