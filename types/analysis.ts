import type { Product } from "./Product";
import type { ProductExplanation } from "../lib/scoring/explainProduct";
import type { TopPick } from "../lib/scoring/topPicks";

export type Level = "Low" | "Medium" | "High";

export type MarketSummary = {
  verdict: string;
  overall_score: number;
  demand: Level;
  competition: Level;
  profitability: Level;
  risk: Level;
  explanation: string;
};

export type MarketAnalysisText = {
  overview: string;
  demand_analysis: string;
  competition_analysis: string;
  trend_analysis: string;
  profitability_analysis: string;
  positioning: string;
  risk_analysis: string;
  opportunity_analysis: string;
  strategy: string;
  recommended_product_profile: string;
  final_recommendation: string;
};

export type ProductWithAnalysis = Product & {
  analysis: ProductExplanation;
};

export type ProductAnalysisResponse = {
  keyword: string;
  products_analyzed: number;
  summary: MarketSummary;
  market_analysis: MarketAnalysisText;
  ai_available: boolean;
  top_picks: TopPick[];
  products: ProductWithAnalysis[];
};
