import { NextResponse } from "next/server";
import type { Product } from "../../../types/Product";
import type { ProductAnalysisResponse, ProductWithAnalysis } from "../../../types/analysis";
import { explainProduct } from "../../../lib/scoring/explainProduct";
import { selectTopPicks } from "../../../lib/scoring/topPicks";
import { analyzeMarket } from "../../../lib/ai/analyzeMarket";

// Note: the caught AI-failure reason is deliberately NOT interpolated into
// this response -- it's logged server-side only (see the console.error at
// the call site). The client-visible explanation stays generic so a
// provider error message (which could contain request/response detail we
// don't want to promise is always safe to display) never reaches the UI.
function fallbackMarketAnalysis(): {
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
      explanation:
        "Products loaded successfully, but AI market analysis is temporarily unavailable. Product-level scores and Top Picks below are still real, computed data.",
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
    const keyword = typeof body?.keyword === "string" && body.keyword.trim() ? body.keyword : "products";

    const rawProducts: unknown[] = Array.isArray(body?.products) ? body.products : [];

    // Defensive validation: skip malformed entries (missing required
    // identity/name fields) instead of letting one bad entry fail the
    // whole request -- partial-but-valid input should still produce a
    // usable analysis for the entries that are actually valid Products.
    const products: Product[] = rawProducts.filter((p): p is Product => {
      const candidate = p as Partial<Product> | null;
      return (
        candidate != null &&
        typeof candidate === "object" &&
        typeof candidate.id === "string" &&
        typeof candidate.name === "string" &&
        candidate.name.trim().length > 0
      );
    });

    if (products.length === 0) {
      return NextResponse.json(
        {
          error: "No valid products provided to analyze.",
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
      marketResult = fallbackMarketAnalysis();
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
