import type { Product } from "../types/Product";

/**
 * Maps the DataForSEO Amazon API response
 * to the internal Product model.
 */
export function mapApifyProduct(product: any): Product {
  const buyPrice = Number(product.price ?? 0);
  const sellingPrice = Number((buyPrice * 2.5).toFixed(2));
  const profit = Number((sellingPrice - buyPrice).toFixed(2));
  const roi = buyPrice > 0 ? Math.round((profit / buyPrice) * 100) : 0;

  const image =
    product.image ??
    product.image_url ??
    product.imageUrl ??
    "";

  return {
    // Identity
    id: String(product.asin ?? product.id ?? Date.now()),
    source: (product.marketplace ?? "Amazon") as
      | "Amazon"
      | "AliExpress"
      | "Shopify",
    platform: (product.marketplace ?? "Amazon") as
      | "Amazon"
      | "AliExpress"
      | "Shopify",

    // Product
    name: product.title ?? "Unknown Product",
    description: product.title ?? "",

    image,
    image_url: image,

    category: product.category ?? "General",
    brand: product.brand ?? "",

    // Links
    product_url: product.product_url ?? "",
    supplier: product.seller ?? "Amazon",
    supplier_url: product.product_url ?? "",

    // Store
    store_name: product.seller ?? "Amazon",
    store_rating: Number(product.rating ?? 0),
    supplier_rating: Number(product.rating ?? 0),

    // Pricing
    currency: product.currency ?? "USD",
    buy_price: buyPrice,
    selling_price: sellingPrice,
    profit,
    roi,

    // Market
    sales: Number(product.rank ?? 0),
    orders: Number(product.orders ?? product.sales ?? 0),
    reviews: Number(product.reviews_count ?? 0),
    review_count: Number(product.reviewCount ?? product.review_count ?? 0),
    rating: Number(product.rating ?? 4.5),
    country: "US",

    // Shipping
    shipping_days: 7,

    // AI
    ai_score: 0,
    trend_score: 0,
    viral_score: 0,
    opportunity_score: 0,
    demand_score: 0,
    confidence_score: 0,
    risk_score: 0,
    winning_probability: 0,

    decision: "Pending AI Analysis",
    ai_reason: "",

    // Competition
    competition: "Medium",
    trend_direction: "Stable",
    seasonality: "Evergreen",

    // Ads
    cpm: 0,
    cpa: 0,

    // UI
    is_ai_pick: false,
    is_trending: false,
    is_hidden_gem: false,

    updated_at: new Date().toISOString(),
  };
}