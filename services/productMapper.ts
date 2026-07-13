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
        // Identity
        id: Number(product.productId ?? Date.now()),
        source: "AliExpress",
        platform: "AliExpress",
      
        // Basic Info
        name: product.title ?? "Unknown Product",
        description: product.title ?? "",
        image: product.imageUrl ?? "",
        category: product.categoryName ?? "General",
        brand: product.brandName ?? "",
      
        // Links
        product_url: product.productUrl ?? "",
        supplier: "AliExpress",
        supplier_url: product.storeUrl ?? "",
      
        // Store
        store_name: product.storeName ?? "",
        store_rating: Number(product.storeRating ?? 0),
        supplier_rating: Number(product.storeRating ?? 0),
      
        // Pricing
        currency: "USD",
        buy_price: price,
        selling_price: Math.round(price * 2.5 * 100) / 100,
        profit: Math.round(price * 1.5 * 100) / 100,
        roi: price > 0 ? Math.round(((price * 1.5) / price) * 100) : 0,
      
        // Market
        sales: sold,
        orders: sold,
        reviews: Number(product.reviewsCount ?? 0),
        country: "Global",
      
        // Shipping
        shipping_days: 10,
      
        // AI
        ai_score: aiScore,
        trend_score: trendScore,
        opportunity_score:
  aiScore * 0.4 +
  trendScore * 0.3 +
  Math.min(price * 2, 100) * 0.2 +
  (
    competition === "Low"
      ? 100
      : competition === "Medium"
      ? 70
      : 30
  ) * 0.1,
      
        // Competition
        competition,
        trend_direction: "Stable",
        seasonality: "Evergreen",
      
        // Ads
        cpm: 0,
        cpa: 0,
      
        // AI Reason
        ai_reason: "",
      };
    }