import { NextResponse } from "next/server";
import type { Product } from "../../../types/Product";
import type { ProductAnalysisResponse, ProductWithAnalysis } from "../../../types/analysis";
import { explainProduct } from "../../../lib/scoring/explainProduct";
import { selectTopPicks } from "../../../lib/scoring/topPicks";
import { analyzeMarket } from "../../../lib/ai/analyzeMarket";

function fallbackMarketAnalysis(reason: string): {
  summary: ProductAnalysisResponse["summary"];
  market_analysis: ProductAnalysisResponse["market_analysis"];
} {
  return {
    summary: {
      verdict: "AI Analysis Unavailable",
      overall_score: 0,
      demand: "Medium",
      competition: "Medium",
      profitability: "Medium",
      risk: "Medium",
      explanation: `Products loaded successfully, but AI market analysis is temporarily unavailable (${reason}). Product-level scores and Top Picks below are still real, computed data.`,
    },
    market_analysis: {
      overview: "Not available.",
      demand_analysis: "Not available.",
      competition_analysis: "Not available.",
      trend_analysis: "Not available.",
      profitability_analysis: "Not available.",
      positioning: "Not available.",
      risk_analysis: "Not available.",
      opportunity_analysis: "Not available.",
      strategy: "Not available.",
      recommended_product_profile: "Not available.",
      final_recommendation: "Not available.",
    },
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const keyword = typeof body?.keyword === "string" ? body.keyword : "";
    const products: Product[] = Array.isArray(body?.products) ? body.products : [];

    if (products.length === 0) {
      return NextResponse.json(
        {
          error: "No products provided to analyze.",
        },
        { status: 400 }
      );
    }

    const topPicks = selectTopPicks(products);

    const productsWithAnalysis: ProductWithAnalysis[] = products.map((product) => ({
      ...product,
      analysis: explainProduct(product),
    }));

    let aiAvailable = true;
    let marketResult: Awaited<ReturnType<typeof analyzeMarket>>;

    try {
      marketResult = await analyzeMarket(keyword, products);
    } catch (aiError: unknown) {
      aiAvailable = false;
      const reason = aiError instanceof Error ? aiError.message : "unknown error";
      console.error("[product-analysis] ai_analysis_failed", { keyword, reason });
      marketResult = fallbackMarketAnalysis(reason);
    }

    const response: ProductAnalysisResponse = {
      keyword,
      products_analyzed: products.length,
      summary: marketResult.summary,
      market_analysis: marketResult.market_analysis,
      ai_available: aiAvailable,
      top_picks: topPicks,
      products: productsWithAnalysis,
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Product analysis failed.";
    console.error("[product-analysis] request_failed", { message });

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
