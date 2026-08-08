import { NextResponse } from "next/server";
import { searchDataForSeoProducts } from "../../../lib/services/dataforseoProductSearch";

export async function POST(req: Request) {
  try {
    const filters = await req.json();

    const search =
      filters.keyword ||
      filters.query ||
      filters.search ||
      "wireless earbuds";

    const products = await searchDataForSeoProducts(String(search));

    // DataForSEO's merchant endpoint used here only pulls Amazon's catalog
    // (see lib/services/dataforseoProductSearch.ts) -- there is no real
    // AliExpress/Shopify data source behind this provider. Rather than
    // fabricate cross-platform results, the platform filter is applied
    // honestly against the inferred source of what the provider actually
    // returned: selecting a platform with no real matches correctly
    // yields zero results instead of silently ignoring the filter.
    const platform = typeof filters.platform === "string" ? filters.platform : "All";

    const filtered =
      platform === "All"
        ? products
        : products.filter((product) => product.platform === platform);

    return NextResponse.json(filtered);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Product search failed.";

    const status =
      error instanceof Error &&
      error.message.includes("DataForSEO credentials are missing")
        ? 503
        : 500;

    return NextResponse.json(
      {
        error: message,
      },
      {
        status,
      }
    );
  }
}
