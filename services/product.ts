import { supabase } from "../lib/supabase";
import { normalizeProductId } from "../lib/services/productIdentity";

export async function getProduct(id: string) {

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Failed loading product:", error.message);
  }

  return data ? normalizeProductId(data) : null;
}