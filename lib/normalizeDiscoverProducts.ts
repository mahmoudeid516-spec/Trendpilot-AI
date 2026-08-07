import { calculateScores } from "./ai/scoringEngine";

export interface DiscoveredProductInput {
    id?: number;

    name: string;
    image?: string;

    platform?: string;
    source?: string;

    category?: string;
    country?: string;

    buy_price?: number;
    selling_price?: number;
    profit?: number;

    ai_score?: number;
    trend_score?: number;
    opportunity_score?: number;

    competition?: string;

    rating?: number;
    reviews?: number;
    sales?: number;

    is_amazon_choice?: boolean;
    is_best_seller?: boolean;

    success_probability?: number;
    trend_stage?: string;
    market_saturation?: string;
    ai_verdict?: string;
}

function asObject(value: unknown): Record<string, unknown> {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, unknown>;
  }

  return {};
}

function pickString(source: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed.length > 0) {
        return trimmed;
      }
    }
  }

  return undefined;
}

function parseNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const lower = value.toLowerCase();
    const match = lower.match(/-?\d+(?:\.\d+)?/);

    if (!match) {
      return undefined;
    }

    let parsed = Number(match[0]);
    if (!Number.isFinite(parsed)) {
      return undefined;
    }

    if (lower.includes("k")) {
      parsed *= 1000;
    } else if (lower.includes("m")) {
      parsed *= 1000000;
    }

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
}

function parseBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }

  return undefined;
}

function hashAsinToNumber(asin?: string): number | undefined {
  if (!asin) {
    return undefined;
  }

  let hash = 0;
  for (let index = 0; index < asin.length; index += 1) {
    hash = (hash << 5) - hash + asin.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
}

function pickNested(obj: Record<string, unknown>, path: string[]): unknown {
  let current: unknown = obj;

  for (const part of path) {
    if (typeof current !== "object" || current === null) {
      return undefined;
    }

    current = (current as Record<string, unknown>)[part];
  }

  return current;
}

function pickNestedNumber(obj: Record<string, unknown>, paths: string[][]): number | undefined {
  for (const path of paths) {
    const value = pickNested(obj, path);
    const parsed = parseNumber(value);

    if (parsed !== undefined) {
      return parsed;
    }
  }

  return undefined;
}

function pickNestedString(obj: Record<string, unknown>, paths: string[][]): string | undefined {
  for (const path of paths) {
    const value = pickNested(obj, path);

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed.length > 0) {
        return trimmed;
      }
    }
  }

  return undefined;
}

function inferCategory(obj: Record<string, unknown>): string | undefined {
  const direct = pickString(obj, ["category", "department", "segment", "productCategory"]);
  if (direct) {
    return direct;
  }

  const categories = obj["categories"];
  if (Array.isArray(categories) && categories.length > 0) {
    const first = categories[0];
    if (typeof first === "string" && first.trim().length > 0) {
      return first.trim();
    }

    const firstObj = asObject(first);
    const name = pickString(firstObj, ["name", "category", "title"]);
    if (name) {
      return name;
    }
  }

  return undefined;
}

function normalizeTitle(rawTitle: string): string {
  const cleaned = rawTitle
    .replace(/^[\s\u200B\u200C\u200D\uFEFF]+/, "")
    .replace(/^(sponsored\s*[:\-]?\s*)/i, "")
    .replace(/^(amazon(?:\.com)?\s*[:\-]\s*)/i, "")
    .replace(/^\[[^\]]*\]\s*/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  return cleaned.length > 0 ? cleaned : rawTitle.trim();
}

function computeDerivedAiScore(
  ratingValue: number | undefined,
  ratingVotes: number | undefined,
  isAmazonChoice: boolean,
  isBestSeller: boolean
): number {
  const ratingSignal =
    ratingValue !== undefined
      ? Math.min(99, Math.max(0, (ratingValue / 5) * 72))
      : 45;
  const votesSignal =
    ratingVotes !== undefined
      ? Math.min(22, Math.log10(Math.max(1, ratingVotes)) * 6.2)
      : 0;
  const badgeSignal = (isAmazonChoice ? 7 : 0) + (isBestSeller ? 9 : 0);

  return Math.round(Math.min(99, ratingSignal + votesSignal + badgeSignal));
}

