import { supabase } from "../lib/supabase";

export async function getProduct(id: number) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
}