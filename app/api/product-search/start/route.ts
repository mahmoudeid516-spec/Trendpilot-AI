import { NextResponse } from "next/server";
import { startDataForSeoTask } from "../../../../lib/services/dataforseoProductSearch";

// Submits the DataForSEO task and returns immediately with its id -- this
// route does no polling, so it stays well within Vercel's default function
// timeout on any plan, including Hobby. The client polls
// GET /api/product-search/status for the result.
export async function POST(req: Request) {
  try {
    const filters = await req.json();

    const search =
      filters.keyword || filters.query || filters.search || "wireless earbuds";

    const requestedCount = Number.isFinite(Number(filters.count))
      ? Number(filters.count)
      : undefined;

    const { taskId, count } = await startDataForSeoTask(String(search), requestedCount);

    return NextResponse.json({ taskId, count });
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
