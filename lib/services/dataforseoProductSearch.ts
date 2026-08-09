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
  price_from?: number;
  price_to?: number;
  currency?: string;
  rating?: {
    value?: number;
    votes_count?: number;
  };
  seller?: string;
  source?: string;
  domain?: string;
  rank_absolute?: number;
  url?: string;
  image_url?: string;
  asin?: string;
  data_asin?: string;
};

type DataForSeoResult = {
  items?: DataForSeoItem[];
};

type DataForSeoTask = {
  result?: DataForSeoResult[];
};

type DataForSeoResponse = {
  tasks?: DataForSeoTask[];
};

function asNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeSource(value: string | undefined): Product["source"] {
  const source = String(value ?? "").toLowerCase();

  if (source.includes("amazon")) return "Amazon";
  if (source.includes("shopify")) return "Shopify";

  return "AliExpress";
}

function extractPrice(item: DataForSeoItem): number {
  return asNumber(
    item.price?.current ?? item.price_from ?? item.price?.regular ?? item.price_to,
    0
  );
}

function extractAsin(item: DataForSeoItem): string {
  return String(item.asin ?? item.data_asin ?? "").trim();
}

function normalizeCompetition(reviews: number): Product["competition"] {
  if (reviews > 1000) return "High";
  if (reviews > 250) return "Medium";
  return "Low";
}

function normalizeItemsToProducts(items: DataForSeoItem[]): Product[] {
  const products: Product[] = [];

  for (const item of items) {
    const buyPrice = extractPrice(item);
    if (!buyPrice) continue;

    const source = normalizeSource(item.source ?? item.domain);
    const asin = extractAsin(item);
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
        id: item.url,
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
      description: String(item.description ?? item.title ?? "").trim(),
      image: String(item.image_url ?? "").trim(),
      category: "General",
      brand: String(item.seller ?? source).trim(),
      product_url: String(item.url ?? "").trim(),
      supplier: String(item.seller ?? source).trim(),
      supplier_url: String(item.url ?? "").trim(),
      store_name: String(item.seller ?? source).trim(),
      store_rating: rating,
      supplier_rating: rating,
      currency: String(item.price?.currency ?? item.currency ?? "USD"),
      asin: asin || undefined,
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

  type TaskGetResponse = DataForSeoResponse & {
    status_code?: number;
    status_message?: string;
    tasks?: Array<
      DataForSeoTask & { status_code?: number; status_message?: string }
    >;
  };

  const maxAttempts = 10;
  const pollDelayMs = 3000;
  let lastStatusMessage = "Unknown error";

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const getResponse = await fetch(
      `https://api.dataforseo.com/v3/merchant/amazon/products/task_get/advanced/${taskId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const getData = (await getResponse.json()) as TaskGetResponse;

    if (!getResponse.ok || getData.status_code !== 20000) {
      throw new Error(
        `DataForSEO task retrieval failed: ${getData.status_message ?? "Unknown error"}`
      );
    }

    const task = getData.tasks?.[0];
    lastStatusMessage = task?.status_message ?? lastStatusMessage;

    if (task?.status_code === 20000) {
      const items = task.result?.[0]?.items ?? [];
      return normalizeItemsToProducts(items);
    }

    if (attempt < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, pollDelayMs));
    }
  }

  throw new Error(
    `DataForSEO task did not complete in time: ${lastStatusMessage}`
  );
}