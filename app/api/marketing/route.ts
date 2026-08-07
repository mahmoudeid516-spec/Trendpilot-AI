import { NextResponse } from "next/server";
import { getOpenAI, OPENAI_MODEL } from "../../../lib/openai";

type MarketingPayload = {
  facebook_ad: string;
  instagram_caption: string;
  tiktok_hook: string;
  seo_title: string;
  seo_description: string;
  email_marketing: string;
  hashtags: string[];
};

function buildFallbackMarketing(product: unknown): MarketingPayload {
  const productName =
    typeof product === "string"
      ? product
      : typeof product === "object" && product !== null && "name" in product
      ? String((product as { name?: unknown }).name ?? "this product")
      : "this product";

  return {
    facebook_ad: `Discover ${productName} today. High quality, fast shipping, and limited-time pricing. Order now before stock runs out.`,
    instagram_caption: `${productName} is trending right now. Tap to shop and upgrade your setup today.`,
    tiktok_hook: `Stop scrolling. ${productName} is the product everyone is talking about this week.`,
    seo_title: `${productName} | Trending Product 2026`,
    seo_description: `Buy ${productName} with competitive pricing and fast delivery. See why shoppers are choosing it in 2026.`,
    email_marketing: `Subject: ${productName} is now available\n\nOur latest launch, ${productName}, is now live. Get it early and enjoy limited-time pricing.`,
    hashtags: [
      "#TrendingNow",
      "#ShopSmart",
      "#OnlineDeals",
      "#Ecommerce",
      "#ViralProducts",
    ],
  };
}

function normalizeHashtags(input: unknown): string[] {
  if (Array.isArray(input)) {
    return input
      .map((tag) => String(tag).trim())
      .filter(Boolean);
  }

  if (typeof input === "string") {
    return input
      .split(/[\n,]+/)
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

export async function POST(req: Request) {
  try {
    const { product } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(buildFallbackMarketing(product));
    }

    const openai = getOpenAI();

    const response = await openai.responses.create({
      model: OPENAI_MODEL,
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
  "email_marketing":"",
  "hashtags":[]
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
    const parsed = JSON.parse(json) as Record<string, unknown>;

    const payload: MarketingPayload = {
      facebook_ad: String(parsed.facebook_ad ?? ""),
      instagram_caption: String(parsed.instagram_caption ?? ""),
      tiktok_hook: String(parsed.tiktok_hook ?? ""),
      seo_title: String(parsed.seo_title ?? ""),
      seo_description: String(parsed.seo_description ?? ""),
      email_marketing: String(parsed.email_marketing ?? ""),
      hashtags: normalizeHashtags(parsed.hashtags),
    };

    return NextResponse.json(payload);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Marketing generation failed.",
      },
      {
        status: 500,
      }
    );
  }
}