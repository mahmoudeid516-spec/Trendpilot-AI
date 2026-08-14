import { getOpenAI, OPENAI_MODEL } from "../openai";
import type { Product } from "../../types/Product";
import type {
  ProductDeepAnalysis,
  ProductAnalyzerVerdict,
  FinalRecommendationVerdict,
} from "../../types/productAnalyzer";

const VERDICTS: ProductAnalyzerVerdict[] = [
  "Strong Opportunity",
  "Promising",
  "Risky",
  "Weak Opportunity",
];

const FINAL_VERDICTS: FinalRecommendationVerdict[] = [
  "Worth testing",
  "Test cautiously",
  "Avoid for now",
];

// Only real, observed/computed fields go into the prompt -- clearly split
// into what actually came from the search provider vs. what TrendPilot
// itself derived with a deterministic formula (lib/scoring/opportunityScore.ts
// and the normalizer in lib/services/dataforseoProductSearch.ts). Neither
// group is AI-generated; the AI's job is to interpret them, not invent new
// numbers alongside them.
function buildProductFacts(product: Product) {
  return {
    observed: {
      name: product.name,
      category: product.category,
      brand: product.brand ?? "not available",
      platform: product.platform,
      source: product.source,
      country: product.country,
      currency: product.currency,
      buy_price: product.buy_price,
      // "reviews" is the one real popularity signal from the provider.
      // "sales"/"orders" below are NOT real sales data -- flagged as such.
      reviews: product.reviews,
      rating: product.store_rating ?? product.supplier_rating ?? "not available",
      best_seller: Boolean(product.best_seller),
      amazon_choice: Boolean(product.amazon_choice),
      asin: product.asin ?? "not available",
      shipping_days: product.shipping_days ?? "not available",
      delivery_info: product.delivery_info ?? "not available",
    },
    trendpilot_computed_estimates_not_real_market_data: {
      selling_price: product.selling_price,
      profit: product.profit,
      roi_percent: product.roi,
      competition_bucket: product.competition,
      opportunity_score: product.opportunity_score ?? "not computed",
      demand_score: product.demand_score ?? "not computed",
      risk_score: product.risk_score ?? "not computed",
      winning_probability: product.winning_probability ?? "not computed",
      estimated_sales_not_real: product.sales,
    },
  };
}

function buildPrompt(product: Product): string {
  const facts = buildProductFacts(product);

  return `
You are TrendPilot AI, an ecommerce product opportunity analyst. Analyze
ONE specific product and answer: "Is this product actually worth selling,
and why?"

PRODUCT DATA:
${JSON.stringify(facts, null, 2)}

The "observed" block came directly from a real product search. The
"trendpilot_computed_estimates_not_real_market_data" block was computed by
TrendPilot's own deterministic scoring formulas from the observed data --
it is not real sales/market data, and you must not present it as such.

CRITICAL RULES -- DO NOT FABRICATE:
- Do not invent sales volume, revenue, profit, supplier cost, search
  volume, conversion rate, market size, competitor sales, review counts,
  demand statistics, or margins beyond what is given above.
- If a metric is not available in the data above, explicitly say it is
  unavailable rather than guessing or estimating a number.
- Do not invent named competitors or specific market statistics.
- Clearly distinguish, in your own wording, between the real observed
  data, TrendPilot's computed estimates, and your own interpretation --
  never blur these into a single unqualified claim.
- Be concrete and specific to this product, not generic filler.

Return ONLY valid JSON in this exact shape, no markdown, no commentary:

{
  "opportunity_score": 0,
  "opportunity_score_explanation": "1-2 sentences explaining what this 0-100 score means for THIS product, grounded in the data above",
  "verdict": "Strong Opportunity" | "Promising" | "Risky" | "Weak Opportunity",
  "why_it_could_work": ["3 to 5 concise points"],
  "main_risks": ["3 to 5 concise points -- consider competition, commoditization, price pressure, seasonality, shipping complexity, regulatory concerns, or weak differentiation where the data supports them"],
  "target_customer": "who is most likely to buy this and why, tied to the observed product data",
  "competitive_position": "whether this product appears commoditized or differentiated based ONLY on the data given -- do not invent competitors or market share figures",
  "pricing_insight": "analysis of the observed buy_price and TrendPilot's computed selling_price/profit/roi -- do not invent supplier costs or margins beyond what's given",
  "demand_signals": "what the observed reviews/rating/best_seller/amazon_choice signals suggest, clearly noting that sales/orders figures are TrendPilot estimates, not real transaction data",
  "differentiation_ideas": ["3 to 5 realistic, specific ways a seller could differentiate this offer"],
  "go_to_market_suggestions": ["3 to 5 marketing angles/channels suited to this product and target customer -- these are recommendations, not market data"],
  "final_recommendation": {
    "verdict": "Worth testing" | "Test cautiously" | "Avoid for now",
    "reason": "1-2 sentences with the single strongest reason for this recommendation"
  }
}

If the data above genuinely does not support a confident answer for a
given field, write "Insufficient data to determine." for that field
instead of guessing.
`;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length >= 1 &&
    value.every((item) => isNonEmptyString(item))
  );
}

