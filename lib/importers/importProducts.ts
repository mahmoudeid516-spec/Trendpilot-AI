import { supabase } from "../supabase";

export async function importProducts(products: any[]) {
  if (!products.length) return true;

  const cleanProducts = products.map((product) => ({
    id: Number(product.id),

    source: product.source,
    platform: product.platform,

    name: product.name,
    description: product.description || "",
    image: product.image || "",

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
    orders: Number(product.orders || 0),
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

    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from("products")
    .upsert(cleanProducts, {
      onConflict: "product_url",
    });

  if (error) {
    console.error("IMPORT ERROR:", error);
    return false;
  }

  console.log(
    `✅ ${cleanProducts.length} products imported successfully`
  );

  return true;
}