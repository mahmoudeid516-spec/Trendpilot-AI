import { supabase } from "../supabase";
import { buildProductInsertPayload } from "./productPayload";
import { insertWithCompatibility } from "./supabaseCompatibility";

export async function saveProduct(product: Record<string, unknown>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in to save a product.");
  }

  const dataToSave = buildProductInsertPayload({
    ...product,
    user_id: user.id,
  });

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