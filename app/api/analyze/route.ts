import { NextResponse } from "next/server";
import { openai } from "../../../lib/openai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = body.product;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `
      You are TrendPilot AI.

You are the world's best ecommerce product research engine.

Your mission is to evaluate products like a senior Shopify consultant, Amazon consultant, Meta Ads strategist and TikTok ecommerce expert.

Analyze this product:

${prompt}

Return ONLY valid JSON.

{
  "name":"",
  "category":"",
  "description":"",

  "buy_price":0,
  "selling_price":0,
  "profit":0,

  "overall_score":0,
  "market_score":0,
  "profit_score":0,
  "competition_score":0,
  "viral_score":0,

  "competition":"Low",
  "difficulty":"Easy",

  "country":"Worldwide",

  "target_audience":"",

  "marketing_angle":"",

  "trend_stage":"Early",

  "recommendation":"",

  "best_platform":"",

  "best_creative":"",

  "risks":"",

  "pros":[
    "",
    "",
    ""
  ],

  "cons":[
    "",
    ""
  ],

  "seo_title":"",

  "seo_description":"",

  "hashtags":"",

  "tiktok_hook":"",

  "facebook_ad":""
}

Rules:

- Return JSON only.

- Never explain.

- Scores must be between 80 and 99.

- Selling price > Buy price.

- Profit = Selling - Buy.

- Recommendation must be professional.

- Pros exactly 3.

- Cons exactly 2.

- Suggest realistic ecommerce values.
`,
    });

    const text = response.output_text ?? "";

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("No JSON found.");
    }

    const result = JSON.parse(text.slice(start, end + 1));

    return NextResponse.json({ result });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}