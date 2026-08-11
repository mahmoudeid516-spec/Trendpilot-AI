import { supabase } from "../supabase";
import { buildProductInsertPayload } from "../services/productPayload";
import { insertWithCompatibility } from "../services/supabaseCompatibility";
import type { Product } from "../../types/Product";

export async function importProducts(products: Array<Product | Record<string, unknown>>) {
  for (const product of products) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return false;
  const userId = session.user.id;    const payload = buildProductInsertPayload({ ...product, user_id: userId });

    console.log("[importProducts] user_id:", userId, "payload.user_id:", payload.user_id);    try {
      const { data: existing } = await supabase
        .from("products")
        .select("id")
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
        console.error("Failed to import product:", JSON.stringify(error, null, 2));
        return false;
      }
    } catch (error) {
      console.error("Failed to import product:", JSON.stringify(error, null, 2));
      return false;
    }
  }

  return true;
}