import { supabase } from "../supabase";

export async function saveProduct(product: any) {

  const dataToSave = {
    name: product.name,

    image: product.image,

    platform: product.platform,

    category: product.category,

    description: product.description,

    buy_price: Number(product.buy_price),

    selling_price: Number(product.selling_price),

    profit: Number(product.profit),

    ai_score: Number(product.ai_score),

    trend_score: Number(product.trend_score),

    supplier: product.supplier,

    supplier_url: product.supplier_url,

    product_url: product.product_url,

    competition: product.competition,

    country: product.country,

    recommendation: product.recommendation,

    pros: product.pros,

    cons: product.cons,

    success_probability:
      product.success_probability ?? 85,

    trend_stage:
      product.trend_stage ?? "Growing",

    market_saturation:
      product.market_saturation ?? "Medium",

    difficulty:
      product.difficulty ?? "Medium",

    marketing_json:
      product.marketing_json ?? {},
  };

  const { error } = await supabase
    .from("products")
    .insert([dataToSave]);

  if (error) {
    throw error;
  }

  return true;
}