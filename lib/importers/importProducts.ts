import { supabase } from "../supabase";

export async function importProducts(products: any[]) {
  for (const product of products) {
    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("name", product.name)
      .eq("platform", product.platform)
      .limit(1);

    if (existing && existing.length > 0) {
      continue;
    }

    const { error } = await supabase
      .from("products")
      .insert(product);

    if (error) {
      console.error(error);
      return false;
    }
  }

  return true;
}