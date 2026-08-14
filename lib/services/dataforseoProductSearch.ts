import type { Product } from "../../types/Product";
import { buildStableProductId, ensureUniqueProductIds } from "./productIdentity";
import { scoreProduct } from "../scoring/opportunityScore";
import { DEFAULT_PRODUCT_COUNT } from "./productCount";

type DataForSeoItem = {
  title?: string;
  domain?: string;
  url?: string;
  image_url?: string;
  price_from?: number;
  price_to?: number;
  currency?: string;
  data_asin?: string;
  rating?: {
    value?: number;
    votes_count?: number;
  };
  is_amazon_choice?: boolean;
  is_best_seller?: boolean;
  delivery_info?: {
    delivery_message?: string;
  };
  rank_absolute?: number;
};

type DataForSeoResult = {
  items?: DataForSeoItem[];
};

type DataForSeoTask = {
  id?: string;
  status_code?: number;
  status_message?: string;
  result?: DataForSeoResult[];
};

type DataForSeoResponse = {
  tasks?: DataForSeoTask[];
};

async function parseDataForSeoJson<T>(response: Response, context: string): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.toLowerCase().includes("application/json");

  if (!response.ok || !isJson) {
    const rawBody = await response.text().catch(() => "");
    const truncatedBody = rawBody.slice(0, 200).trim().replace(/\s+/g, " ");

    throw new Error(
      `DataForSEO request failed (${context}): HTTP ${response.status} ${response.statusText}` +
        (truncatedBody ? ` — ${truncatedBody}` : "")
    );
  }

  return (await response.json()) as T;
}

function asNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeCompetition(reviews: number): Product["competition"] {
  if (reviews > 1000) return "High";
  if (reviews > 250) return "Medium";
  return "Low";
}

function normalizeItemsToProducts(items: DataForSeoItem[]): Product[] {
  const products: Product[] = [];

  for (const item of items) {
    const buyPrice = asNumber(item.price_from, 0);
    if (!buyPrice) continue;

    const source: Product["source"] = "Amazon";
    const seller = String(item.domain ?? "Amazon").trim() || "Amazon";
    const rating = asNumber(item.rating?.value, 0);
    const reviews = asNumber(item.rating?.votes_count, 0);
    const sales = Math.max(0, Math.round(reviews * 0.4));

    const sellingPrice = Number((buyPrice * 2.3).toFixed(2));
    const profit = Number((sellingPrice - buyPrice).toFixed(2));
    const roi = buyPrice > 0 ? Math.round((profit / buyPrice) * 100) : 0;

    const aiScore = Math.min(100, Math.round(rating * 20 + Math.min(sales / 15, 30)));
    const trendScore = Math.min(100, Math.round(Math.max(rating * 18, 10)));
    const viralScore = Math.min(100, Math.round(aiScore * 0.6 + trendScore * 0.4));
    const demandScore = Math.min(100, Math.round(sales / 20 + reviews / 50));
    const competition = normalizeCompetition(reviews);
    const riskScore = competition === "High" ? 80 : competition === "Medium" ? 45 : 20;

    // opportunity_score / winning_probability / decision are computed by the
    // single canonical scoring pipeline (lib/scoring/opportunityScore.ts) so
    // every code path that touches a Product sees the same values -- this
    // used to be computed here AND separately (differently) in
    // services/businessAdvisor.ts, which meant the same product could show
    // two different scores depending on which search path found it.
    const { opportunity_score: opportunityScore, winning_probability: winningProbability, decision } =
      scoreProduct({
        ai_score: aiScore,
        trend_score: trendScore,
        viral_score: viralScore,
        demand_score: demandScore,
        risk_score: riskScore,
        roi,
        competition,
      });

    const product: Product = {
      id: buildStableProductId({
        id: item.data_asin || item.url,
        name: item.title,
        platform: source,
        product_url: item.url,
        supplier_url: item.url,
        category: "General",
        buy_price: buyPrice,
        selling_price: sellingPrice,
      }),
      source,
      platform: source,
      name: String(item.title ?? "").trim(),
      description: String(item.title ?? "").trim(),
      image: String(item.image_url ?? "").trim(),
      category: "General",
      brand: seller,
      product_url: String(item.url ?? "").trim(),
      supplier: seller,
      supplier_url: String(item.url ?? "").trim(),
      store_name: seller,
      store_rating: rating,
      supplier_rating: rating,
      currency: String(item.currency ?? "USD"),
      buy_price: buyPrice,
      selling_price: sellingPrice,
      profit,
      roi,
      sales,
      orders: sales,
      reviews,
      country: "US",
      shipping_days: 10,
      ai_score: aiScore,
      trend_score: trendScore,
      viral_score: viralScore,
      opportunity_score: opportunityScore,
      demand_score: demandScore,
      risk_score: riskScore,
      winning_probability: winningProbability,
      decision,
      ai_reason: "",
      competition,
      trend_direction: "Stable",
      seasonality: "Evergreen",
      cpm: 0,
      cpa: 0,
      asin: item.data_asin ? String(item.data_asin).trim() : undefined,
      amazon_choice: Boolean(item.is_amazon_choice),
      best_seller: Boolean(item.is_best_seller),
      delivery_info: item.delivery_info?.delivery_message
        ? String(item.delivery_info.delivery_message).trim()
        : undefined,
      price_to: item.price_to != null ? asNumber(item.price_to) : undefined,
    };

    if (!product.name || !product.image || !product.product_url) continue;

    products.push(product);
  }

  return ensureUniqueProductIds(products);
}

