import { supabase } from "../supabase";
import type { Product } from "../../types/Product";
import type { ProductDeepAnalysis } from "../../types/productAnalyzer";

export async function analyzeProductDeep(product: Product): Promise<ProductDeepAnalysis> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Please sign in to run an AI product analysis.");
  }

  const response = await fetch("/api/product-analysis/deep", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ product }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Failed to analyze product.");
  }

  return data.analysis as ProductDeepAnalysis;
}
