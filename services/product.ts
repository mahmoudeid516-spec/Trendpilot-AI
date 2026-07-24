import { supabase } from "../lib/supabase";
import type { Product } from "../types/Product";

export async function getProduct(id: string | number): Promise<Product | null> {
  console.log("Searching Product:", id);

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", String(id)) // تحويل الـ id إلى string ليتوافق مع الـ Interface
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }

  console.log("Product data found:", data);

  // تحويل النتيجة لضمان وجود image_url وعدم حدوث مشاكل Types
  return {
    ...data,
    id: String(data.id),
    image_url: data.image_url ?? data.image ?? "",
  } as Product;
}