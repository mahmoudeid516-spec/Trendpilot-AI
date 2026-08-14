import { NextResponse } from "next/server";
import { startDataForSeoTask } from "../../../../lib/services/dataforseoProductSearch";
import { searchAliExpressProducts } from "../../../../lib/services/aliexpressProductSearch";

type StartedTask = { platform: string; taskId: string; count: number };
type FailedTask = { platform: string; error: string; isConfigError: boolean };
type TaskDescriptor = StartedTask | FailedTask;

function isConfigurationError(message: string): boolean {
  return (
    message.includes("DataForSEO credentials are missing") ||
    message.includes("DATAFORSEO_LOCATION_CODE is required") ||
    message.includes("DATAFORSEO_LOCATION_CODE is not a valid number") ||
    message.includes("AliExpress integration is not configured")
  );
}

async function startSource(
  platform: string,
  keyword: string,
  requestedCount: number | undefined
): Promise<TaskDescriptor> {
  try {
    if (platform === "Amazon") {
      const { taskId, count } = await startDataForSeoTask(keyword, requestedCount);
      return { platform, taskId, count };
    }

    if (platform === "AliExpress") {
      // AliExpress has no async task model implemented (see
      // lib/services/aliexpressProductSearch.ts) -- calling it here always
      // resolves to its honest configuration/not-implemented error rather
      // than ever returning a pollable task.
      await searchAliExpressProducts(keyword, requestedCount ?? 20);
      // Unreachable today, kept for shape-completeness if this source
      // gains a real async task model later.
      return { platform, error: "Unexpected: AliExpress search returned without error.", isConfigError: false };
    }

    return { platform, error: `Unknown product source "${platform}".`, isConfigError: false };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Product search failed.";
    return { platform, error: message, isConfigError: isConfigurationError(message) };
  }
}

// Submits one task per requested source and returns immediately -- this
// route still does no polling itself (Amazon's DataForSEO task is the only
// one that's genuinely async right now; see startSource above), so it
// stays well within Vercel's function timeout on any plan. The client
// polls GET /api/product-search/status for whichever tasks actually
// started.
export async function POST(req: Request) {
  try {
    const filters = await req.json();

    const search = filters.keyword || filters.query || filters.search || "wireless earbuds";
    const requestedCount = Number.isFinite(Number(filters.count)) ? Number(filters.count) : undefined;
    const platform: string = filters.platform || "Amazon";

    const sources = platform === "All" ? ["Amazon", "AliExpress"] : [platform];

    const tasks = await Promise.all(
      sources.map((source) => startSource(source, String(search), requestedCount))
    );

    const allFailed = tasks.every((task) => "error" in task);

    if (allFailed) {
      const allConfigIssues = tasks.every((task) => "error" in task && task.isConfigError);
      return NextResponse.json({ tasks }, { status: allConfigIssues ? 503 : 500 });
    }

    return NextResponse.json({ tasks });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Product search failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
