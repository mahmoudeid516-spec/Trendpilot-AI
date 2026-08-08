import type { Product } from "../../types/Product";
import { buildStableProductId, ensureUniqueProductIds } from "./productIdentity";

type DataForSeoItem = {
  title?: string;
  description?: string;
  price?: {
    current?: number;
    regular?: number;
    currency?: string;
  };
  rating?: {
    value?: number;
    votes_count?: number;
  };
  seller?: string;
  source?: string;
  rank_absolute?: number;
  url?: string;
  image_url?: string;
};

type DataForSeoResult = {
  items?: DataForSeoItem[];
};

type DataForSeoTask = {
  result?: DataForSeoResult[];
  // Per-task status, distinct from the top-level API response status_code.
  // 20000 means this specific task has finished processing and has
  // results; other codes (e.g. task still queued/in progress) mean the
  // task isn't ready yet and must be polled again.
  status_code?: number;
  status_message?: string;
};

type DataForSeoResponse = {
  tasks?: DataForSeoTask[];
};

function asNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

// This provider only ever queries DataForSEO's merchant/amazon/products
// endpoint (see searchDataForSeoProducts below), so every item it returns
// genuinely is an Amazon listing -- labeling it as anything else (or
// guessing from a "source" field the endpoint doesn't reliably populate)
// would misrepresent real data as something it isn't.
const PRODUCT_SOURCE: Product["source"] = "Amazon";

// DataForSEO location codes we can honestly label. Falls back to "Unknown"
// rather than guessing, so the country field never claims a region we
// didn't actually search.
const COUNTRY_NAME_BY_LOCATION_CODE: Record<number, string> = {
  2840: "United States",
  2826: "United Kingdom",
  2124: "Canada",
  2036: "Australia",
  2276: "Germany",
  2250: "France",
};

function normalizeCompetition(reviews: number): Product["competition"] {
  if (reviews > 1000) return "High";
  if (reviews > 250) return "Medium";
  return "Low";
}

