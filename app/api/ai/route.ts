import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { product } = await req.json();

    const prompt = `
You are a professional ecommerce marketing expert.

Product Name: ${product.name}
Category: ${product.category}
Platform: ${product.platform}
Profit: ${product.profit}
AI Score: ${product.ai_score}

Generate:

1. Product Description
2. Facebook Ad
3. TikTok Hook
4. Instagram Caption
5. Call To Action

Return JSON only.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;

    return NextResponse.json(JSON.parse(content ?? "{}"));
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "AI generation failed." },
      { status: 500 }
    );
  }
}
