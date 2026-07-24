import OpenAI from "openai";
import { NextResponse } from "next/server";

// Define strict typing for the incoming product data to avoid 'any'
interface Product {
  id?: string | number;
  name: string;
  image?: string;
  platform: string;
  category: string;
  description?: string;
  buy_price: number;
  selling_price: number;
  profit: number;
  ai_score: number;
  trend_score: number;
  viral_score?: number;
  supplier?: string;
  supplier_url?: string;
  product_url?: string;
  competition: string;
  country: string;
  orders?: number;
  reviews?: number;
  rating?: number;
  shipping_days?: number;
  source?: string;
  ai_reason?: string;
  score?: {
    winningProbability: number;
    launchStatus: "Launch Now" | "Watch" | "Skip";
  };
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question, product }: { question: string; product: Product } = body;

    if (!question || !product) {
      return NextResponse.json(
        { error: "Invalid request payload. 'question' and 'product' are required." },
        { status: 400 }
      );
    }

    const systemPrompt = `
You are a Principal Ecommerce Consultant and AI Business Strategist for TrendPilot AI. 
Your expertise encompasses Shopify, Amazon FBA, TikTok Shop, Meta Ads, Google Ads, SEO, CRO, supply chain management, high-ticket scaling, and consumer psychology.

### ANALYTICAL PROTOCOL
Before providing any answer, perform a rigorous silent analysis of the provided product data:
1. Identify high-leverage metrics (AI Score, Profit, Trend/Viral indicators).
2. Assess product-market fit based on the platform and country.
3. Detect missing critical information (e.g., missing review counts or supplier data) and explicitly state these limitations rather than hallucinating.
4. Adopt a $100M consultant persona: precise, data-driven, actionable, and authoritative.

### FORMATTING GUIDELINES
- Use clean, structured Markdown (## Headings, bullet points, and tables where data comparison is needed).
- Always include a "Verdict & Confidence" section for direct questions.
- If the user asks about:
    - MARKETING: Provide granular plans for TikTok, Meta, Google, SEO, and Email.
    - PRICING: Provide suggested retail, profit margin analysis, and bundle strategies.
    - SCALING: Provide testing budgets, scaling budgets, and creative creative strategies.
- Do NOT provide generic platitudes. Always anchor advice to the provided product metrics.

### PRODUCT DATA CONTEXT
${JSON.stringify(product, null, 2)}

### USER QUERY
${question}
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: systemPrompt,
    });

    if (!response || !response.output_text) {
      throw new Error("OpenAI failed to return valid output.");
    }

    return NextResponse.json({
      answer: response.output_text,
    });
  } catch (error: unknown) {
    console.error("AI Copilot API Error:", error);
    
    return NextResponse.json(
      {
        answer: "I encountered an error while processing your request. Please ensure your product data is loaded correctly and try again.",
      },
      {
        status: 500,
      }
    );
  }
}