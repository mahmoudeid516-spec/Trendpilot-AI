import { NextRequest, NextResponse } from "next/server";
import { getDataForSeoTaskResult } from "../../../../lib/services/dataforseoProductSearch";
import type { Product } from "../../../../types/Product";

type PendingTask = { platform: string; taskId: string; count: number };

type SourceStatus =
  | { platform: string; ready: true; products: Product[] }
  | { platform: string; ready: false };

async function checkSource(task: PendingTask): Promise<SourceStatus> {
  if (task.platform === "Amazon") {
    const result = await getDataForSeoTaskResult(task.taskId, task.count);
    return result.ready
      ? { platform: task.platform, ready: true, products: result.products }
      : { platform: task.platform, ready: false };
  }

  // No other source currently issues a real pollable taskId (see
  // app/api/product-search/start/route.ts) -- nothing should ever reach
  // this branch, but it fails closed (never ready, no fabricated
  // products) rather than assuming.
  return { platform: task.platform, ready: false };
}

// Checks every previously-started, still-pending task exactly once and
// returns immediately either way -- no loop, no waiting. The client is
// what polls this route repeatedly (services/productSearch.ts), which is
// what keeps this compatible with Vercel's default function timeout on
// any plan.
export async function GET(req: NextRequest) {
  try {
    const tasksParam = req.nextUrl.searchParams.get("tasks");

    if (!tasksParam) {
      return NextResponse.json({ error: "Missing tasks." }, { status: 400 });
    }

    let pending: PendingTask[];
    try {
      pending = JSON.parse(tasksParam);
    } catch {
      return NextResponse.json({ error: "Invalid tasks parameter." }, { status: 400 });
    }

    if (!Array.isArray(pending) || pending.length === 0) {
      return NextResponse.json({ error: "Missing or invalid tasks." }, { status: 400 });
    }

    for (const task of pending) {
      if (!task || typeof task.taskId !== "string" || !Number.isFinite(task.count) || task.count <= 0) {
        return NextResponse.json({ error: "Missing or invalid taskId/count." }, { status: 400 });
      }
    }

    const sources = await Promise.all(pending.map(checkSource));
    const ready = sources.every((source) => source.ready);

    return NextResponse.json({ ready, sources });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Product search failed.";

    const isConfigurationError =
      error instanceof Error && error.message.includes("DataForSEO credentials are missing");

    const status = isConfigurationError ? 503 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
