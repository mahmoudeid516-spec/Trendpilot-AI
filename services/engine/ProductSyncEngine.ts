import { supabase } from "../../lib/supabase";

export async function syncProducts(products: any[]) {
  if (!products.length) return;

  const { error } = await supabase
    .from("products")
    .upsert(products, {
      onConflict: "id",
    });

  if (error) {
    console.error(error);
    throw error;
  }

  return true;
}