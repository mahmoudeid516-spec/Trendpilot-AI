import { createHash } from "crypto";
import type { Product } from "../../types/Product";
import { buildStableProductId, ensureUniqueProductIds } from "./productIdentity";
import { scoreProduct } from "../scoring/opportunityScore";

/**
 * Real AliExpress Open Platform integration using the official Affiliate
 * API method aliexpress.affiliate.product.query, called through the
 * shared Alibaba Open Platform (TOP) gateway that fronts the whole
 * Taobao/Tmall/AliExpress/1688 API family.
 *
 * Sourcing note: this sandbox cannot reach AliExpress's own documentation
 * domains (openservice.aliexpress.com, developers.aliexpress.com) or
 * web.archive.org -- every direct fetch attempt is blocked by the network
 * egress proxy. The endpoint, signing algorithm, and parameter/response
 * field names below were reconstructed from (a) the user's own screenshots
 * of the official docs, and (b) two independently corroborating official
 * Alibaba-domain sources surfaced via web search -- developer.alibaba.com's
 * "How to Invoke API" guide (the platform-wide TOP signing spec) and
 * open.alitrip.com/docs/api.htm?apiId=45803 (the specific reference page
 * for this method, including a documented example request). This is a
 * meaningfully corroborated implementation, not a guess -- but it has not
 * been exercised against a live account from this environment, and should
 * be verified against a real response the first time real credentials are
 * available (see searchAliExpressProducts's doc comment for exactly what
 * to check).
 */

// ---------------------------------------------------------------------------
// Credentials
// ---------------------------------------------------------------------------

export type AliExpressCredentials = {
  appKey: string;
  appSecret: string;
  /** Affiliate tracking ID -- required by some account configurations for
   * aliexpress.affiliate.* methods, optional for others. Only sent when set. */
  trackingId?: string;
};

export function getAliExpressCredentials(): AliExpressCredentials {
  const appKey = process.env.ALIEXPRESS_APP_KEY;
  const appSecret = process.env.ALIEXPRESS_APP_SECRET;
  const trackingId = process.env.ALIEXPRESS_TRACKING_ID;

  if (!appKey || !appSecret) {
    throw new Error(
      "AliExpress integration is not configured. Set ALIEXPRESS_APP_KEY and ALIEXPRESS_APP_SECRET " +
        "(AliExpress Open Platform / Affiliate API credentials) to enable AliExpress product search."
    );
  }

  return { appKey, appSecret, trackingId: trackingId || undefined };
}

// ---------------------------------------------------------------------------
// Gateway + request signing
// ---------------------------------------------------------------------------

const GATEWAY_URL = "https://api.taobao.com/router/rest";
const METHOD = "aliexpress.affiliate.product.query";
const API_VERSION = "2.0";
const MAX_PAGE_SIZE = 50;

