import { supabase } from "../lib/supabase";
import type { Product } from "../types/Product";

export async function getRelatedProducts(
  category: string,
  currentId: string
): Promise<Product[]> {
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

  return (data ?? []) as Product[];
}