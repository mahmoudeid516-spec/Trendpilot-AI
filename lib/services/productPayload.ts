type ProductPayloadSource = {
  name?: unknown;
  image?: unknown;
  platform?: unknown;
  category?: unknown;
  supplier?: unknown;
  description?: unknown;
  buy_price?: unknown;
  selling_price?: unknown;
  profit?: unknown;
  sales?: unknown;
  reviews?: unknown;
  country?: unknown;
  ai_score?: unknown;
  trend_score?: unknown;
  ai_reason?: unknown;
  best_market?: unknown;
  seo_title?: unknown;
  seo_description?: unknown;
  tiktok_ad?: unknown;
  facebook_ad?: unknown;
  email_copy?: unknown;
  email_marketing?: unknown;
  launch_status?: unknown;
  success_probability?: unknown;
  trend_stage?: unknown;
  market_saturation?: unknown;
  difficulty?: unknown;
  marketing_json?: unknown;
  recommendation?: unknown;
  pros?: unknown;
  cons?: unknown;
  business_advisor?: unknown;
  instagram_caption?: unknown;
  cta?: unknown;
  viral_score?: unknown;
  opportunity_score?: unknown;
  roi?: unknown;
  supplier_url?: unknown;
  product_url?: unknown;
  competition?: unknown;
  asin?: unknown;
  amazon_choice?: unknown;
  best_seller?: unknown;
  delivery_info?: unknown;
  price_to?: unknown;
  currency?: unknown;
  store_rating?: unknown;
};

export const PRODUCT_INSERT_COLUMNS = [
  "name",
  "image",
  "platform",
  "category",
  "supplier",
  "supplier_url",
  "product_url",
  "buy_price",
  "selling_price",
  "profit",
  "sales",
  "reviews",
  "country",
  "competition",
  "ai_score",
  "trend_score",
  "description",
  "ai_reason",
  "best_market",
  "seo_title",
  "seo_description",
  "tiktok_ad",
  "facebook_ad",
  "email_copy",
  "launch_status",
  "success_probability",
  "trend_stage",
  "market_saturation",
  "difficulty",
  "marketing_json",
  "recommendation",
  "pros",
  "cons",
  "business_advisor",
  "instagram_caption",
  "cta",
  "viral_score",
  "opportunity_score",
  "roi",
  "asin",
  "amazon_choice",
  "best_seller",
  "delivery_info",
  "price_to",
  "currency",
  "store_rating",
] as const;

export type ProductInsertColumn = (typeof PRODUCT_INSERT_COLUMNS)[number];
export type ProductInsertPayload = Partial<Record<ProductInsertColumn, unknown>>;

const PRODUCT_INSERT_COLUMN_SET = new Set<string>(PRODUCT_INSERT_COLUMNS);

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function stripUndefinedValues(row: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(row).filter(([, value]) => value !== undefined)
  );
}

export function sanitizeProductInsertRow(row: Record<string, unknown>): ProductInsertPayload {
  return Object.fromEntries(
    Object.entries(row).filter(([key, value]) => (
      PRODUCT_INSERT_COLUMN_SET.has(key) && value !== undefined
    ))
  );
}

export function buildProductInsertPayload(product: ProductPayloadSource): ProductInsertPayload {
  const payload = stripUndefinedValues({
    name: asString(product.name),
    image: asString(product.image),
    platform: asString(product.platform),
    category: asString(product.category, "General"),
    supplier: asString(product.supplier),
    description: asString(product.description),
    buy_price: asNumber(product.buy_price),
    selling_price: asNumber(product.selling_price),
    profit: asNumber(product.profit),
    sales: asNumber(product.sales),
    reviews: asNumber(product.reviews),
    country: asString(product.country),
    ai_score: asNumber(product.ai_score),
    trend_score: asNumber(product.trend_score),
    ai_reason: asString(product.ai_reason),
    best_market: asString(product.best_market),
    seo_title: asString(product.seo_title),
    seo_description: asString(product.seo_description),
    tiktok_ad: asString(product.tiktok_ad),
    facebook_ad: asString(product.facebook_ad),
    email_copy: asString(product.email_copy ?? product.email_marketing),
    launch_status: asString(product.launch_status),
    success_probability: asNumber(product.success_probability),
    trend_stage: asString(product.trend_stage),
    market_saturation: asString(product.market_saturation),
    difficulty: asString(product.difficulty),
    marketing_json: product.marketing_json,
    recommendation: asString(product.recommendation),
    pros: product.pros,
    cons: product.cons,
    business_advisor: product.business_advisor,
    instagram_caption: asString(product.instagram_caption),
    cta: asString(product.cta),
    viral_score: asNumber(product.viral_score),
    opportunity_score: asNumber(product.opportunity_score),
    roi: asNumber(product.roi),
    supplier_url: asString(product.supplier_url),
    product_url: asString(product.product_url),
    competition: asString(product.competition, "Medium"),
    asin:
      typeof product.asin === "string" && product.asin.trim()
        ? product.asin
        : undefined,
    amazon_choice:
      typeof product.amazon_choice === "boolean"
        ? product.amazon_choice
        : undefined,
    best_seller:
      typeof product.best_seller === "boolean"
        ? product.best_seller
        : undefined,
    delivery_info:
      typeof product.delivery_info === "string" && product.delivery_info.trim()
        ? product.delivery_info
        : undefined,
    price_to:
      typeof product.price_to === "number" && Number.isFinite(product.price_to)
        ? product.price_to
        : undefined,
    currency:
      typeof product.currency === "string" && product.currency.trim()
        ? product.currency
        : undefined,
    store_rating:
      typeof product.store_rating === "number" &&
      Number.isFinite(product.store_rating) &&
      product.store_rating > 0
        ? product.store_rating
        : undefined,
  });

  return sanitizeProductInsertRow(payload);
}