const MIN_PRODUCT_COUNT = 1;
const MAX_PRODUCT_COUNT = 100;

function normalizeRequestedCount(count?: number): number {
  if (!Number.isFinite(count)) return DEFAULT_PRODUCT_COUNT;
  return Math.min(MAX_PRODUCT_COUNT, Math.max(MIN_PRODUCT_COUNT, Math.round(count as number)));
}

function getDataForSeoCredentials(): { login: string; password: string } {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;

  if (!login || !password) {
    throw new Error(
      "DataForSEO credentials are missing. Set DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD."
    );
  }

  return { login, password };
}

// DataForSEO's Merchant Amazon Products endpoint is async: task_post below
// only submits the task and returns its id. A separate call
// (getDataForSeoTaskResult) checks once whether it's done -- there is no
// server-side polling loop here. That loop used to live in this file and run
// for up to 2 minutes inside a single serverless invocation, which Vercel
// (particularly on Hobby, whose function timeout is far short of that) kills
// well before DataForSEO can finish. The client (services/productSearch.ts)
// now does the waiting, calling getDataForSeoTaskResult repeatedly on its
// own schedule -- the browser has no execution-duration limit to fight.
export async function startDataForSeoTask(
  keyword: string,
  requestedCount?: number
): Promise<{ taskId: string; count: number }> {
  const { login, password } = getDataForSeoCredentials();

  // merchant/amazon/products location codes are NOT confirmed to follow
  // DataForSEO's general SERP/Ads numbering (where 2840 = United States).
  // Their own OpenAPI spec's example for this specific endpoint's
  // location_code is a 7-digit value (9045969), and a real documented
  // Amazon Merchant location entry is {'location_code': 9041134,
  // 'location_name': '90290,California,United States'} -- both nothing
  // like 2840. The correct value cannot be verified without a live call to
  // GET https://api.dataforseo.com/v3/merchant/amazon/locations (not
  // available in this environment), so there is no safe default: silently
  // falling back to a guessed value risks creating tasks against an
  // invalid location that will never return meaningful results. This is a
  // required configuration value -- set it explicitly after confirming it
  // against a real /locations response for your target market.
  const locationCodeEnv = process.env.DATAFORSEO_LOCATION_CODE;

  if (!locationCodeEnv) {
    throw new Error(
      "DATAFORSEO_LOCATION_CODE is required for Amazon Merchant Products"
    );
  }

  const locationCode = Number(locationCodeEnv);

  if (!Number.isFinite(locationCode)) {
    throw new Error(
      `DATAFORSEO_LOCATION_CODE is not a valid number: "${locationCodeEnv}"`
    );
  }

  if (locationCode < 1_000_000) {
    console.warn("[dataforseo] location_code_looks_unconfirmed", {
      locationCode,
      reason:
        "Documented Amazon Merchant Products location codes are 7-digit " +
        "values (~9,0xx,xxx). This configured value is far smaller and may " +
        "be from DataForSEO's general SERP/Ads location numbering instead. " +
        "Verify via GET https://api.dataforseo.com/v3/merchant/amazon/locations.",
    });
  }

  const languageName = "English (United States)";
  const count = normalizeRequestedCount(requestedCount);
  const depth = count;

  // Diagnostic only -- never logs credentials or the Authorization header.
  console.log("[dataforseo] search_start", { keyword, locationCode, languageName, depth, requestedCount: count });

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
          language_name: languageName,
          depth,
        },
      ]),
    }
  );

  const postData = await parseDataForSeoJson<{
    tasks?: Array<{ id?: string; status_code?: number; status_message?: string }>;
    status_code?: number;
    status_message?: string;
  }>(response, "task creation");

  console.log("[dataforseo] task_post_response", {
    httpStatus: response.status,
    topLevelStatusCode: postData.status_code,
    topLevelStatusMessage: postData.status_message,
    taskStatusCode: postData.tasks?.[0]?.status_code,
    taskStatusMessage: postData.tasks?.[0]?.status_message,
    taskIdReturned: Boolean(postData.tasks?.[0]?.id),
  });

  if (postData.status_code !== 20000) {
    throw new Error(
      `DataForSEO task creation failed: ${postData.status_message ?? "Unknown error"}`
    );
  }

  const taskId = postData.tasks?.[0]?.id;

  if (!taskId) {
    throw new Error("DataForSEO task id was not returned.");
  }

  return { taskId, count };
}

