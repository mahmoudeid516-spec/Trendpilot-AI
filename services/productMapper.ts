import type { Product } from "../types/Product";

export function mapApifyProduct(product: any): Product {
  const price =
    Number(product.priceCurrentMin) ||
    parseFloat(
      String(product.priceCurrent ?? "").replace(/[^\d.]/g, "")
    ) ||
    Number(product.priceOriginalMin) ||
    parseFloat(
      String(product.priceOriginal ?? "").replace(/[^\d.]/g, "")
    ) ||
    0;

  const rating = Number(product.ratingValue ?? 0);
  const sold = Number(product.soldCount ?? 0);
  const reviewCount = Number(product.reviewCount ?? 0);

  // AI Score
  const aiScore = Math.min(
    100,
    Math.round(rating * 20 + Math.min(sold / 20, 40))
  );

  // Trend Score
  const trendScore = Math.min(
    100,
    Math.round(rating * 20)
  );

  // Viral Score
  const viralScore = Math.min(
    100,
    Math.round(
      rating * 15 +
      Math.min(sold / 50, 40) +
      Math.min(reviewCount / 20, 20)
    )
  );

  // Competition
  const competition =
    sold > 100
      ? "High"
      : sold > 30
      ? "Medium"
      : "Low";

  // Selling Price
  const sellingPrice =
    Math.round(price * 2.8 * 100) / 100;

  // Profit
  const profit =
    Math.round((sellingPrice - price) * 100) / 100;

  // ROI
  const roi =
    price > 0
      ? Math.round((profit / price) * 100)
      : 0;

  // Opportunity Score
  const opportunityScore = Number(
    (
      aiScore * 0.35 +
      trendScore * 0.25 +
      Math.min(profit * 2, 100) * 0.20 +
      (competition === "Low"
        ? 100
        : competition === "Medium"
        ? 70
        : 30) * 0.10 +
      (price <= 30 ? 10 : 0)
    ).toFixed(1)
  );

  // Demand Score
  const demandScore = Math.min(
    100,
    Math.round(
      sold / 10 +
      reviewCount / 30 +
      rating * 15
    )
  );

  // Risk Score
  const riskScore =
    competition === "High"
      ? 80
      : competition === "Medium"
      ? 45
      : 15;

  // Confidence Score
  const confidenceScore = Math.min(
    100,
    Math.round(
      aiScore * 0.4 +
      trendScore * 0.3 +
      demandScore * 0.3
    )
  );

  // Winning Probability
  const winningProbability = Math.min(
    100,
    Math.round(
      opportunityScore * 0.5 +
      confidenceScore * 0.5
    )
  );

  // Decision
  const decision =
    opportunityScore >= 90
      ? "Strong Buy"
      : opportunityScore >= 75
      ? "Test First"
      : "Avoid";

  return {
    id: Number(product.productId ?? Date.now()),

    source: "AliExpress",
    platform: "AliExpress",

    name: product.title ?? "Unknown Product",
    description: product.title ?? "",
    image: product.imageUrl ?? "",

    category: product.categoryName ?? "General",
    brand: product.brandName ?? "",

    product_url: product.productUrl ?? "",

    supplier: "AliExpress",
    supplier_url: product.storeUrl ?? "",

    store_name: product.storeName ?? "",

    store_rating: Number(product.storeRating ?? 0),
    supplier_rating: Number(product.storeRating ?? 0),

    currency: "USD",

    buy_price: price,
    selling_price: sellingPrice,
    profit,
    roi,

    sales: sold,
    orders: sold,
    reviews: reviewCount,

    country: "Global",

    shipping_days: 10,

    ai_score: aiScore,
    trend_score: trendScore,
    viral_score: viralScore,
    opportunity_score: opportunityScore,

    competition,

    trend_direction: "Stable",
    seasonality: "Evergreen",

    cpm: 0,
    cpa: 0,

    ai_reason: "",

    decision,

    demand_score: demandScore,
    risk_score: riskScore,
    confidence_score: confidenceScore,
    winning_probability: winningProbability,
  };
}