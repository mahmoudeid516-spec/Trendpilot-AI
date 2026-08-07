import { NextResponse } from "next/server";
import { getOpenAI, OPENAI_MODEL } from "../../../lib/openai";

function fallbackMarketingMarkdown(product: unknown): string {
  const input = product as {
    name?: unknown;
    category?: unknown;
    platform?: unknown;
    country?: unknown;
  };

  const name = String(input?.name ?? "Product");
  const category = String(input?.category ?? "General");
  const platform = String(input?.platform ?? "Ecommerce");
  const country = String(input?.country ?? "Worldwide");

  return `## TikTok Ad Script\nHook: Stop scrolling, ${name} is blowing up right now.\nBody: Quick demo + key benefit + social proof.\nCTA: Tap now to shop before it sells out.\n\n## Facebook Ad Copy\n${name} is a ${category} product now trending on ${platform}. Limited stock and high demand.\n\n## Shopify Product Description\n${name} is built for shoppers who want reliability, value, and fast results.\n\n## SEO Keywords\n${name}, ${category}, trending ${category}, best ${category} in ${country}\n\n## Instagram Caption\n${name} just dropped. Join early buyers and get yours today.\n\n## Email Marketing\nSubject: ${name} is now live\nBody: Our newest ${category} pick is available now. Early access ends soon.\n\n## Viral Hashtags\n#TrendingNow #Ecommerce #ViralProducts #ShopNow #BestFinds`;
}

export async function POST(req: Request) {
  try {
    const { product } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        marketing: fallbackMarketingMarkdown(product),
      });
    }

    const openai = getOpenAI();

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
      model: OPENAI_MODEL,
      input: prompt,
    });

    return NextResponse.json({
      marketing: response.output_text,
    });

  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Marketing generation failed.";

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