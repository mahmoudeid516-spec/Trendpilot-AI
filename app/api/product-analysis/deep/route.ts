import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { analyzeProductDeep } from "../../../../lib/ai/analyzeProductDeep";
import type { Product } from "../../../../types/Product";

// Per-product AI deep analysis (distinct from POST /api/product-analysis,
// which summarizes an entire search batch). Requires auth, unlike the
// sibling analysis/marketing routes -- the user id is always derived from
// the verified Supabase session, never trusted from the request body.
export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "AI product analysis is not configured." },
        { status: 503 }
      );
    }

    const authHeader = req.headers.get("authorization") ?? "";

    if (!authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) as { product?: unknown };
    const candidate = body.product as Partial<Product> | null;

    const isValidProduct =
      candidate != null &&
      typeof candidate === "object" &&
      typeof candidate.id === "string" &&
      typeof candidate.name === "string" &&
      candidate.name.trim().length > 0;

    if (!isValidProduct) {
      return NextResponse.json(
        { error: "No valid product provided to analyze." },
        { status: 400 }
      );
    }

    // Isolated from the outer catch deliberately: a raw OpenAI SDK error can
    // include provider-specific detail (e.g. auth error text referencing the
    // key) that must never reach the browser. Only the classified, safe
    // message below is returned to the client; the real reason goes to
    // server logs only, matching the existing market-analysis route's
    // handling of the same AI call pattern.
    let analysis;

    try {
      analysis = await analyzeProductDeep(candidate as Product);
    } catch (aiError: unknown) {
      const reason = aiError instanceof Error ? aiError.message : "unknown error";
      console.error("[product-analysis-deep] ai_analysis_failed", {
        userId: user.id,
        productId: candidate.id,
        reason,
      });

      return NextResponse.json(
        { error: "AI product analysis is temporarily unavailable. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ analysis });
  } catch (error: unknown) {
    console.error("[product-analysis-deep] request_failed", {
      message: error instanceof Error ? error.message : "unknown error",
    });

    return NextResponse.json({ error: "Product analysis failed." }, { status: 500 });
  }
}
