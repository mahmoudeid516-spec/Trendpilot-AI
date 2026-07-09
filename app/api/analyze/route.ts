import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = body.product;

    input: `
You are an expert ecommerce product research AI.

Analyze this product:

${prompt}

Return ONLY valid JSON.

{
  {
    "name":"",
    "category":"",
    "description":"",
    "buy_price":0,
    "selling_price":0,
    "profit":0,
  
    "ai_score":0,
    "trend_score":0,
  
    "competition":"Low",
    "country":"Worldwide",
  
    "difficulty":"Medium",
  
    "target_audience":"18-35",
  
    "marketing_angle":"Problem Solving",
  
    "recommendation":"",
  
    "pros":[
      "",
      "",
      ""
    ],
  
    "cons":[
      "",
      ""
    ]
  }

  Rules:

  - AI Score must be between 80 and 99.
  - Trend Score must be between 80 and 99.
  - Selling price must always be higher than buy price.
  - Profit = Selling price - Buy price.
  - Competition = Low / Medium / High.
  - Difficulty = Easy / Medium / Hard.
  - Recommendation = 2 professional sentences.
  - Pros = exactly 3 items.
  - Cons = exactly 2 items.
  - Return JSON only.

Return ONLY a valid JSON object.

{
  "name":"",
  "category":"",
  "description":"",
  "buy_price":0,
  "selling_price":0,
  "profit":0,
  "ai_score":0,
  "trend_score":0
}
`,
    });

    const text = response.output_text ?? "";

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("No JSON found.");
    }

    const json = text.slice(start, end + 1);
    const result = JSON.parse(json);

    return NextResponse.json({
      result,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: String(err),
      },
      {
        status: 500,
      }
    );
  }
}