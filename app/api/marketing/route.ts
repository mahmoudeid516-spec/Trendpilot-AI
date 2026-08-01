import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { openai } from "../../../lib/openai";
import {
  requirePlanOrThrow,
  requireUserIdOrThrow,
  toSubscriptionGuardResponse,
} from "../../../lib/billing/subscriptionMiddleware";

const marketingSchema = z.object({
  product: z.string().trim().min(3).max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserIdOrThrow(req);
    await requirePlanOrThrow(userId, "Pro");

    const body = marketingSchema.parse(await req.json());

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `
You are a professional e-commerce marketing expert.

Create marketing content for this product:

${body.product}

Return ONLY valid JSON.

{
  "facebook_ad":"",
  "instagram_caption":"",
  "tiktok_hook":"",
  "seo_title":"",
  "seo_description":"",
  "hashtags":""
}
`,
    });

    const text = response.output_text ?? "";

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("Invalid JSON returned from OpenAI.");
    }

    const result = JSON.parse(text.slice(start, end + 1));

    return NextResponse.json(result);
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

    console.error("Marketing API error:", err);

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