// TOP's documented timestamp format is "yyyy-MM-dd HH:mm:ss" in the
// platform's own timezone (China Standard Time, UTC+8), with a 10-minute
// tolerance window for clock drift.
function formatTimestamp(date: Date): string {
  const cst = new Date(date.getTime() + 8 * 60 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${cst.getUTCFullYear()}-${pad(cst.getUTCMonth() + 1)}-${pad(cst.getUTCDate())} ` +
    `${pad(cst.getUTCHours())}:${pad(cst.getUTCMinutes())}:${pad(cst.getUTCSeconds())}`
  );
}

// Alibaba Open Platform (TOP) standard request signing -- shared across the
// whole gateway this endpoint belongs to, documented in Alibaba's own "How
// to Invoke API" guide:
//   1. sort every parameter name (system params + business params,
//      excluding `sign` itself) ascending by ASCII value
//   2. concatenate name+value pairs back to back with no separators
//   3. wrap the result with the app secret on both ends
//   4. MD5, hex-encoded, uppercase
function signParams(params: Record<string, string>, appSecret: string): string {
  const sortedKeys = Object.keys(params).sort();
  const concatenated = sortedKeys.map((key) => `${key}${params[key]}`).join("");
  const base = `${appSecret}${concatenated}${appSecret}`;
  return createHash("md5").update(base, "utf8").digest("hex").toUpperCase();
}

// ---------------------------------------------------------------------------
// Response shape
// ---------------------------------------------------------------------------

type AliExpressProductRaw = {
  product_id?: number | string;
  product_title?: string;
  subject?: string;
  product_main_image_url?: string;
  product_detail_url?: string;
  promotion_link?: string;
  shop_url?: string;
  shop_id?: number | string;
  target_sale_price?: string | number;
  target_sale_price_currency?: string;
  target_app_sale_price?: string | number;
  target_app_sale_price_currency?: string;
  evaluate_rate?: string | number;
  lastest_volume?: number;
  first_level_category_name?: string;
};

type AliExpressProductContainer = { product?: AliExpressProductRaw[] } | AliExpressProductRaw[] | undefined;

type AliExpressQueryResponse = {
  error_response?: { code?: string | number; msg?: string; sub_code?: string; sub_msg?: string };
  resp_result?: {
    resp_code?: number;
    resp_msg?: string;
    result?: {
      total_record_count?: number;
      products?: AliExpressProductContainer;
    };
    // Some documented examples show the array one level shallower than
    // `result.products.product`. Both shapes are handled defensively in
    // extractProductList since the exact nesting was not independently
    // confirmed against a live response from this environment.
    products?: AliExpressProductContainer;
  };
};

function extractProductList(body: AliExpressQueryResponse): AliExpressProductRaw[] {
  const container = body.resp_result?.result?.products ?? body.resp_result?.products;

  if (!container) return [];
  if (Array.isArray(container)) return container;
  if (Array.isArray(container.product)) return container.product;

  return [];
}

function asNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

// ---------------------------------------------------------------------------
// Search filters (accepted here so the capability is real and ready;
// app/api/product-search/start/route.ts currently calls this with no
// filters because the search UI has no corresponding controls yet -- see
// SearchControls.tsx. Adding those controls is a separate, UI-scoped
// change, not required to make this integration real.)
// ---------------------------------------------------------------------------

export type AliExpressSearchFilters = {
  minSalePrice?: number;
  maxSalePrice?: number;
  platformProductType?: string;
  sort?: string;
  targetCurrency?: string;
  targetLanguage?: string;
  shipToCountry?: string;
};

async function fetchAliExpressPage(
  keyword: string,
  pageNo: number,
  pageSize: number,
  filters: AliExpressSearchFilters,
  credentials: AliExpressCredentials
): Promise<AliExpressProductRaw[]> {
  const { appKey, appSecret, trackingId } = credentials;

  const businessParams: Record<string, string> = {
    keywords: keyword,
    page_no: String(pageNo),
    page_size: String(Math.min(MAX_PAGE_SIZE, Math.max(1, pageSize))),
    fields:
      "product_id,product_title,product_main_image_url,product_detail_url,promotion_link," +
      "shop_url,shop_id,target_sale_price,target_sale_price_currency,target_app_sale_price," +
      "target_app_sale_price_currency,evaluate_rate,lastest_volume,first_level_category_name",
  };

  if (filters.minSalePrice != null) businessParams.min_sale_price = String(filters.minSalePrice);
  if (filters.maxSalePrice != null) businessParams.max_sale_price = String(filters.maxSalePrice);
  if (filters.platformProductType) businessParams.platform_product_type = filters.platformProductType;
  if (filters.sort) businessParams.sort = filters.sort;
  if (filters.targetCurrency) businessParams.target_currency = filters.targetCurrency;
  if (filters.targetLanguage) businessParams.target_language = filters.targetLanguage;
  if (filters.shipToCountry) businessParams.ship_to_country = filters.shipToCountry;
  if (trackingId) businessParams.tracking_id = trackingId;

  const systemParams: Record<string, string> = {
    method: METHOD,
    app_key: appKey,
    timestamp: formatTimestamp(new Date()),
    v: API_VERSION,
    sign_method: "md5",
    format: "json",
  };

  const allParams = { ...systemParams, ...businessParams };
  const sign = signParams(allParams, appSecret);

  const requestBody = new URLSearchParams({ ...allParams, sign });

  console.log("[aliexpress] search_start", { keyword, pageNo, pageSize });

  const response = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
    body: requestBody.toString(),
  });

  if (!response.ok) {
    const rawBody = await response.text().catch(() => "");
    throw new Error(
      `AliExpress API request failed: HTTP ${response.status}` +
        (rawBody ? ` — ${rawBody.slice(0, 200).trim().replace(/\s+/g, " ")}` : "")
    );
  }

  const data: AliExpressQueryResponse = await response.json();

  if (data.error_response) {
    const { code, msg, sub_msg } = data.error_response;
    throw new Error(`AliExpress API error ${code ?? ""}: ${sub_msg || msg || "Unknown error"}`.trim());
  }

  const products = extractProductList(data);

  if (products.length === 0 && pageNo === 1) {
    // Not necessarily a bug -- could be a genuine zero-match keyword -- but
    // logged so a real unexpected-shape response (the one real risk of the
    // nesting not being independently confirmed) is diagnosable from server
    // logs rather than silently read as "no results".
    console.log("[aliexpress] page_1_empty_result", {
      hasRespResult: Boolean(data.resp_result),
      respCode: data.resp_result?.resp_code,
    });
  }

  console.log("[aliexpress] search_page_complete", { pageNo, rawItemCount: products.length });

  return products;
}

// ---------------------------------------------------------------------------
// Normalization -- real fields only, same canonical scoring pipeline as
// Amazon (lib/scoring/opportunityScore.ts, unmodified).
// ---------------------------------------------------------------------------

function normalizeAliExpressProduct(item: AliExpressProductRaw): Product | null {
  const buyPrice = asNumber(item.target_sale_price ?? item.target_app_sale_price, NaN);
  if (!Number.isFinite(buyPrice) || buyPrice <= 0) return null;

  const title = String(item.product_title ?? item.subject ?? "").trim();
  const image = String(item.product_main_image_url ?? "").trim();
  const productUrl = String(item.product_detail_url ?? item.promotion_link ?? "").trim();

  if (!title || !image || !productUrl) return null;

  // The listing page is used as both product_url and supplier_url, exactly
  // mirroring how Amazon's own normalizer already treats its listing URL --
  // for AliExpress this is the real page a supplier would be found at, not
  // a shortcut. shop_url is preferred when the API actually returns one.
  const supplierUrl = String(item.shop_url ?? productUrl).trim();

  const currency = String(
    item.target_sale_price_currency ?? item.target_app_sale_price_currency ?? "USD"
  );

  // evaluate_rate's exact scale (percentage vs. a 1-5 star value) was not
  // confirmed against a live response, so it is surfaced for display only
  // (store_rating/supplier_rating) and deliberately NOT fed into
  // ai_score/trend_score/viral_score -- those formulas' constants assume
  // Amazon's specific 0-5 scale, and reusing them against an unverified
  // scale would silently distort the score, which this integration must
  // not do.
  const hasRating = item.evaluate_rate != null;
  const rating = hasRating ? asNumber(item.evaluate_rate, 0) : undefined;

  // lastest_volume, when present, is AliExpress's own real recent-orders
  // figure -- not an estimate. This is used directly, unlike Amazon's
  // normalizer, which has to *estimate* sales from review count because no
  // real sales figure exists in that API.
  const hasVolume = item.lastest_volume != null;
  const sales = hasVolume ? Math.max(0, Math.round(asNumber(item.lastest_volume, 0))) : 0;

  // Same bucketing pattern already used for Amazon (normalizeCompetition in
  // dataforseoProductSearch.ts), applied to AliExpress's own real volume
  // signal instead of Amazon's review count. Product.competition has no
  // "unknown" value, so with no real volume signal at all this defaults to
  // a neutral "Medium" rather than guessing.
  const competition: Product["competition"] = !hasVolume
    ? "Medium"
    : sales > 1000
      ? "High"
      : sales > 250
        ? "Medium"
        : "Low";

  const riskScore = competition === "High" ? 80 : competition === "Medium" ? 45 : 20;
  const demandScore = hasVolume ? Math.min(100, Math.round(sales / 20)) : 0;

  // No confirmed-real AliExpress input feeds these three -- left at 0
  // rather than reusing Amazon's rating-based formula against evaluate_rate's
  // unconfirmed scale (see note above). This is the honest "leave
  // unknown/zero" behavior the scoring pipeline expects for a missing input.
  const aiScore = 0;
  const trendScore = 0;
  const viralScore = 0;

  // Same resale-markup convention already used for Amazon in this same
  // pipeline -- TrendPilot models every sourced product as something the
  // user would resell at a markup, not only Amazon-sourced ones.
  const sellingPrice = Number((buyPrice * 2.3).toFixed(2));
  const profit = Number((sellingPrice - buyPrice).toFixed(2));
  const roi = buyPrice > 0 ? Math.round((profit / buyPrice) * 100) : 0;

  const source: Product["source"] = "AliExpress";
  const shopLabel = item.shop_id != null ? `AliExpress Shop ${item.shop_id}` : "AliExpress";

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

  const category = String(item.first_level_category_name ?? "General").trim() || "General";

  const product: Product = {
    id: buildStableProductId({
      id: item.product_id != null ? String(item.product_id) : undefined,
      name: title,
      platform: source,
      product_url: productUrl,
      supplier_url: supplierUrl,
      category,
      buy_price: buyPrice,
      selling_price: sellingPrice,
    }),
    source,
    platform: source,
    name: title,
    description: title,
    image,
    category,
    product_url: productUrl,
    supplier: shopLabel,
    supplier_url: supplierUrl,
    store_name: item.shop_id != null ? shopLabel : undefined,
    store_rating: rating,
    supplier_rating: rating,
    currency,
    buy_price: buyPrice,
    selling_price: sellingPrice,
    profit,
    roi,
    sales,
    orders: hasVolume ? sales : undefined,
    reviews: 0,
    country: "US",
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
  };

  return product;
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

/**
 * Searches real AliExpress products by keyword via
 * aliexpress.affiliate.product.query, paginating (page_size capped at the
 * documented maximum of 50) until `count` normalized products have been
 * collected or AliExpress runs out of results.
 *
 * FIRST-USE VERIFICATION CHECKLIST (do this the first time real
 * ALIEXPRESS_APP_KEY/ALIEXPRESS_APP_SECRET are configured, before trusting
 * this in production): confirm the response actually resolves at
 * resp_result.result.products.product (or adjust extractProductList if it
 * doesn't); confirm evaluate_rate's real scale before ever feeding it into
 * ai_score/trend_score; confirm lastest_volume is genuinely present before
 * relying on demand_score/competition for AliExpress products.
 */
export async function searchAliExpressProducts(
  keyword: string,
  count: number,
  filters: AliExpressSearchFilters = {}
): Promise<Product[]> {
  const credentials = getAliExpressCredentials();

  const collected: Product[] = [];
  let pageNo = 1;

  while (collected.length < count) {
    const remaining = count - collected.length;
    const pageSize = Math.min(MAX_PAGE_SIZE, remaining);

    const rawProducts = await fetchAliExpressPage(keyword, pageNo, pageSize, filters, credentials);

    if (rawProducts.length === 0) {
      break;
    }

    for (const raw of rawProducts) {
      const normalized = normalizeAliExpressProduct(raw);
      if (normalized) collected.push(normalized);
      if (collected.length >= count) break;
    }

    if (rawProducts.length < pageSize) {
      break;
    }

    pageNo += 1;
  }

  console.log("[aliexpress] search_complete", { keyword, requestedCount: count, returnedCount: collected.length });

  return ensureUniqueProductIds(collected.slice(0, count));
}
