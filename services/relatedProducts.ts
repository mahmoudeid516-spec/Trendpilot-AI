import { supabase } from "../lib/supabase";
import { ensureUniqueProductIds } from "../lib/services/productIdentity";

export async function getRelatedProducts(
  category: string,
  currentId: string
) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .neq("id", currentId)
    .limit(4);

  if (error) {
    console.error(error);
    return [];
  }

  return ensureUniqueProductIds(data ?? []);
}