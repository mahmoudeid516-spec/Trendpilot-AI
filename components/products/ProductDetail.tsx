"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hasSupabaseConfig, supabase } from "../../lib/supabase";
import { getProduct } from "../../services/product";
import { getRelatedProducts } from "../../services/relatedProducts";
import type { Product } from "../../types/Product";
import AIMarketing from "./AIMarketing";
import ProductHero from "./ProductHero";
import SupplierCard from "./SupplierCard";
import AIReport from "./AIReport";
import RelatedProducts from "./RelatedProducts";

type Props = {
  id: string;
};

export default function ProductDetail({ id }: Props) {
  const router = useRouter();
  const isSupabaseConfigured = hasSupabaseConfig();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      const productData = (await getProduct(id)) as Product | null;

      if (!productData) {
        setLoading(false);
        return;
      }

      setProduct(productData);

      const related = (await getRelatedProducts(
        productData.category,
        productData.id
      )) as Product[];

      setRelatedProducts(related);
      setLoading(false);
    }

    void loadProduct();
  }, [id, isSupabaseConfigured, router]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-10">
        <h1 className="text-4xl font-bold">
          Loading...
        </h1>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto p-10">
        <h1 className="text-4xl font-bold">
          Product Not Found
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-10">

      <ProductHero product={product} />

      <SupplierCard product={product} />

      <AIReport product={product} />

      <RelatedProducts products={relatedProducts} />

      <AIMarketing product={product} />

    </div>
  );
}