// Fails loudly on anything that doesn't match the contract -- a malformed
// AI response must never reach the client dressed up as a real analysis.
function validateProductDeepAnalysis(value: unknown): ProductDeepAnalysis {
  if (!value || typeof value !== "object") {
    throw new Error("AI product analysis response was not a JSON object.");
  }

  const candidate = value as Record<string, unknown>;

  if (
    typeof candidate.opportunity_score !== "number" ||
    !Number.isFinite(candidate.opportunity_score) ||
    candidate.opportunity_score < 0 ||
    candidate.opportunity_score > 100
  ) {
    throw new Error("AI product analysis response had an invalid opportunity_score.");
  }

  if (!isNonEmptyString(candidate.opportunity_score_explanation)) {
    throw new Error("AI product analysis response was missing opportunity_score_explanation.");
  }

  if (!VERDICTS.includes(candidate.verdict as ProductAnalyzerVerdict)) {
    throw new Error("AI product analysis response had an invalid verdict.");
  }

  if (!isStringArray(candidate.why_it_could_work)) {
    throw new Error("AI product analysis response had an invalid why_it_could_work list.");
  }

  if (!isStringArray(candidate.main_risks)) {
    throw new Error("AI product analysis response had an invalid main_risks list.");
  }

  if (!isNonEmptyString(candidate.target_customer)) {
    throw new Error("AI product analysis response was missing target_customer.");
  }

  if (!isNonEmptyString(candidate.competitive_position)) {
    throw new Error("AI product analysis response was missing competitive_position.");
  }

  if (!isNonEmptyString(candidate.pricing_insight)) {
    throw new Error("AI product analysis response was missing pricing_insight.");
  }

  if (!isNonEmptyString(candidate.demand_signals)) {
    throw new Error("AI product analysis response was missing demand_signals.");
  }

  if (!isStringArray(candidate.differentiation_ideas)) {
    throw new Error("AI product analysis response had an invalid differentiation_ideas list.");
  }

  if (!isStringArray(candidate.go_to_market_suggestions)) {
    throw new Error("AI product analysis response had an invalid go_to_market_suggestions list.");
  }

  const finalRecommendation = candidate.final_recommendation as
    | Record<string, unknown>
    | undefined;

  if (
    !finalRecommendation ||
    typeof finalRecommendation !== "object" ||
    !FINAL_VERDICTS.includes(finalRecommendation.verdict as FinalRecommendationVerdict) ||
    !isNonEmptyString(finalRecommendation.reason)
  ) {
    throw new Error("AI product analysis response had an invalid final_recommendation.");
  }

  return candidate as unknown as ProductDeepAnalysis;
}

export async function analyzeProductDeep(product: Product): Promise<ProductDeepAnalysis> {
  const openai = getOpenAI();
  const prompt = buildPrompt(product);

  const response = await openai.responses.create({
    model: OPENAI_MODEL,
    input: prompt,
  });

  const text = response.output_text ?? "";
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("Invalid JSON returned from OpenAI product analysis.");
  }

  const parsed = JSON.parse(text.slice(start, end + 1));

  return validateProductDeepAnalysis(parsed);
}
