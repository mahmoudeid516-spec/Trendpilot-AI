import { NextResponse } from "next/server";
import { openai } from "../../../lib/openai";

export async function POST(req: Request) {
  try {
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

  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}