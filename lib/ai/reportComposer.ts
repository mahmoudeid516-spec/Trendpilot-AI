import { aiReportSchema } from "../reports/schema";
import type { AIReport, ReportProductInput } from "../../types/AIReport";

function toNumber(value: number | undefined, fallback: number): number {
  return Number.isFinite(value) ? Number(value) : fallback;
}

function normalizeMarketplace(product: ReportProductInput, fallback: string): string {
  return product.marketplace?.trim() || product.platform?.trim() || fallback;
}

function extractJsonObject(inputText: string): unknown {
  const trimmed = inputText.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
      throw new Error("Invalid JSON returned from OpenAI.");
    }

    return JSON.parse(trimmed.slice(start, end + 1));
  }
}

export function parseReportResponse(inputText: string, product: ReportProductInput): AIReport {
  const parsed = extractJsonObject(inputText) as AIReport;
  const normalizedGeneratedAt = new Date(parsed.generated_at).toISOString();
  const marketplace = normalizeMarketplace(product, parsed.marketplace);
  const estimatedCogs = Math.max(0, toNumber(product.buy_price, parsed.profit_estimation.estimated_cogs));
  const suggestedSellingPrice = Math.max(
    estimatedCogs + 1,
    toNumber(product.selling_price, parsed.profit_estimation.suggested_selling_price),
  );
  const grossProfitPerUnit = Math.max(0, suggestedSellingPrice - estimatedCogs);
  const grossMarginPercent = Math.max(
    0,
    Math.min(100, Math.round((grossProfitPerUnit / suggestedSellingPrice) * 100)),
  );

 const normalizedReport = {
  ...parsed,
  generated_at: normalizedGeneratedAt,
  product_name: product.name.trim(),
  marketplace,
  profit_estimation: {
    ...parsed.profit_estimation,
    estimated_cogs: estimatedCogs,
    suggested_selling_price: suggestedSellingPrice,
    gross_profit_per_unit: grossProfitPerUnit,
    gross_margin_percent: grossMarginPercent,
  },
};

return aiReportSchema.parse(normalizedReport);
}

