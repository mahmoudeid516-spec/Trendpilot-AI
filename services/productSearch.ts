type ProductSearchFilters = {
  keyword?: string;
  platform?: string;
  query?: string;
  search?: string;
  /** Requested product count (10/20/30/50/100). Optional -- server defaults to 20. */
  count?: number;
};

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

export async function productSearch(filters: ProductSearchFilters) {
  const search =
    filters?.keyword ||
    filters?.query ||
    filters?.search ||
    "wireless earbuds";

  const startResponse = await fetch("/api/product-search/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      keyword: search,
      count: filters?.count,
    }),
  });

  const { taskId, count } = await parseJsonOrThrow(
    startResponse,
    `Product search failed (HTTP ${startResponse.status}).`
  );

  const deadline = Date.now() + MAX_POLL_DURATION_MS;

  while (true) {
    const statusResponse = await fetch(
      `/api/product-search/status?taskId=${encodeURIComponent(taskId)}&count=${encodeURIComponent(count)}`
    );

    const statusBody = await parseJsonOrThrow(
      statusResponse,
      `Product search failed (HTTP ${statusResponse.status}).`
    );

    if (statusBody.ready) {
      return statusBody.products;
    }

    if (Date.now() >= deadline) {
      throw new Error("Product search timed out waiting for results.");
    }

    await sleep(POLL_INTERVAL_MS);
  }
}
