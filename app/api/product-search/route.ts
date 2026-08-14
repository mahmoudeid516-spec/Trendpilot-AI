import { NextResponse } from "next/server";
import { searchDataForSeoProducts } from "../../../lib/services/dataforseoProductSearch";

// DataForSEO's Merchant Amazon Products endpoint is async (task_post, then
// poll task_get for up to MAX_POLL_DURATION_MS in dataforseoProductSearch.ts
// -- currently 120s) and that polling happens synchronously inside this one
// request. Without an explicit maxDuration, Vercel kills the function at its
// plan's default (10s on Hobby, 15s on Pro), well before DataForSEO can
// finish. This raises the ceiling as a minimal stopgap -- it does not change
// the underlying synchronous-polling architecture, and it only helps if the
// deployment's Vercel plan actually permits 120s (Hobby's ceiling is lower
// even with this set; Pro/Enterprise can go this high).
export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const filters = await req.json();

    const search =
      filters.keyword ||
      filters.query ||
      filters.search ||
      "wireless earbuds";

    const requestedCount = Number.isFinite(Number(filters.count))
      ? Number(filters.count)
      : undefined;

    const products = await searchDataForSeoProducts(String(search), requestedCount);

    return NextResponse.json(products);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Product search failed.";

    const isConfigurationError =
      error instanceof Error &&
      (error.message.includes("DataForSEO credentials are missing") ||
        error.message.includes("DATAFORSEO_LOCATION_CODE is required") ||
        error.message.includes("DATAFORSEO_LOCATION_CODE is not a valid number"));

    const status = isConfigurationError ? 503 : 500;

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