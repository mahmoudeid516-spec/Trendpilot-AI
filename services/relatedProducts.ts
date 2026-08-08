import { supabase } from "../lib/supabase";
import { ensureUniqueProductIds } from "../lib/services/productIdentity";

export async function getRelatedProducts(
  category: string,
  currentId: string
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", user.id)
    .eq("category", category)
    .neq("id", currentId)
    .limit(4);

  if (error) {
    console.error(error);
    return [];
  }

  return ensureUniqueProductIds(data ?? []);
}