function computeDerivedTrendScore(
  sales: number | undefined,
  ratingVotes: number | undefined,
  isBestSeller: boolean
): number {
  const salesSignal =
    sales !== undefined ? Math.min(58, Math.log10(Math.max(1, sales)) * 20) : 20;
  const votesSignal =
    ratingVotes !== undefined ? Math.min(30, Math.log10(Math.max(1, ratingVotes)) * 8.5) : 8;
  const badgeSignal = isBestSeller ? 10 : 0;

  return Math.round(Math.min(99, 18 + salesSignal + votesSignal + badgeSignal));
}

function computeDerivedOpportunityScore(
  aiScore: number,
  trendScore: number,
  sellingPrice: number | undefined,
  ratingVotes: number | undefined,
  isAmazonChoice: boolean,
  isBestSeller: boolean
): number {
  const priceSignal =
    sellingPrice !== undefined
      ? Math.min(14, Math.max(0, (120 - Math.min(120, sellingPrice)) / 8.5))
      : 5;
  const voteSignal =
    ratingVotes !== undefined ? Math.min(12, Math.log10(Math.max(1, ratingVotes)) * 3.3) : 3;
  const badgeSignal = (isAmazonChoice ? 3 : 0) + (isBestSeller ? 5 : 0);

  return Math.round(
    Math.min(99, aiScore * 0.44 + trendScore * 0.42 + priceSignal + voteSignal + badgeSignal)
  );
}

function inferTrendStage(
  sales: number | undefined,
  isBestSeller: boolean,
  ratingVotes: number | undefined,
  deliveryInfo: string | undefined
): string | undefined {
  if (isBestSeller || (sales !== undefined && sales >= 3000)) {
    return "Growing";
  }

  if (deliveryInfo && /overnight|same day|today/i.test(deliveryInfo)) {
    return "Growing";
  }

  if (ratingVotes !== undefined && ratingVotes >= 1200) {
    return "Stable";
  }

  return undefined;
}

function pickNumber(source: Record<string, unknown>, keys: string[]): number | undefined {
  for (const key of keys) {
    const parsed = parseNumber(source[key]);
    if (parsed !== undefined) {
      return parsed;
    }
  }

  return undefined;
}

