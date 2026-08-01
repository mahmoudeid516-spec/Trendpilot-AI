import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { openai } from "../../../lib/openai";
import {
  requirePlanOrThrow,
  requireUserIdOrThrow,
  toSubscriptionGuardResponse,
} from "../../../lib/billing/subscriptionMiddleware";

const marketingPackageSchema = z.object({
  product: z.object({
    name: z.string().trim().min(1).max(200),
    category: z.string().trim().optional().default("General"),
    platform: z.string().trim().optional().default("Unknown"),
    profit: z.union([z.number(), z.string()]).optional(),
    country: z.string().trim().optional().default("Worldwide"),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserIdOrThrow(req);
    await requirePlanOrThrow(userId, "Pro");

    const body = marketingPackageSchema.parse(await req.json());

    const { product } = body;

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
${product.profit ?? "Unknown"}

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
      marketing: response.output_text ?? "",
    });
  } catch (error) {
    if (error instanceof Error && error.name === "SubscriptionGuardError") {
      return toSubscriptionGuardResponse(error);
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid request data.",
        },
        {
          status: 400,
        }
      );
    }

    console.error("Generate Marketing API error:", error);

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