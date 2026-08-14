import type { Product } from "../types/Product";

type ProductSearchFilters = {
  keyword?: string;
  platform?: string;
  query?: string;
  search?: string;
  /** Requested product count (10/20/30/50/100). Optional -- server defaults to 20. */
  count?: number;
};

export type ProductSourceError = {
  platform: string;
  message: string;
  isConfigError: boolean;
};

export type ProductSearchResult = {
  products: Product[];
  sourceErrors: ProductSourceError[];
};

type StartedTask = { platform: string; taskId: string; count: number };
type ReadyTask = { platform: string; ready: true; products: Product[] };
type FailedTask = { platform: string; error: string; isConfigError: boolean };
type TaskDescriptor = StartedTask | ReadyTask | FailedTask;

// DataForSEO's Merchant Amazon Products task is async, so the search is a
// submit-then-poll dance across two routes (/api/product-search/start,
// /api/product-search/status) instead of one blocking request -- this used
// to be a single synchronous call that polled for up to 2 minutes *inside*
// the server route, which Vercel's serverless function timeout (10s on
// Hobby) kills long before DataForSEO can finish. Polling from the browser
// instead has no such limit. These numbers match what the server-side loop
// used before the split.
const POLL_INTERVAL_MS = 5000;
const MAX_POLL_DURATION_MS = 120000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function parseJsonOrThrow(response: Response, fallbackMessage: string) {
  if (!response.ok) {
    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const body = await response.json().catch(() => null);
      throw new Error(
        (typeof body?.error === "string" && body.error) || fallbackMessage
      );
    }

    const text = await response.text().catch(() => "");
    throw new Error(text || fallbackMessage);
  }

  return await response.json();
}

// /api/product-search/start can legitimately use a non-2xx status (503/500)
// while still returning a meaningful, structured { tasks: [...] } body --
// that status only means "every requested source failed to start", not
// "the response itself is garbage". parseJsonOrThrow's generic handling
// would discard the real per-source error in that body and replace it with
// a vague "HTTP 503" message, so this endpoint always parses the JSON body
// itself first and only falls back to the generic error when the body
// genuinely isn't the expected shape (e.g. the route's outer catch, which
// returns a plain { error } with no tasks array).
async function parseStartResponse(
  response: Response,
  fallbackMessage: string
): Promise<{ tasks: TaskDescriptor[] }> {
  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json") ? await response.json().catch(() => null) : null;

  if (body && Array.isArray(body.tasks)) {
    return body;
  }

  throw new Error((typeof body?.error === "string" && body.error) || fallbackMessage);
}

function isStarted(task: TaskDescriptor): task is StartedTask {
  return "taskId" in task;
}

function isReady(task: TaskDescriptor): task is ReadyTask {
  return "ready" in task && task.ready === true;
}

/**
 * Searches one or more product sources (platform: "Amazon" | "AliExpress" |
 * "All") and returns real products plus, per source, an honest error if
 * that source couldn't run -- never a silent fallback and never a
 * fabricated result for a source that failed. Amazon-only behavior
 * (platform omitted or "Amazon") is unchanged from before multi-source
 * support was added.
 */
export async function productSearch(filters: ProductSearchFilters): Promise<ProductSearchResult> {
  const search =
    filters?.keyword ||
    filters?.query ||
    filters?.search ||
    "wireless earbuds";

  const platform = filters?.platform || "Amazon";

  const startResponse = await fetch("/api/product-search/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      keyword: search,
      count: filters?.count,
      platform,
    }),
  });

  const startBody = await parseStartResponse(
    startResponse,
    `Product search failed (HTTP ${startResponse.status}).`
  );

  const sourceErrors: ProductSourceError[] = [];
  let pending: StartedTask[] = [];
  const productsBySource = new Map<string, Product[]>();

  for (const task of startBody.tasks) {
    if (isStarted(task)) {
      pending.push(task);
    } else if (isReady(task)) {
      // Resolved synchronously at start time (AliExpress has no async task
      // model) -- nothing to poll for this source.
      productsBySource.set(task.platform, task.products);
    } else {
      sourceErrors.push({ platform: task.platform, message: task.error, isConfigError: task.isConfigError });
    }
  }

  if (pending.length === 0) {
    return { products: Array.from(productsBySource.values()).flat(), sourceErrors };
  }

  const deadline = Date.now() + MAX_POLL_DURATION_MS;

  while (pending.length > 0) {
    const tasksParam = encodeURIComponent(JSON.stringify(pending));

    const statusResponse = await fetch(`/api/product-search/status?tasks=${tasksParam}`);

    const statusBody: {
      ready: boolean;
      sources: Array<{ platform: string; ready: boolean; products?: Product[] }>;
    } = await parseJsonOrThrow(statusResponse, `Product search failed (HTTP ${statusResponse.status}).`);

    for (const source of statusBody.sources) {
      if (source.ready) {
        productsBySource.set(source.platform, source.products ?? []);
      }
    }

    pending = pending.filter((task) => !productsBySource.has(task.platform));

    if (pending.length === 0) break;

    if (Date.now() >= deadline) {
      throw new Error("Product search timed out waiting for results.");
    }

    await sleep(POLL_INTERVAL_MS);
  }

  const products = Array.from(productsBySource.values()).flat();

  return { products, sourceErrors };
}