export function buildReportPrompt(product: ReportProductInput): string {
  const marketplace = product.marketplace?.trim() || product.platform?.trim() || "Unknown";

  return `You are TrendPilot AI, operating as a senior Ecommerce Business Intelligence Analyst for a production SaaS.

Your task is to produce one decision-grade ecommerce product opportunity report using ONLY the information provided below and clearly labeled assumptions where required.

Critical operating rules:
1) Never fabricate market data, benchmarks, platform statistics, CPM/CAC values, search volume, conversion rates, or competitor counts.
2) Distinguish evidence categories explicitly:
- Observed facts: values directly provided in input.
- Calculated values: arithmetic derived from provided values.
- Assumptions: reasoned statements required due to missing data.
- Unavailable information: data not provided and not inferable.
3) If information is unavailable, explicitly state that it is unavailable. Do not invent numbers.
4) Every recommendation must include business reasoning tied to available evidence and/or clearly labeled assumptions.
5) Keep all scores internally consistent with the analysis and profit math.
6) Output must remain commercially useful, specific, and execution-oriented.
7) Output JSON only. No markdown, no commentary, no code fences.

Provided product context (single source of truth):
- Product name: ${product.name}
- Category: ${product.category?.trim() || "General"}
- Marketplace: ${marketplace}
- Country: ${product.country?.trim() || "Worldwide"}
- Buy price: ${toNumber(product.buy_price, 0)}
- Selling price: ${toNumber(product.selling_price, 0)}
- Profit per unit: ${toNumber(product.profit, 0)}
- AI score seed: ${toNumber(product.ai_score, 0)}
- Trend score seed: ${toNumber(product.trend_score, 0)}
- Competition seed: ${(product.competition || "Medium").toString()}
- Product description: ${product.description?.trim() || "Not provided"}
- AI reasoning context: ${product.ai_reason?.trim() || "Not provided"}

Scoring requirements:
- opportunity_score must be an integer from 0 to 100 and be based on:
  profit margin, pricing viability, trend score seed, competition seed, and completeness/quality of product context.
- confidence_score must be an integer from 0 to 100 and be based on:
  completeness of provided data, number/materiality of assumptions, and consistency across inputs.
- Higher assumption load and more missing critical data must lower confidence_score.
- If pricing math is weak or contradictory, opportunity_score must reflect that.

Narrative quality requirements:
- Avoid generic statements. Use concrete operator-level analysis.
- Explain why competition is favorable/unfavorable using only provided context and explicit assumptions.
- Explain why pricing is attractive/risky based on gross profit and margin logic.
- Explain why launch strategy fits this specific product context.
- Keep recommendations aligned with SWOT, pricing, and target audience.

Self-validation requirement (internal only, do not reveal chain-of-thought):
- Verify scores agree with the analysis.
- Verify recommendations agree with SWOT.
- Verify pricing strategy agrees with profit_estimation.
- Verify confidence_score reflects missing information and assumptions.

Return one JSON object with ALL existing fields populated, and you MAY include optional fields score_explanations and evidence.

Required base JSON structure:
{
  "generated_at": "ISO_DATE_STRING",
  "product_name": "string",
  "marketplace": "string",
  "executive_summary": "string",
  "opportunity_score": 0,
  "market_potential": "string",
  "demand_analysis": "string",
  "competition_analysis": "string",
  "pricing_strategy": {
    "recommended_price_range": "string",
    "psychological_price_point": "string",
    "launch_offer_strategy": ["string"],
    "margin_outlook": "string"
  },
  "profit_estimation": {
    "estimated_cogs": 0,
    "suggested_selling_price": 0,
    "gross_profit_per_unit": 0,
    "gross_margin_percent": 0,
    "break_even_units": 0,
    "first_90_day_profit_potential": "string"
  },
  "target_audience": {
    "primary_segments": ["string"],
    "buying_triggers": ["string"],
    "objections": ["string"]
  },
  "customer_persona": {
    "persona_name": "string",
    "demographics": "string",
    "psychographics": "string",
    "pain_points": ["string"],
    "desired_outcomes": ["string"]
  },
  "marketing_angles": {
    "awareness": ["string"],
    "consideration": ["string"],
    "conversion": ["string"],
    "retention": ["string"]
  },
  "unique_selling_proposition": "string",
  "seo_keywords": ["string"],
  "shopify_description": "string",
  "product_description": "string",
  "ad_creative_ideas": {
    "facebook_ads": ["string"],
    "tiktok_ad_ideas": ["string"],
    "instagram_caption": ["string"],
    "email_campaign": ["string"]
  },
  "launch_strategy": {
    "pre_launch": ["string"],
    "launch_week": ["string"],
    "post_launch": ["string"]
  },
  "swot_analysis": {
    "strengths": ["string"],
    "weaknesses": ["string"],
    "opportunities": ["string"],
    "threats": ["string"]
  },
  "risks": ["string"],
  "recommendations": ["string"],
  "business_verdict": "string",
  "confidence_score": 0
}

Optional JSON extensions (include when useful):
{
  "score_explanations": {
    "opportunity_score_reason": "string",
    "confidence_score_reason": "string"
  },
  "evidence": {
    "facts_used": ["string"],
    "calculated_values": ["string"],
    "assumptions": ["string"],
    "missing_data": ["string"]
  }
}

Formatting and validation constraints:
- opportunity_score and confidence_score must be integers in [0, 100].
- estimated_cogs, suggested_selling_price, gross_profit_per_unit, gross_margin_percent must be numeric.
- break_even_units must be a positive integer.
- Populate all required base fields.
- Array fields should include at least 3 concise, non-repetitive items when feasible.
- Return JSON only.`;
}