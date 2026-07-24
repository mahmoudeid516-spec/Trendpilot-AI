import { supabase } from "../supabase";
import { buildProductInsertPayload } from "./productPayload";
import { insertWithCompatibility } from "./supabaseCompatibility";

export async function saveProduct(product: Record<string, unknown>) {
  const dataToSave = buildProductInsertPayload(product);

  const { error } = await insertWithCompatibility(
    supabase,
    "products",
    dataToSave
  );

  if (error) {
    throw error;
  }

  return true;
}