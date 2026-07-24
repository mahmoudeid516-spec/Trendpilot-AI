"use client";

import { useEffect, useState } from "react";
import ProductDetails from "./ProductDetails";
import { ensureUniqueProductIds, normalizeProductId } from "../../lib/services/productIdentity";
import { hasSupabaseConfig, supabase } from "../../lib/supabase";
import type { Product } from "../../types/Product";

type Props = {
  id: string;
};

export default function ProductPage({ id }: Props) {
  const isSupabaseConfigured = hasSupabaseConfig();
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProduct() {
      if (!isSupabaseConfigured) {
        setErrorMessage("Supabase is not configured.");
        setLoading(false);
        return;
      }

      const [productResponse, listResponse] = await Promise.all([
        supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single(),
        supabase
          .from("products")
          .select("*"),
      ]);

      if (productResponse.error) {
        setErrorMessage(productResponse.error.message);
      } else {
        setProduct(normalizeProductId(productResponse.data as Product));
      }

      if (!listResponse.error) {
        setAllProducts(ensureUniqueProductIds((listResponse.data ?? []) as Product[]));
      }

      setLoading(false);
    }

    void loadProduct();
  }, [id, isSupabaseConfigured]);

  if (loading) {
    return (
      <div className="p-10 text-2xl font-bold">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-10 text-red-500 text-2xl">
        {errorMessage || "Product not found."}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-10">
      <ProductDetails
        product={product}
        allProducts={allProducts}
      />
    </div>
  );
}