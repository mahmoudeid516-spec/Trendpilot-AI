import { getOpenAI, OPENAI_MODEL } from "../../../lib/openai";
import { apiSuccess, apiError } from "../../../lib/apiResponse";

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return apiError(
        "AI_PROVIDER_ERROR",
        "OPENAI_API_KEY is not configured.",
        503
      );
    }

    const openai = getOpenAI();

    const { product } = await req.json();

    const response = await openai.responses.create({
      model: OPENAI_MODEL,
      input: `
You are TrendPilot AI.

You are an expert Shopify consultant, Amazon consultant, TikTok Shop expert and Meta Ads strategist.

Analyze this product:

${product}

Return ONLY valid JSON.

{
  "name":"",
  "category":"",
  "description":"",

  "buy_price":0,
  "selling_price":0,
  "profit":0,

  "market_score":0,
  "trend_score":0,

  "competition":"Low",

  "country":"Worldwide",

  "pros":["","",""],
  "cons":["",""],

  "recommendation":"",

  "marketing":{
      "tiktok_hook":"",
      "facebook_ad":"",
      "seo_title":"",
      "seo_description":"",
      "hashtags":[]
  }
}

Rules:

- JSON only.
- No markdown.
- No explanation.

- buy_price and selling_price are your best estimate of realistic market
  figures for this product -- do not invent numbers unrelated to how this
  product is actually priced and sold. Buy price must be lower than
  selling price. Profit = selling_price - buy_price.

- market_score and trend_score are your own honest 0-100 confidence
  estimate for this specific product. Use the full range: a weak or
  saturated product should score low, not just under 85. Do not default
  to a narrow high band -- these numbers are shown to users as estimates,
  and a score that is always 85-99 regardless of the product is dishonest.

- competition must be one of:
Low
Medium
High

- Exactly 3 pros.
- Exactly 2 cons.

- Recommendation must be professional.
`,
    });

    const text = response.output_text ?? "";

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("Invalid JSON returned from OpenAI.");
    }

    const result = JSON.parse(text.slice(start, end + 1));

    return apiSuccess(result);

  } catch (err: unknown) {
    console.error(err);

    const message =
      err instanceof Error ? err.message : "Analyze request failed.";

    return apiError("AI_REQUEST_FAILED", message, 500);
  }
}
