import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { searchAmazon } from "@/lib/dataforseo/searchAmazon";
import { rankProducts } from "@/lib/ai/rankProducts";

const schema = z.object({
  search: z.string().min(2).max(100),
});

export async function GET(req: NextRequest) {
  try {
    const parsed = schema.safeParse({
      search:
        req.nextUrl.searchParams.get("search") ??
        "wireless earbuds",
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid search" },
        { status: 400 }
      );
    }

    const products = await searchAmazon(parsed.data.search);

const ranked = rankProducts(products).filter(
  (p) =>
    (p.ai_score ?? 0) >= 60 &&
    (p.opportunity_score ?? 0) >= 50
);
return NextResponse.json(ranked);
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}