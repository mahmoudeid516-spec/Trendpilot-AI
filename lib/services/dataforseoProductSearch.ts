import type { Product } from "../../types/Product";
import { buildStableProductId, ensureUniqueProductIds } from "./productIdentity";

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

const TASK_IN_QUEUE = 40602;
const TASK_BEING_PROCESSED = 40603;
const TASK_OK = 20000;
const POLL_INTERVAL_MS = 5000;
const MAX_POLL_DURATION_MS = 120000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
    const opportunityScore = Math.min(
      100,
      Math.round(aiScore * 0.4 + trendScore * 0.25 + Math.min(roi, 100) * 0.35)
    );

    const competition = normalizeCompetition(reviews);

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
      demand_score: Math.min(100, Math.round((sales / 20) + reviews / 50)),
      risk_score: competition === "High" ? 80 : competition === "Medium" ? 45 : 20,
      winning_probability: Math.min(100, Math.round((aiScore + opportunityScore) / 2)),
      decision: opportunityScore >= 85 ? "Strong Buy" : opportunityScore >= 70 ? "Test First" : "Avoid",
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

  const task = await pollDataForSeoTask(taskId, auth);
  const items = task.result?.[0]?.items ?? [];

  return normalizeItemsToProducts(items);
}

async function pollDataForSeoTask(taskId: string, auth: string): Promise<DataForSeoTask> {
  const deadline = Date.now() + MAX_POLL_DURATION_MS;
  let lastStatusMessage = "Unknown error";

  while (Date.now() < deadline) {
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

    if (!getResponse.ok) {
      throw new Error(`DataForSEO task retrieval failed: HTTP ${getResponse.status}`);
    }

    const task = getData.tasks?.[0];
    const taskStatusCode = task?.status_code;
    lastStatusMessage = task?.status_message ?? "Unknown error";

    if (taskStatusCode === TASK_OK) {
      return task ?? {};
    }

    if (taskStatusCode === TASK_IN_QUEUE || taskStatusCode === TASK_BEING_PROCESSED) {
      await sleep(POLL_INTERVAL_MS);
      continue;
    }

    throw new Error(
      `DataForSEO task failed: ${taskStatusCode ?? "unknown"} ${lastStatusMessage}`
    );
  }

  throw new Error(
    `DataForSEO task polling timed out after ${MAX_POLL_DURATION_MS}ms (last status: ${lastStatusMessage})`
  );
}