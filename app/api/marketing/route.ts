import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
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

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `
You are a professional e-commerce marketing expert.

Create marketing content for this product:

${product}

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
      throw new Error("Invalid JSON");
    }

    const json = text.slice(start, end + 1);

    return NextResponse.json(JSON.parse(json));
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "SubscriptionGuardError") {
      return toSubscriptionGuardResponse(err);
    }

    const message = err instanceof Error ? err.message : "Marketing generation failed.";

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