import { NextRequest, NextResponse } from "next/server";
import { openai } from "../../../lib/openai";
import {
  requirePlanOrThrow,
  requireUserIdOrThrow,
  toSubscriptionGuardResponse,
} from "../../../lib/billing/subscriptionMiddleware";

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserIdOrThrow(req);
    await requirePlanOrThrow(userId, "Pro");

    const { product } = await req.json();

    const prompt = `
You are an expert ecommerce marketing strategist.

Create a complete marketing package for this product.

Product Name:
${product.name}

Category:
${product.category}

Platform:
${product.platform}

Profit:
${product.profit}

Country:
${product.country}

Generate:

1. TikTok Ad Script
2. Facebook Ad Copy
3. Shopify Product Description
4. SEO Keywords
5. Instagram Caption
6. Email Marketing
7. 10 Viral Hashtags

Return beautiful markdown.
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    return NextResponse.json({
      marketing: response.output_text,
    });

  } catch (error: unknown) {
    if (error instanceof Error && error.name === "SubscriptionGuardError") {
      return toSubscriptionGuardResponse(error);
    }

    const message = error instanceof Error ? error.message : "Failed to generate marketing package.";
    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}