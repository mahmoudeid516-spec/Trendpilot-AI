import { NextResponse } from "next/server";
import { startDataForSeoTask } from "../../../../lib/services/dataforseoProductSearch";
import { searchAliExpressProducts } from "../../../../lib/services/aliexpressProductSearch";
import type { Product } from "../../../../types/Product";

type StartedTask = { platform: string; taskId: string; count: number };
type ReadyTask = { platform: string; ready: true; products: Product[] };
type FailedTask = { platform: string; error: string; isConfigError: boolean };
type TaskDescriptor = StartedTask | ReadyTask | FailedTask;

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
      // AliExpress's aliexpress.affiliate.product.query is a single
      // synchronous request/response (no async task model like DataForSEO's
      // Amazon Merchant endpoint), so it either has real products or a real
      // error by the time this resolves -- there's nothing to hand back to
      // /api/product-search/status to poll for this source.
      const products = await searchAliExpressProducts(keyword, requestedCount ?? 20);
      return { platform, ready: true, products };
    }

    return { platform, error: `Unknown product source "${platform}".`, isConfigError: false };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Product search failed.";
    return { platform, error: message, isConfigError: isConfigurationError(message) };
  }
}

function isFailed(task: TaskDescriptor): task is FailedTask {
  return "error" in task;
}

// Submits/executes one task per requested source and returns immediately --
// Amazon's DataForSEO task is the only one that's genuinely async (started
// here, polled via GET /api/product-search/status); AliExpress resolves
// synchronously within this same request. Either way this route stays well
// within Vercel's function timeout on any plan.
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

    const allFailed = tasks.every(isFailed);

    if (allFailed) {
      const allConfigIssues = tasks.every((task) => isFailed(task) && task.isConfigError);
      return NextResponse.json({ tasks }, { status: allConfigIssues ? 503 : 500 });
    }

    return NextResponse.json({ tasks });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Product search failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