function normalizeItemsToProducts(
  items: DataForSeoItem[],
  keyword: string,
  locationCode: number
): Product[] {
  const products: Product[] = [];

  const country = COUNTRY_NAME_BY_LOCATION_CODE[locationCode] ?? "Unknown";
  const category = keyword.trim()
    ? keyword.trim().replace(/\b\w/g, (c) => c.toUpperCase())
    : "Uncategorized";

  for (const item of items) {
    // This is the real, current Amazon listing price for the item --
    // genuine market data, not an estimate.
    const buyPrice = asNumber(item.price?.current, 0);
    if (!buyPrice) continue;

    const rating = asNumber(item.rating?.value, 0);
    const reviews = asNumber(item.rating?.votes_count, 0);
    const sales = Math.max(0, Math.round(reviews * 0.4));

    // Everything below this point is a heuristic estimate derived from the
    // real price/rating/review data above -- none of it is verified market
    // data. It must be presented in the UI as an estimate, never as fact.
    const sellingPrice = Number((buyPrice * 2.3).toFixed(2));
    const profit = Number((sellingPrice - buyPrice).toFixed(2));
    const roi = buyPrice > 0 ? Math.round((profit / buyPrice) * 100) : 0;

    const aiScore = Math.min(100, Math.round(rating * 20 + Math.min(sales / 15, 30)));
    const trendScore = Math.min(100, Math.round(Math.max(rating * 18, 10)));
    const viralScore = Math.min(100, Math.round(aiScore * 0.6 + trendScore * 0.4));
    const opportunityScore = Math.min(
      100,
      Math.round(aiScore * 0.4 + trendScore * 0.25 + Math.min(roi, 100) * 0.35)
    );

    const competition = normalizeCompetition(reviews);

    const product: Product = {
      id: buildStableProductId({
        id: item.url,
        name: item.title,
        platform: PRODUCT_SOURCE,
        product_url: item.url,
        supplier_url: item.url,
        category,
        buy_price: buyPrice,
        selling_price: sellingPrice,
      }),
      source: PRODUCT_SOURCE,
      platform: PRODUCT_SOURCE,
      name: String(item.title ?? "").trim(),
      description: String(item.description ?? item.title ?? "").trim(),
      image: String(item.image_url ?? "").trim(),
      category,
      brand: String(item.seller ?? PRODUCT_SOURCE).trim(),
      product_url: String(item.url ?? "").trim(),
      supplier: String(item.seller ?? PRODUCT_SOURCE).trim(),
      supplier_url: String(item.url ?? "").trim(),
      store_name: String(item.seller ?? PRODUCT_SOURCE).trim(),
      store_rating: rating,
      supplier_rating: rating,
      currency: String(item.price?.currency ?? "USD"),
      buy_price: buyPrice,
      selling_price: sellingPrice,
      profit,
      roi,
      sales,
      orders: sales,
      reviews,
      country,
      ai_score: aiScore,
      trend_score: trendScore,
      viral_score: viralScore,
      opportunity_score: opportunityScore,
      demand_score: Math.min(100, Math.round((sales / 20) + reviews / 50)),
      risk_score: competition === "High" ? 80 : competition === "Medium" ? 45 : 20,
      winning_probability: Math.min(100, Math.round((aiScore + opportunityScore) / 2)),
      decision: opportunityScore >= 85 ? "Strong Buy" : opportunityScore >= 70 ? "Test First" : "Avoid",
      ai_reason:
        "Estimated from the current Amazon price, rating, and review volume. Not verified market or profit data.",
      competition,
    };

    if (!product.name || !product.image || !product.product_url) continue;

    products.push(product);
  }

  return ensureUniqueProductIds(products);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// task_post only queues the job; DataForSEO processes merchant/product
// tasks asynchronously and typically takes several seconds to complete.
// Polling task_get immediately (as this used to do) almost always hits an
// unfinished task, which silently resolves to zero items rather than an
// error -- that's the bug this loop fixes. Bounded to stay well under
// common serverless function timeouts.
const TASK_POLL_MAX_ATTEMPTS = 10;
const TASK_POLL_INTERVAL_MS = 2000;

async function pollDataForSeoTask(
  taskId: string,
  auth: string
): Promise<DataForSeoResponse> {
  for (let attempt = 0; attempt < TASK_POLL_MAX_ATTEMPTS; attempt += 1) {
    if (attempt > 0) {
      await sleep(TASK_POLL_INTERVAL_MS);
    }

    const getResponse = await fetch(
      `https://api.dataforseo.com/v3/merchant/amazon/products/task_get/advanced/${taskId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const getData = (await getResponse.json()) as DataForSeoResponse & {
      status_code?: number;
      status_message?: string;
    };

    if (!getResponse.ok || getData.status_code !== 20000) {
      throw new Error(
        `DataForSEO task retrieval failed: ${getData.status_message ?? "Unknown error"}`
      );
    }

    // The top-level status_code above only confirms the *request to check
    // status* succeeded -- the task's own status_code says whether the
    // task itself has actually finished processing.
    const taskStatusCode = getData.tasks?.[0]?.status_code;

    if (taskStatusCode === 20000) {
      return getData;
    }
  }

  throw new Error(
    "DataForSEO task did not complete in time. Please try again."
  );
}

export async function searchDataForSeoProducts(keyword: string): Promise<Product[]> {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;

  if (!login || !password) {
    throw new Error(
      "DataForSEO credentials are missing. Set DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD."
    );
  }

  const locationCode = Number(process.env.DATAFORSEO_LOCATION_CODE ?? 2840);
  const languageCode = process.env.DATAFORSEO_LANGUAGE_CODE ?? "en";

  const auth = Buffer.from(`${login}:${password}`).toString("base64");

  const response = await fetch(
    "https://api.dataforseo.com/v3/merchant/amazon/products/task_post",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          keyword,
          location_code: locationCode,
          language_code: languageCode,
          depth: 30,
        },
      ]),
    }
  );

  const postData = (await response.json()) as {
    tasks?: Array<{ id?: string }>;
    status_code?: number;
    status_message?: string;
  };

  if (!response.ok || postData.status_code !== 20000) {
    throw new Error(
      `DataForSEO task creation failed: ${postData.status_message ?? "Unknown error"}`
    );
  }

  const taskId = postData.tasks?.[0]?.id;

  if (!taskId) {
    throw new Error("DataForSEO task id was not returned.");
  }

  const getData = await pollDataForSeoTask(taskId, auth);

  const items = getData.tasks?.[0]?.result?.[0]?.items ?? [];

  return normalizeItemsToProducts(items, keyword, locationCode);
}