// One check, not a loop: the caller (GET /api/product-search/status) is
// itself called repeatedly by the client, so this only ever needs to report
// whether the task is done yet.
export async function getDataForSeoTaskResult(
  taskId: string,
  count: number
): Promise<{ ready: false } | { ready: true; products: Product[] }> {
  const { login, password } = getDataForSeoCredentials();
  const auth = Buffer.from(`${login}:${password}`).toString("base64");

  const getResponse = await fetch(
    `https://api.dataforseo.com/v3/merchant/amazon/products/task_get/advanced/${taskId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  const getData = await parseDataForSeoJson<
    DataForSeoResponse & {
      status_code?: number;
      status_message?: string;
    }
  >(getResponse, "task retrieval");

  const task = getData.tasks?.[0];
  const resultPresent = task?.result != null;

  // Diagnostic only -- never logs credentials or the Authorization header.
  // taskStatusCode/taskStatusMessage are surfaced here purely for human
  // inspection: DataForSEO's specific in-progress/failure status codes for
  // this endpoint are not published in any first-party machine-readable
  // source we could verify, so this code does not branch on them (see the
  // resultPresent check below). Logging the raw values lets a real run
  // against live DataForSEO reveal what those codes actually are, without
  // guessing.
  console.log("[dataforseo] status_check", {
    taskId,
    httpStatus: getResponse.status,
    taskStatusCode: task?.status_code,
    taskStatusMessage: task?.status_message,
    resultPresent,
  });

  // DataForSEO documents `result` as always null at task_post time, and the
  // same null-until-ready contract holds for task_get across their async
  // APIs generally (confirmed against their official generated client
  // models). Readiness is determined by result presence: a non-null result
  // -- including a non-null empty array, a legitimate zero-match search --
  // means the task has completed. A null/undefined result means it isn't
  // ready yet, and the client will check again.
  if (!task || !resultPresent) {
    return { ready: false };
  }

  const items = task.result?.[0]?.items ?? [];
  const normalized = normalizeItemsToProducts(items);
  // Never return more than requested, and never pad with fabricated
  // products if fewer real ones survived normalization -- the caller sees
  // exactly how many real products came back via products.length.
  const products = normalized.slice(0, count);

  console.log("[dataforseo] search_complete", {
    taskId,
    requestedCount: count,
    rawItemCount: items.length,
    normalizedProductCount: normalized.length,
    returnedProductCount: products.length,
  });

  return { ready: true, products };
}