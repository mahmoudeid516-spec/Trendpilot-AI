import { supabase } from "../lib/supabase";

export async function getProduct(id: number) {

  console.log("Searching Product:", id);

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  console.log("Product:", data);
  console.log("Error:", error);

  return data;
}