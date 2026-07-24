import type { Product } from "../types/Product";

// --- Types ---

export type MarketIntelligence = {
  // Legacy Fields (Required for backward compatibility)
  saturation: number;
  viralPotential: number;
  evergreen: number;
  recommendedBudget: number;
  cpa: number;
  cpm: number;

  // New Intelligent Fields (Optional)
  marketStage?: "Emerging" | "Growth" | "Mature" | "Saturated";
  audienceSize?: number; // Estimated
  growthPotential?: number; // 0-100
  advertisingDifficulty?: "Low" | "Medium" | "High";
  recommendedChannels?: string[];
  riskFactors?: string[];
  opportunities?: string[];
  estimatedCTR?: number;
  estimatedConvRate?: number;
};

// --- Configuration ---

const SATURATION_MAP: Record<string, number> = {
  Low: 20,
  Medium: 55,
  High: 85,
};

const CATEGORY_CONFIG: Record<string, { cpaMod: number; cpmMod: number; budgetMod: number; channels: string[] }> = {
  Beauty: { cpaMod: 1.2, cpmMod: 1.15, budgetMod: 1.5, channels: ["TikTok", "Instagram"] },
  Electronics: { cpaMod: 0.9, cpmMod: 0.9, budgetMod: 1.2, channels: ["Google Shopping", "Facebook"] },
  Fashion: { cpaMod: 1.1, cpmMod: 1.2, budgetMod: 1.8, channels: ["Instagram", "Pinterest", "TikTok"] },
  default: { cpaMod: 1.0, cpmMod: 1.0, budgetMod: 1.0, channels: ["Facebook", "Google"] },
};

const WEIGHTS = {
  AI: 0.5,
  TREND: 0.3,
  VIRAL: 0.2,
};

// --- Helpers ---

const getSaturation = (competition?: string): number => SATURATION_MAP[competition || "Medium"] ?? 55;

const calculateCPA = (ai: number, category: string): number => {
  const baseCPA = 30;
  const mod = CATEGORY_CONFIG[category]?.cpaMod ?? 1.0;
  return Math.max(5, Math.round((baseCPA - ai / 5) * mod));
};

const calculateCPM = (trend: number, category: string): number => {
  const baseCPM = 20;
  const mod = CATEGORY_CONFIG[category]?.cpmMod ?? 1.0;
  return Math.max(4, Math.round((baseCPM - trend / 6) * mod));
};

const calculateBudget = (profit: number, ai: number, category: string): number => {
  const profitTier = profit >= 25 ? 300 : profit >= 15 ? 150 : 75;
  const mod = CATEGORY_CONFIG[category]?.budgetMod ?? 1.0;
  const aiAdjustment = ai > 80 ? 1.2 : 1.0;
  return Math.round(profitTier * mod * aiAdjustment);
};

// --- Main Engine ---

export function analyzeMarket(product: Product): MarketIntelligence {
  // Normalize Inputs
  const ai = Number(product.ai_score ?? 0);
  const trend = Number(product.trend_score ?? 0);
  const viral = Number(product.viral_score ?? 0);
  const profit = Number(product.profit ?? 0);
  const category = product.category ?? "default";
  
  // Calculate Legacy Metrics
  const saturation = getSaturation(product.competition);
  const viralPotential = Math.min(100, Math.round(ai * WEIGHTS.AI + trend * WEIGHTS.TREND + viral * WEIGHTS.VIRAL));
  const evergreen = Math.min(100, Math.round(trend * 0.7 + 30));
  
  const cpa = calculateCPA(ai, category);
  const cpm = calculateCPM(trend, category);
  const recommendedBudget = calculateBudget(profit, ai, category);

  // Advanced Intelligence
  const growthPotential = Math.min(100, Math.round((trend + (product.orders ?? 0) / 10) / 2));
  
  const riskFactors: string[] = [];
  if (saturation > 70) riskFactors.push("Market is highly saturated; requires unique creative.");
  if (profit < 10) riskFactors.push("Tight margins; sensitive to ad cost fluctuations.");
  
  const opportunities: string[] = [];
  if (viralPotential > 80) opportunities.push("Strong potential for organic virality.");
  if (ai > 85) opportunities.push("High model confidence; aggressive scaling recommended.");

  return {
    // Required
    saturation,
    viralPotential,
    evergreen,
    recommendedBudget,
    cpa,
    cpm,

    // Advanced Metrics
    marketStage: trend > 80 ? "Growth" : trend > 40 ? "Mature" : "Emerging",
    growthPotential,
    advertisingDifficulty: saturation > 70 ? "High" : saturation > 40 ? "Medium" : "Low",
    recommendedChannels: CATEGORY_CONFIG[category]?.channels ?? CATEGORY_CONFIG.default.channels,
    riskFactors,
    opportunities,
    estimatedCTR: Math.min(5, Number((trend / 20).toFixed(1))),
    estimatedConvRate: Math.min(8, Number((ai / 15).toFixed(1))),
  };
}