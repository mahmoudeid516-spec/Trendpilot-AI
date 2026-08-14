import { NextRequest, NextResponse } from "next/server";
import { getDataForSeoTaskResult } from "../../../../lib/services/dataforseoProductSearch";

// Checks a previously-started DataForSEO task exactly once and returns
// immediately either way -- no loop, no waiting. The client is what polls
// this route repeatedly (services/productSearch.ts), which is what keeps
// this compatible with Vercel's default function timeout on any plan.
export async function GET(req: NextRequest) {
  try {
    const taskId = req.nextUrl.searchParams.get("taskId");
    const count = Number(req.nextUrl.searchParams.get("count"));

    if (!taskId) {
      return NextResponse.json({ error: "Missing taskId." }, { status: 400 });
    }

    if (!Number.isFinite(count) || count <= 0) {
      return NextResponse.json({ error: "Missing or invalid count." }, { status: 400 });
    }

    const result = await getDataForSeoTaskResult(taskId, count);

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Product search failed.";

    const isConfigurationError =
      error instanceof Error &&
      error.message.includes("DataForSEO credentials are missing");

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
