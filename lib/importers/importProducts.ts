import { supabase } from "../supabase";
import type { ProductLike } from "../../types/Product";

export async function importProducts(products: ProductLike[]) {
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
      return false;
    }
  }

  return true;
}