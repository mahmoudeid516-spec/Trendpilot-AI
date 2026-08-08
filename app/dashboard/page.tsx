"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Sidebar from "../../components/dashboard/Sidebar";
import DashboardHero from "../../components/dashboard/DashboardHero";
import StatsCards from "../../components/dashboard/StatsCards";
import BusinessOverview from "../../components/dashboard/BusinessOverview";
import AIInsights from "../../components/dashboard/AIInsights";
import AICommandCenter from "../../components/dashboard/AICommandCenter";
import SearchBar from "../../components/dashboard/SearchBar";
import ProductsTable from "../../components/dashboard/ProductsTable";
import ProductDetails from "../../components/dashboard/ProductDetails";
import TrendChart from "../../components/dashboard/TrendChart";
import AISalesForecast from "../../components/dashboard/AISalesForecast";
import MarketingKit from "../../components/dashboard/MarketingKit";
import { importProducts } from "../../lib/importers/importProducts";
import { ensureUniqueProductIds } from "../../lib/services/productIdentity";
import { productSearch } from "../../services/productSearch";
import type { Product } from "../../types/Product";

export default function DashboardPage() {

  const router = useRouter();
  const hasSupabaseClient = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [savedProducts, setSavedProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function checkUser() {
      if (!hasSupabaseClient) {
        router.replace("/login");
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
      }
    }

    checkUser();
  }, [hasSupabaseClient, router]);

  // Single source of truth for the user's saved products, shared by the
  // hero stats, business overview, and AI insights cards below -- avoids
  // each of them independently querying the same table.
  useEffect(() => {
    async function loadSavedProducts() {
      if (!hasSupabaseClient) {
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setSavedProducts([]);
        return;
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Failed loading saved products:", error.message);
        return;
      }

      setSavedProducts((data ?? []) as Product[]);
    }

    void loadSavedProducts();
  }, [hasSupabaseClient, refreshKey]);

  const winningProducts = savedProducts.filter(
    (p) => (p.opportunity_score ?? 0) >= 90
  );

  const avgOpportunityScore =
    savedProducts.length === 0
      ? null
      : Math.round(
          savedProducts.reduce(
            (sum, p) => sum + (p.opportunity_score ?? 0),
            0
          ) / savedProducts.length
        );

  const avgWinningProbability =
    savedProducts.length === 0
      ? null
      : Math.round(
          savedProducts.reduce(
            (sum, p) => sum + (p.winning_probability ?? 0),
            0
          ) / savedProducts.length
        );

  async function handleSearch(
    searchText: string,
    selectedPlatform: string
  ) {
    if (isSearching) {
      return;
    }

    if (!searchText.trim()) {
      alert("Please enter a product name.");
      return;
    }

    setIsSearching(true);

    try {
      const products = await productSearch({
        keyword: searchText,
        platform: selectedPlatform,
      });

      const mappedProducts: Product[] = ensureUniqueProductIds(
        products as Product[]
      );

      setSearchResults(mappedProducts);

      await importProducts(mappedProducts);

      setSearch(searchText);
      setPlatform(selectedPlatform);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Product search failed:", error);

      const message =
        error instanceof Error ? error.message : "Product search failed.";

      alert(message);
    } finally {
      setIsSearching(false);
    }

  }

  return (
    <div className="flex min-h-screen bg-gray-100">

<Sidebar />

      <main className="flex-1 p-10">

        <div className="max-w-7xl mx-auto">

          <DashboardHero
            totalProducts={savedProducts.length}
            winningProducts={winningProducts.length}
            avgOpportunityScore={avgOpportunityScore}
            avgWinningProbability={avgWinningProbability}
          />

          <StatsCards refreshKey={refreshKey} />

          <BusinessOverview products={savedProducts} />

          <AIInsights products={savedProducts} />

          <AICommandCenter />

          <SearchBar 
            search={search}
            setSearch={setSearch}
            platform={platform}
            setPlatform={setPlatform}
            onSearch={handleSearch}
          />

          {/* TEMP DISABLED

<ProGate>
  <AIAnalyzer
    onProductSaved={() => {
      setRefreshKey((prev) => prev + 1);
    }}
  />
</ProGate>

<Filters
  platform={platform}
  setPlatform={setPlatform}
/>

<ProductsTable
  products={searchResults}
  refreshKey={refreshKey}
  search={search}
  platform={platform}
  onSelectProduct={(product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  }}
/>

{searchResults.length > 0 &&
  console.log("[TRACE][Dashboard][ProductsTable props]", {
    count: searchResults.length,
    ids: searchResults.map((product) => product.id),
  })}

*/}

<ProductsTable
  products={searchResults}
  refreshKey={refreshKey}
  search={search}
  platform={platform}
  onSelectProduct={(product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  }}
/>

{showProductModal && selectedProduct && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">

    <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white">

      <button
        onClick={() => setShowProductModal(false)}
        className="absolute right-6 top-6 text-4xl font-bold text-gray-500 hover:text-black"
      >
        ×
      </button>

      <ProductDetails product={selectedProduct} />

      <AISalesForecast
        product={selectedProduct}
      />

      <MarketingKit
        productName={selectedProduct.name}
      />

    </div>

  </div>
)}

<TrendChart />
          {/* TEMP DISABLED */}

        </div>

      </main>

    </div>
  );
}