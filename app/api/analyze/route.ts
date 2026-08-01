import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { openai } from "../../../lib/openai";
import {
  requirePlanOrThrow,
  requireUserIdOrThrow,
  toSubscriptionGuardResponse,
} from "../../../lib/billing/subscriptionMiddleware";

const analyzeSchema = z.object({
  product: z.string().trim().min(3).max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserIdOrThrow(req);
    await requirePlanOrThrow(userId, "Pro");

    const body = analyzeSchema.parse(await req.json());

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `
You are TrendPilot AI.

You are an expert Shopify consultant, Amazon consultant, TikTok Shop expert and Meta Ads strategist.

Analyze this product:

${body.product}

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

- Buy price must always be lower than selling price.
- Profit = selling_price - buy_price.

- market_score between 85 and 99.
- trend_score between 85 and 99.

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

    return NextResponse.json({
      result,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "SubscriptionGuardError") {
      return toSubscriptionGuardResponse(err);
    }

    if (err instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid request data.",
        },
        {
          status: 400,
        }
      );
    }

    console.error("Analyze API error:", err);

    return NextResponse.json(
      {
        error: "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}