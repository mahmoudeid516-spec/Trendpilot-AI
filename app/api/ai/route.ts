import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { product } = await req.json();

    const prompt = `
You are a senior ecommerce consultant and AI dropshipping expert.

Analyze the following product and generate a professional business report.

PRODUCT INFORMATION

Name: ${product.name}
Category: ${product.category}
Platform: ${product.platform}

Buying Price: $${product.buy_price}
Selling Price: $${product.selling_price}
Estimated Profit: $${product.profit}

Trend Score: ${product.trend_score}
Winning Probability: ${
      product.score?.winningProbability ?? product.ai_score
    }

Recommendation:
${product.score?.launchStatus ?? "Unknown"}

Return ONLY valid JSON in this exact format:

{
  "executive_summary":"",
  "strengths":[
    "",
    "",
    ""
  ],
  "weaknesses":[
    "",
    ""
  ],
  "target_audience":"",
  "best_countries":[
    "",
    "",
    ""
  ],
  "marketing_strategy":"",
  "facebook_ad":"",
  "tiktok_hook":"",
  "instagram_caption":"",
  "shopify_description":"",
  "call_to_action":"",
  "recommended_budget":"",
  "risk_level":"",
  "launch_decision":""
}

Do not return markdown.
Do not return explanations.
Return JSON only.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.7,
      response_format: {
        type: "json_object",
      },
      messages: [
        {
          role: "system",
          content:
            "You are one of the world's best ecommerce product research experts.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.choices[0].message.content;

    if (!content) {
      return NextResponse.json(
        {
          error: "Empty AI response.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    console.error("AI REPORT ERROR:", error);

    return NextResponse.json(
      {
        error: "AI Report generation failed.",
      },
      {
        status: 500,
      }
    );
  }
}