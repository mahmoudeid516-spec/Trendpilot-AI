// Strict schema for the per-product "AI Product Analyzer" (distinct from
// the existing batch/keyword-level analysis in types/analysis.ts, which
// summarizes an entire search result set, not one product in depth). This
// is validated server-side (lib/ai/analyzeProductDeep.ts) before ever being
// returned to the client -- malformed AI output must fail loudly, not
// render as broken content.

export type ProductAnalyzerVerdict =
  | "Strong Opportunity"
  | "Promising"
  | "Risky"
  | "Weak Opportunity";

export type FinalRecommendationVerdict =
  | "Worth testing"
  | "Test cautiously"
  | "Avoid for now";

export type ProductDeepAnalysis = {
  opportunity_score: number; // 0-100
  opportunity_score_explanation: string;
  verdict: ProductAnalyzerVerdict;
  why_it_could_work: string[]; // 3-5 concise points
  main_risks: string[]; // 3-5 concise points
  target_customer: string;
  competitive_position: string;
  pricing_insight: string;
  demand_signals: string;
  differentiation_ideas: string[]; // 3-5
  go_to_market_suggestions: string[]; // 3-5
  final_recommendation: {
    verdict: FinalRecommendationVerdict;
    reason: string;
  };
};
