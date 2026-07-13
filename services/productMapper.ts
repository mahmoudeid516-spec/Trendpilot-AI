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

  const aiScore = Math.min(
    100,
    Math.round(rating * 20 + Math.min(sold / 20, 40))
  );

  const trendScore = Math.min(
    100,
    Math.round(rating * 20)
  );

  const competition =
    sold > 100
      ? "High"
      : sold > 30
      ? "Medium"
      : "Low";

  return {
    id: Number(product.productId ?? Date.now()),

    name: product.title ?? "Unknown Product",

    image: product.imageUrl ?? "",

    category: product.categoryName ?? "General",

    platform: "AliExpress",

    supplier: "AliExpress",

    supplier_url: product.storeUrl ?? "",

    product_url: product.productUrl ?? "",

    buy_price: price,

    selling_price: Math.round(price * 2.5 * 100) / 100,

    profit: Math.round(price * 1.5 * 100) / 100,

    sales: sold,

    reviews: Number(product.reviewsCount ?? 0),

    country: "Global",

    competition,

    ai_score: aiScore,

    trend_score: trendScore,

    description: product.title ?? "",

    opportunity_score:
      aiScore * 0.4 +
      trendScore * 0.3 +
      Math.min(price * 2, 100) * 0.2 +
      (competition === "Low"
        ? 100
        : competition === "Medium"
        ? 70
        : 30) *
        0.1,
  };
}