function normalizeOne(raw: unknown, index: number): DiscoveredProductInput {
  const obj = asObject(raw);

  const asin = pickString(obj, ["asin", "ASIN", "data_asin"]);
  const idFromAsin = hashAsinToNumber(asin);
  const sourceUrl = pickString(obj, ["url", "source_url", "product_url", "link"]);

  const rawName =
    pickString(obj, ["title", "name", "productTitle", "product_name", "product"]) ||
    `Discovered Product ${index + 1}`;
  const name = normalizeTitle(rawName);

  const blockedBrands = [
  "Apple",
  "Samsung",
  "Sony",
  "LG",
  "Ninja",
  "Philips",
  "Bosch",
  "Dyson",
  "KitchenAid",
  "Dell",
  "HP",
  "Lenovo",
  "Canon",
  "Epson",
  "Microsoft",
  "Logitech",
  "Bose",
  "JBL",
];

if (
  blockedBrands.some((brand) =>
    name.toLowerCase().startsWith(brand.toLowerCase())
  )
) {
  return null as any;
}

  const image = pickString(obj, [
    "image_url",
    "image",
    "imageUrl",
    "image_url",
    "thumbnail",
    "thumbnailUrl",
    "mainImage",
    "main_image",
  ]);

  const platform = "Amazon";

  const category = inferCategory(obj) || "General";

  const countryFromRaw = pickString(obj, ["country", "market", "region", "countryCode"]);

  const sellingPrice =
    pickNestedNumber(obj, [["price", "current"], ["price", "value"], ["price", "current_price"]]) ??
    pickNumber(obj, [
      "price_from",
      "price_to",
      "selling_price",
      "sellingPrice",
      "price",
      "salePrice",
      "currentPrice",
      "offerPrice",
    ]);

  let buyPrice = pickNumber(obj, [
  "buy_price",
  "buyPrice",
  "cost",
  "costPrice",
  "wholesalePrice",
]);

// Estimate supplier cost if missing
if (
  buyPrice === undefined &&
  sellingPrice !== undefined
) {
  if (sellingPrice < 20) {
    buyPrice = sellingPrice * 0.55;
  } else if (sellingPrice < 50) {
    buyPrice = sellingPrice * 0.45;
  } else {
    buyPrice = sellingPrice * 0.35;
  }

  buyPrice = Number(buyPrice.toFixed(2));
}


let profit = pickNumber(obj, [
  "profit",
  "estimated_profit",
  "estimatedProfit",
]);

if (
  profit === undefined &&
  buyPrice !== undefined &&
  sellingPrice !== undefined
) {
  profit = Number(
    (sellingPrice - buyPrice).toFixed(2)
  );
}
  (sellingPrice && buyPrice
    ? Math.round(sellingPrice - buyPrice)
    : 0);

  const ratingValue =
    pickNestedNumber(obj, [["rating", "value"], ["rating", "rating_value"], ["rating", "average"]]) ??
    pickNumber(obj, ["rating", "stars"]);
  const ratingVotes =
    pickNestedNumber(obj, [["rating", "votes_count"], ["rating", "votesCount"], ["rating", "rating_count"]]) ??
    pickNumber(obj, ["reviews", "reviewCount", "ratingCount"]);

  const salesFromBoughtPastMonth = pickNumber(obj, ["bought_past_month"]);

  const priceCurrency =
    pickNestedString(obj, [["price", "currency"]]) ??
    pickString(obj, ["currency", "price_currency"]);

  const country =
    countryFromRaw ??
    (priceCurrency === "USD" ? "US" : undefined);

  const isAmazonChoice = parseBoolean(obj["is_amazon_choice"]) ?? false;
  const isBestSeller = parseBoolean(obj["is_best_seller"]) ?? false;
  const deliveryInfo = pickString(obj, ["delivery_info"]);

  const scores = calculateScores({
    sellingPrice,
    buyPrice,
    profit,

    rating: ratingValue,
    reviews: ratingVotes,
    sales: salesFromBoughtPastMonth,

    isAmazonChoice,
    isBestSeller,
});

  const successProbability =
    ratingValue !== undefined ? Math.min(99, Math.max(0, ratingValue * 20)) : undefined;

  const aiVerdict =
    scores.aiScore >= 90
      ? "Excellent Opportunity"
      : scores.aiScore >= 80
      ? "Strong Buy"
      : scores.aiScore >= 70
      ? "Worth Testing"
      : "High Risk";

  const normalizedId =
    pickNumber(obj, ["id", "productId", "product_id"]) ??
    idFromAsin;

  return {
    id: normalizedId,
    name,
    image,
    platform,
    source: sourceUrl,
    category,
    country,
    buy_price: buyPrice,
    selling_price: sellingPrice,
    profit,
    rating: ratingValue,
  
is_amazon_choice: isAmazonChoice,

is_best_seller: isBestSeller,
    trend_score:
      pickNumber(obj, ["trend_score", "trendScore", "trend"]) ??
      scores.trendScore,
    opportunity_score:
      pickNumber(obj, ["opportunity_score", "opportunityScore", "score"]) ??
      scores.opportunityScore,
   ai_score:
    pickNumber(obj, ["ai_score", "aiScore"]) ??
    scores.aiScore,
    reviews: ratingVotes,
    sales:
      pickNumber(obj, ["sales", "orders", "sold", "monthlySales"]) ??
      salesFromBoughtPastMonth,
    competition:
    pickString(obj, ["competition", "saturation", "market_saturation"]) ??
    scores.competition,
    success_probability:
    pickNumber(obj, ["success_probability", "successProbability"]) ??
    scores.successProbability,
    ai_verdict: aiVerdict,
    trend_stage:
      pickString(obj, ["trend_stage", "trendStage"]) ??
      inferTrendStage(
        salesFromBoughtPastMonth,
        isBestSeller,
        ratingVotes,
        deliveryInfo
      ),
    market_saturation:
    pickString(obj, ["market_saturation", "marketSaturation"]) ??
    scores.marketSaturation,
  };
}

export function normalizeDiscoverProducts(
  raw: unknown
): DiscoveredProductInput[] {
  // Old Apify support
  if (Array.isArray(raw)) {
    return raw.map((item, index) => normalizeOne(item, index));
  }

  const obj = asObject(raw);

  const tasks = Array.isArray(obj.tasks) ? obj.tasks : [];

  const items: unknown[] = [];

  for (const task of tasks) {
    const taskObj = asObject(task);

    const result = Array.isArray(taskObj.result)
      ? taskObj.result
      : [];

    for (const page of result) {
      const pageObj = asObject(page);

      const pageItems = Array.isArray(pageObj.items)
        ? pageObj.items
        : [];

      items.push(...pageItems);
    }
  }

  return items
  .map((item, index) => normalizeOne(item, index))
  .filter(
    (item): item is DiscoveredProductInput => item !== null
  );
}
