import { supabase } from "../lib/supabase";
import { normalizeProductId } from "../lib/services/productIdentity";

export async function getProduct(id: string) {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Failed loading product:", error.message);
  }

  return data ? normalizeProductId(data) : null;
}