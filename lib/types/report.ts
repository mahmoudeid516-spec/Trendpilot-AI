/**
 * Core type definitions for TrendPilot AI Product Reports.
 * Serves as the single source of truth contract for all report consumers.
 */

export type LaunchStatus = "Launch Now" | "Watch" | "Skip";

export type RiskLevel = "Low" | "Medium" | "High";

export type CompetitionLevel = "Low" | "Medium" | "High";

export interface ScoreBreakdown {
  /** Overall calculated winning probability percentage (0 - 100) */
  winningProbability: number;
  /** Direct score assigned by AI analysis (0 - 100) */
  aiScore: number;
  /** Derived trend momentum score (0 - 100) */
  trendScore: number;
}

export interface AdvertisingPlatform {
  /** Name of the advertising channel (e.g., "TikTok Ads", "Meta Ads") */
  name: string;
  /** Suitability score for this product (0 - 100) */
  score: number;
  /** Justification for recommending this platform */
  reason: string;
}

export interface ProfitAnalysis {
  buyPrice: number;
  sellingPrice: number;
  profitMarginAmount: number;
  profitMarginPercentage: number;
  estimatedRoas: number;
  /** Dynamic currency code (e.g., "USD", "EUR", "AED") */
  currency: string;
}

export interface MarketAnalysis {
  competitionLevel: CompetitionLevel;
  marketVelocityScore: number;
  trendDirection: "Upward" | "Stable" | "Downward";
  targetCountry: string;
  demandVolume: "High" | "Moderate" | "Niche";
}

export interface MarketingAnalysis {
  primaryHook: string;
  targetAudience: string[];
  recommendedPlatforms: AdvertisingPlatform[];
  adAngles: string[];
}

export interface ProductReport {
  /** Canonical entity ID associated with this report */
  productId: string;
  
  /** Overall winning probability score (0 - 100) */
  score: ScoreBreakdown;
  
  /** Actionable recommendation status for product launch */
  recommendation: LaunchStatus;
  
  /** AI model confidence level percentage (0 - 100) */
  confidence: number;
  
  /** Calculated market and operational risk assessment */
  risk: RiskLevel;
  
  /** Executive summary of the product's viability */
  summary: string;
  
  /** Key positive growth and profitability factors */
  strengths: string[];
  
  /** Potential liabilities or operational challenges */
  weaknesses: string[];
  
  /** Detailed market conditions and velocity data */
  marketAnalysis: MarketAnalysis;
  
  /** Strategic marketing insights and hooks */
  marketingAnalysis: MarketingAnalysis;
  
  /** Complete financial breakdown and margins */
  profitAnalysis: ProfitAnalysis;
  
  /** Direct reference to advertising channels with scores and rationale */
  advertisingPlatforms: AdvertisingPlatform[];
  
  /** Primary marketing hook string for ads */
  marketingHook: string;
  
  /** Primary target audience segments */
  targetAudience: string[];
  
  /** Timestamp when the report was computed or generated */
  generatedAt: string;
}