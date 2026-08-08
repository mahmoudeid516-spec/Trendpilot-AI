import { supabase } from "../supabase";
import { buildProductInsertPayload } from "../services/productPayload";
import { insertWithCompatibility } from "../services/supabaseCompatibility";
import type { Product } from "../../types/Product";

export async function importProducts(products: Array<Product | Record<string, unknown>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("Failed to import products: no authenticated user.");
    return false;
  }

  for (const product of products) {
    const payload = buildProductInsertPayload({
      ...product,
      user_id: user.id,
    });

    try {
      const { data: existing } = await supabase
        .from("products")
        .select("id")
        .eq("user_id", user.id)
        .eq("name", payload.name)
        .eq("platform", payload.platform)
        .limit(1);

      if (existing && existing.length > 0) {
        continue;
      }

      const { error } = await insertWithCompatibility(
        supabase,
        "products",
        payload
      );

      if (error) {
        console.error("Failed to import product:", error);
        return false;
      }
    } catch (error) {
      console.error("Failed to import product:", error);
      return false;
    }
  }

  return true;
}