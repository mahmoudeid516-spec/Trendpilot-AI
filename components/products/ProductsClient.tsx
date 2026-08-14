"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hasSupabaseConfig, supabase } from "../../lib/supabase";
import { ensureUniqueProductIds } from "../../lib/services/productIdentity";
import type { Product } from "../../types/Product";
import DashboardHero from "../dashboard/DashboardHero";
import ProductGrid from "./ProductGrid";
import SearchBar from "./SearchBar";
import Filters from "./Filters";

// Fetches client-side, with the browser's authenticated session, the same
// way components/dashboard/ProductsTable.tsx already does successfully.
// The previous version of this page fetched server-side (app/products/page.tsx,
// now just a thin shell) using the same anon-key Supabase client but with no
// session attached -- this project has no server-side session/cookie
// bridging (no @supabase/ssr) anywhere, so that server-side query ran
// unauthenticated, RLS silently returned zero rows, and the page always
// showed "No products found" regardless of how many products the user
// actually had. The Dashboard's own product list uses this exact
// client-side pattern and has always worked correctly.
export default function ProductsClient() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("");
  const [competition, setCompetition] = useState("");
  const [minScore, setMinScore] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      if (!hasSupabaseConfig()) {
        if (!cancelled) {
          setError("Supabase is not configured.");
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      const { data, error: queryError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (queryError) {
        console.error("Failed loading products:", queryError.message);
        setError(queryError.message);
        setProducts([]);
      } else {
        setProducts(ensureUniqueProductIds((data ?? []) as Product[]));
      }

      setLoading(false);
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const filteredProducts = products.filter((product) => {
    const text = search.toLowerCase();

    const matchesSearch =
      text === "" ||
      product.name?.toLowerCase().includes(text) ||
      product.category?.toLowerCase().includes(text) ||
      product.country?.toLowerCase().includes(text) ||
      product.supplier?.toLowerCase().includes(text);

    const matchesPlatform = !platform || product.platform === platform;
    const matchesCompetition = !competition || product.competition === competition;
    const matchesScore = Number(product.ai_score ?? 0) >= minScore;

    return matchesSearch && matchesPlatform && matchesCompetition && matchesScore;
  });

  const winningProducts = products.filter((p) => (p.opportunity_score ?? 0) >= 90).length;

  return (
    <>
      <DashboardHero totalProducts={products.length} winningProducts={winningProducts} />

      <div className="mt-8">
        <SearchBar value={search} onChange={setSearch} />

        <Filters
          platform={platform}
          competition={competition}
          minScore={minScore}
          onPlatformChange={setPlatform}
          onCompetitionChange={setCompetition}
          onMinScoreChange={setMinScore}
        />

        {loading ? (
          <div className="py-20 text-center text-gray-500">Loading your saved products...</div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 py-10 text-center text-red-700">
            Unable to load your products: {error}
          </div>
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </div>
    </>
  );
}
