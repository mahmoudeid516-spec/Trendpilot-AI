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
  const parsed = aiReportSchema.parse(extractJsonObject(inputText));
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

  return {
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
}

export function buildReportPrompt(product: ReportProductInput): string {
  const marketplace = product.marketplace?.trim() || product.platform?.trim() || "Unknown";

  return `You are TrendPilot AI, a senior ecommerce business intelligence analyst.

Generate one premium product opportunity report as strict JSON only.
Do not include markdown, prose outside JSON, comments, or code fences.

Product context:
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

Return this exact JSON structure with every field present and fully populated:
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

Requirements:
- Every narrative field must be detailed, commercially useful, and written for a serious ecommerce operator.
- opportunity_score and confidence_score must be integers from 0 to 100.
- estimated_cogs, suggested_selling_price, and gross_profit_per_unit must be numeric.
- break_even_units must be a positive integer.
- Array fields must contain at least 3 concise, non-repetitive items unless the structure naturally implies fewer than 3.
- The report must focus on profitability, marketability, competition, and go-to-market execution.
- Return JSON only.`;
}