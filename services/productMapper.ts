import type { Product } from "../types/Product";

export function mapApifyProduct(product: any): Product {
  // ==============================
  // Products القادمة من Supabase
  // ==============================

  if (product.name) {
    return {
      ...product,

      id: Number(product.id),

      source:
        product.platform === "Amazon"
          ? "Amazon"
          : product.platform === "Shopify"
          ? "Shopify"
          : "AliExpress",

      platform: product.platform || "AliExpress",

      name: product.name,
      description: product.description || "",

      image:
        product.image ||
        product.image_url ||
        "",

      category: product.category || "General",
      brand: product.brand || "",

      product_url: product.product_url || "",
      supplier: product.supplier || "AliExpress",
      supplier_url: product.supplier_url || "",

      store_name: product.store_name || "",
      store_rating: Number(product.store_rating || 0),
      supplier_rating: Number(product.supplier_rating || 0),

      currency: product.currency || "USD",

      buy_price: Number(product.buy_price || 0),
      selling_price: Number(product.selling_price || 0),

      profit: Number(product.profit || 0),
      roi: Number(product.roi || 0),

      sales: Number(product.sales || 0),
      orders: Number(product.orders || product.sales || 0),
      reviews: Number(product.reviews || 0),

      country: product.country || "Global",

      shipping_days: Number(product.shipping_days || 10),

      ai_score: Number(product.ai_score || 0),
      trend_score: Number(product.trend_score || 0),
      viral_score: Number(product.viral_score || 0),
      opportunity_score: Number(product.opportunity_score || 0),

      demand_score: Number(product.demand_score || 0),
      confidence_score: Number(product.confidence_score || 0),
      risk_score: Number(product.risk_score || 0),
      winning_probability: Number(product.winning_probability || 0),

      decision: product.decision || "Test First",

      ai_reason: product.ai_reason || "",

      competition: product.competition || "Medium",

      trend_direction: product.trend_direction || "Stable",

      seasonality: product.seasonality || "Evergreen",

      cpm: Number(product.cpm || 0),
      cpa: Number(product.cpa || 0),
    };
  }

  // ==============================
  // AliExpress API
  // ==============================

  const title =
    product.itemTitle ||
    product.title ||
    product.productTitle ||
    product.subject ||
    product.name ||
    "Unknown Product";

  const image =
    product.itemMainPic ||
    product.imageUrl ||
    product.image ||
    product.mainImage ||
    product.imageUrls?.[0] ||
    "";

  const price =
    Number(product.salePrice) ||
    Number(product.targetSalePrice) ||
    Number(product.originalPrice) ||
    Number(product.targetOriginalPrice) ||
    Number(product.sale_price) ||
    Number(product.sale_price_usd) ||
    Number(product.price) ||
    Number(product.priceMin) ||
    Number(product.priceMax) ||
    0;

  const sold =
    Number(product.orders) ||
    Number(product.trade) ||
    Number(product.tradeCount) ||
    Number(product.sales) ||
    Number(product.sold) ||
    0;

  const reviews =
    Number(product.reviewCount) ||
    Number(product.reviews) ||
    Number(product.feedbackCount) ||
    0;

  const rating =
    Number(product.evaluateRate) ||
    Number(product.evaluationRate) ||
    Number(product.rating) ||
    Number(product.score) ||
    0;

  const aiScore = Math.min(
    100,
    Math.round(
      rating * 20 +
      Math.min(sold / 20, 40)
    )
  );

  const trendScore = Math.min(
    100,
    Math.round(
      aiScore * 0.95
    )
  );

  const viralScore = Math.min(
    100,
    Math.round(
      aiScore * 0.90
    )
  );

  const opportunity = Math.min(
    100,
    Math.round(
      aiScore * 0.7 +
      Math.min(sold / 50, 30)
    )
  );

  console.log("====== RAW PRODUCT ======");
  console.log({
    title,
    price,
    sold,
    reviews,
    rating,
    raw: product,
  });

  return {
    id: Number(product.itemId || Date.now()),

    source: "AliExpress",

    platform: "AliExpress",

    name: title,

    description:
      product.description ||
      "",

    image,

    category:
      product.category ||
      "General",

    brand:
      product.brand ||
      "",

    product_url:
      product.itemUrl ||
      product.productUrl ||
      `https://www.aliexpress.com/item/${product.itemId}.html`,

    supplier: "AliExpress",

    supplier_url: "",

    store_name:
      product.storeName ||
      "",

    store_rating:
      Number(product.storeRating || 0),

    supplier_rating:
      Number(product.storeRating || 0),

    currency:
      product.currency ||
      "USD",

    buy_price: price,

    selling_price:
      Number((price * 2.5).toFixed(2)),

    profit:
      Number((price * 1.5).toFixed(2)),

    roi:
      price > 0
        ? 150
        : 0,

    sales: sold,

    orders: sold,

    reviews,

    country:
      product.shipTo ||
      "Global",

    shipping_days:
      Number(product.shippingDays || 10),

    ai_score: aiScore,

    trend_score: trendScore,

    viral_score: viralScore,

    opportunity_score: opportunity,

    demand_score: sold,

    confidence_score: aiScore,

    risk_score:
      sold > 500
        ? 20
        : sold > 100
        ? 40
        : 70,

    winning_probability: opportunity,

    decision:
      opportunity >= 85
        ? "Strong Buy"
        : opportunity >= 65
        ? "Test First"
        : "Avoid",

    ai_reason: "",

    competition:
      sold > 1000
        ? "High"
        : sold > 100
        ? "Medium"
        : "Low",

    trend_direction:
      "Stable",

    seasonality:
      "Evergreen",

    cpm: 0,

    cpa: 0,
  };
}