// services/providers/aliexpress.ts

import type { Product } from "../../types/Product";

export async function searchAliExpress(
  query: string
): Promise<Product[]> {
  try {
    const response = await fetch(
      `/api/aliexpress?q=${encodeURIComponent(query)}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const json = await response.json();

    if (!json.success || !Array.isArray(json.products)) {
      console.error("Invalid API response:", json);
      return [];
    }

    return json.products.map((item: any): Product => {
      const buyPrice = Number(item.price ?? 0);
      const sellingPrice = Number((buyPrice * 2.5).toFixed(2));
      const profit = Number((sellingPrice - buyPrice).toFixed(2));
      const roi = buyPrice > 0 ? Math.round((profit / buyPrice) * 100) : 0;

      const rating = Number(item.rating ?? 4.5);
      const reviewCount = Number(
        item.reviewCount ?? item.review_count ?? 0
      );
      const orders = Number(item.orders ?? item.sales ?? 0);

      const aiScore = Math.min(100, Math.round(rating * 20));

      return {
        // Identity
        id: String(item.id ?? Date.now()),
        source: (item.marketplace ?? "Amazon") as
          | "Amazon"
          | "AliExpress"
          | "Shopify",
        platform: (item.marketplace ?? "Amazon") as
          | "Amazon"
          | "AliExpress"
          | "Shopify",

        // Basic
        name: item.title ?? "Unknown Product",
        description: item.description ?? item.title ?? "",

        // ✅ الحل
        image_url: item.image ?? "",
        image: item.image ?? "",

        category: item.category ?? "General",
        brand: item.brand ?? "",

        // Links
        product_url: item.product_url ?? "",
        supplier: item.seller ?? "Amazon",
        supplier_url: item.product_url ?? "",

        // Store
        store_name: item.seller ?? "Amazon",
        store_rating: Number(item.rating ?? 5),
        supplier_rating: Number(item.rating ?? 5),

        // Pricing
        currency: item.currency ?? "USD",
        buy_price: buyPrice,
        selling_price: sellingPrice,
        profit,
        roi,

        // Market
        sales: orders,
        orders,
        reviews: reviewCount,
        review_count: reviewCount,
        rating,
        country: "US",

        // Shipping
        shipping_days: 3,

        // AI
        ai_score: aiScore,
        trend_score: Math.max(aiScore - 5, 0),
        viral_score: Math.max(aiScore - 10, 0),
        opportunity_score: Math.min(100, aiScore + 5),
        demand_score: orders,
        confidence_score: aiScore,
        risk_score: orders > 1000 ? 20 : orders > 100 ? 40 : 60,
        winning_probability: aiScore,

        decision:
          aiScore >= 90
            ? "Strong Buy"
            : aiScore >= 75
            ? "Test First"
            : "Avoid",

        ai_reason: "High demand product with strong sales potential.",

        // Competition
        competition:
          orders > 1000
            ? "High"
            : orders > 100
            ? "Medium"
            : "Low",

        trend_direction: "Rising",
        seasonality: "Evergreen",

        // Ads
        cpm: 12,
        cpa: 4,

        // UI
        is_ai_pick: aiScore >= 90,
        is_trending: aiScore >= 80,
        is_hidden_gem: orders < 100 && aiScore > 85,

        updated_at: new Date().toISOString(),
      };
    });
  } catch (err) {
    console.error("AliExpress Provider Error:", err);
    return [];
  }
}