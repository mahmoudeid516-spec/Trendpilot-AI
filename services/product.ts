import { supabase } from "../lib/supabase";
import { normalizeProductId } from "../lib/services/productIdentity";

export async function getProduct(id: string) {

  console.log("Searching Product:", id);

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  console.log("Product:", data);
  console.log("Error:", error);

  return data ? normalizeProductId(data) : null;
}