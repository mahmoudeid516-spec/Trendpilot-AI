import OpenAI from "openai";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import {
  requirePlanOrThrow,
  requireUserIdOrThrow,
  toSubscriptionGuardResponse,
} from "../../../lib/billing/subscriptionMiddleware";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserIdOrThrow(req);
    await requirePlanOrThrow(userId, "Pro");

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
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "SubscriptionGuardError") {
      return toSubscriptionGuardResponse(error);
    }

    const message = error instanceof Error ? error.message : "AI generation failed.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
