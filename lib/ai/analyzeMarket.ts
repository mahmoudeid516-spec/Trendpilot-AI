import { getOpenAI, OPENAI_MODEL } from "../openai";
import type { Product } from "../../types/Product";
import type { MarketAnalysisText, MarketSummary } from "../../types/analysis";

/**
 * Exactly one AI call per search (not one per product) -- per-product
 * "why/risks" text is generated deterministically in
 * lib/scoring/explainProduct.ts instead. This function only summarizes
 * real, already-computed product data; it does not send raw per-product
 * rows for every item, only aggregate statistics, to keep the prompt (and
 * cost) bounded regardless of how many products were requested.
 */

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);
}

function summarizeProducts(products: Product[]) {
  const opportunityScores = products.map((p) => p.opportunity_score ?? 0);
  const demandScores = products.map((p) => p.demand_score ?? 0);
  const riskScores = products.map((p) => p.risk_score ?? 0);
  const trendScores = products.map((p) => p.trend_score ?? 0);
  const rois = products.map((p) => p.roi ?? 0);
  const prices = products.map((p) => p.buy_price ?? 0);

  const competitionCounts = { Low: 0, Medium: 0, High: 0 };
  for (const p of products) {
    competitionCounts[p.competition] = (competitionCounts[p.competition] ?? 0) + 1;
  }

  const bestSellerCount = products.filter((p) => p.best_seller).length;
  const amazonChoiceCount = products.filter((p) => p.amazon_choice).length;

  return {
    product_count: products.length,
    avg_opportunity_score: average(opportunityScores),
    avg_demand_score: average(demandScores),
    avg_risk_score: average(riskScores),
    avg_trend_score: average(trendScores),
    avg_roi_percent: average(rois),
    price_range: {
      min: Math.min(...prices),
      max: Math.max(...prices),
    },
    competition_breakdown: competitionCounts,
    best_seller_count: bestSellerCount,
    amazon_choice_count: amazonChoiceCount,
    sample_top_products: [...products]
      .sort((a, b) => (b.opportunity_score ?? 0) - (a.opportunity_score ?? 0))
      .slice(0, 8)
      .map((p) => ({
        name: p.name,
        buy_price: p.buy_price,
        roi: p.roi,
        opportunity_score: p.opportunity_score,
        competition: p.competition,
        reviews: p.reviews,
      })),
  };
}

export type MarketAnalysisAiResult = {
  summary: MarketSummary;
  market_analysis: MarketAnalysisText;
};

export async function analyzeMarket(
  keyword: string,
  products: Product[]
): Promise<MarketAnalysisAiResult> {
  const openai = getOpenAI();
  const stats = summarizeProducts(products);

  const prompt = `
You are TrendPilot AI, an ecommerce market research analyst.

Analyze this Amazon product search market using ONLY the aggregated statistics
provided below. These statistics were computed from real DataForSEO search
results for the keyword "${keyword}".

STATISTICS:
${JSON.stringify(stats, null, 2)}

Rules:
- Base every claim strictly on the statistics above. Do not invent sales
  figures, revenue numbers, market size, or competitor counts that are not
  present in the data.
- If a judgment cannot be supported by the data, say "Insufficient data" for
  that specific point rather than guessing.
- Be concise and concrete, not generic filler text.

Return ONLY valid JSON in this exact shape, no markdown, no explanation:

{
  "summary": {
    "verdict": "short 2-4 word verdict, e.g. Promising Market",
    "overall_score": 0,
    "demand": "Low" | "Medium" | "High",
    "competition": "Low" | "Medium" | "High",
    "profitability": "Low" | "Medium" | "High",
    "risk": "Low" | "Medium" | "High",
    "explanation": "2-3 sentence natural-language summary grounded in the statistics above"
  },
  "market_analysis": {
    "overview": "market opportunity overview",
    "demand_analysis": "...",
    "competition_analysis": "...",
    "trend_analysis": "...",
    "profitability_analysis": "...",
    "positioning": "who the target customer is and how to position the product",
    "risk_analysis": "main risks",
    "opportunity_analysis": "...",
    "strategy": "recommended go-to-market strategy",
    "recommended_product_profile": "what characteristics a seller should look for in this market",
    "final_recommendation": "one concise closing recommendation"
  }
}

For any field where the statistics above do not provide enough basis to
support a real conclusion, write "Insufficient data to determine." for that
field instead of guessing.
`;

  const response = await openai.responses.create({
    model: OPENAI_MODEL,
    input: prompt,
  });

  const text = response.output_text ?? "";
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("Invalid JSON returned from OpenAI market analysis.");
  }

  const parsed = JSON.parse(text.slice(start, end + 1)) as MarketAnalysisAiResult;

  return parsed;
}
