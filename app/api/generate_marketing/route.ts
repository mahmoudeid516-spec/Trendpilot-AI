import { NextResponse } from "next/server";
import { openai } from "../../../lib/openai";

// Define the interface locally to ensure the API route is self-contained and robust
interface Product {
  name: string;
  category: string;
  platform: string;
  profit: number;
  country: string;
  description?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { product }: { product: Product } = body;

    if (!product || !product.name) {
      return NextResponse.json(
        { error: "Valid product data is required." },
        { status: 400 }
      );
    }

    // The prompt MUST be enclosed in backticks (`) to be treated as a string
    const prompt = `
You are a world-class ecommerce marketing consultant with expertise in Shopify, Amazon FBA, TikTok Shop, Meta Ads, Google Ads, SEO, CRO, branding, and consumer psychology.

Generate a comprehensive marketing package for the following product:

Product Name: ${product.name}
Category: ${product.category}
Platform: ${product.platform}
Estimated Profit: ${product.profit}
Country: ${product.country}
Description: ${product.description || "N/A"}

Please generate the following sections using Markdown with ## headings:

## Executive Summary
## Target Audience & Buyer Personas
## Customer Pain Points & Emotional Drivers
## Customer Benefits & Unique Selling Proposition (USP)
## Product Positioning & Branding
## Pricing Strategy Recommendations
## Launch Strategy
## High-Conversion Marketing Funnel Architecture
## TikTok Ad Script
## Facebook/Meta Ad Copy
## Instagram Caption & Content Strategy
## Shopify Product Description
## Email Marketing Campaign Sequence
## Google Ads Setup (Headlines & Descriptions)
## SEO Strategy (Title, Meta Description, Keywords)
## Viral TikTok Hooks (10 Variations)
## Viral Hashtags (10)
## Upsell & Cross-Sell Strategy
## Influencer Marketing Strategy
## Content Ideas for Organic Reach
## Conversion Optimization (CRO) Tips
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    return NextResponse.json({
      marketing: response.output_text,
    });
  } catch (error: any) {
    console.error("Marketing API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate marketing assets." },
      { status: 500 }
    );
  }
}