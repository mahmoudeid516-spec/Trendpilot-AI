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
import ProGate from "../../components/dashboard/ProGate";
import AIAnalyzer from "../../components/dashboard/AIAnalyzer";
import ProductsTable from "../../components/dashboard/ProductsTable";
import ProductDetails from "../../components/dashboard/ProductDetails";
import AISalesForecast from "../../components/dashboard/AISalesForecast";
import MarketingKit from "../../components/dashboard/MarketingKit";
import { importProducts } from "../../lib/importers/importProducts";
import { ensureUniqueProductIds } from "../../lib/services/productIdentity";
import { productSearch, ProductSearchError } from "../../services/productSearch";
import type { Product } from "../../types/Product";

// Every one of these is a visually and textually distinct state -- a
// provider failure must never render the same "no products found" banner
// as a legitimate zero-result search.
type SearchStatus = {
  type:
    | "found"
    | "empty"
    | "unavailable"
    | "auth_failed"
    | "timeout"
    | "malformed"
    | "error";
  message: string;
};

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
  const [searchStatus, setSearchStatus] = useState<SearchStatus | null>(null);

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
    setSearchStatus(null);

    try {
      const products = await productSearch({
        keyword: searchText,
        platform: selectedPlatform,
      });

      const mappedProducts: Product[] = ensureUniqueProductIds(
        products as Product[]
      );

      setSearchResults(mappedProducts);

      if (mappedProducts.length === 0) {
        setSearchStatus({
          type: "empty",
          message: "No matching products found.",
        });
      } else {
        setSearchStatus({
          type: "found",
          message: `Found ${mappedProducts.length} product${
            mappedProducts.length === 1 ? "" : "s"
          }.`,
        });

        await importProducts(mappedProducts);
        setRefreshKey((prev) => prev + 1);
      }

      setSearch(searchText);
      setPlatform(selectedPlatform);
    } catch (error) {
      console.error("Product search failed:", error);

      if (error instanceof ProductSearchError) {
        switch (error.code) {
          case "PRODUCT_PROVIDER_ERROR":
            setSearchStatus({
              type: "unavailable",
              message:
                "Product search is not configured on this server (missing provider credentials). This is not an empty result -- the search could not run.",
            });
            break;
          case "PRODUCT_PROVIDER_AUTH_FAILED":
            setSearchStatus({
              type: "auth_failed",
              message:
                "The product search provider rejected the configured credentials. This is not an empty result -- the search could not authenticate.",
            });
            break;
          case "PRODUCT_PROVIDER_TIMEOUT":
            setSearchStatus({
              type: "timeout",
              message:
                "The product search provider took too long to respond. This is not an empty result -- please try again.",
            });
            break;
          case "PRODUCT_PROVIDER_MALFORMED_RESPONSE":
            setSearchStatus({
              type: "malformed",
              message:
                "The product search provider returned an unexpected response. This is not an empty result -- please try again shortly.",
            });
            break;
          default:
            setSearchStatus({
              type: "error",
              message: error.message || "Product search failed.",
            });
        }
      } else {
        setSearchStatus({
          type: "error",
          message:
            error instanceof Error ? error.message : "Product search failed.",
        });
      }

      setSearchResults([]);
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
            isSearching={isSearching}
          />

          {searchStatus && (
            <div
              className={`mb-8 rounded-2xl p-4 text-sm font-semibold ${
                searchStatus.type === "found"
                  ? "bg-green-100 text-green-700"
                  : searchStatus.type === "empty"
                  ? "bg-gray-100 text-gray-700"
                  : searchStatus.type === "unavailable"
                  ? "bg-amber-100 text-amber-800"
                  : searchStatus.type === "auth_failed"
                  ? "bg-red-100 text-red-800"
                  : searchStatus.type === "timeout"
                  ? "bg-orange-100 text-orange-800"
                  : searchStatus.type === "malformed"
                  ? "bg-orange-100 text-orange-800"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {searchStatus.type === "unavailable" && "⚠️ Search unavailable: "}
              {searchStatus.type === "auth_failed" && "🔒 Provider authentication failed: "}
              {searchStatus.type === "timeout" && "⏱️ Provider timed out: "}
              {searchStatus.type === "malformed" && "⚠️ Unexpected provider response: "}
              {searchStatus.type === "error" && "❌ Search failed: "}
              {searchStatus.message}
            </div>
          )}

          <ProGate>
            <AIAnalyzer
              onProductSaved={() => {
                setRefreshKey((prev) => prev + 1);
              }}
            />
          </ProGate>

<ProductsTable
  products={searchResults}
  refreshKey={refreshKey}
  search={search}
  platform={platform}
  searchFailed={Boolean(
    searchStatus &&
    searchStatus.type !== "found" &&
    searchStatus.type !== "empty"
  )}
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

        </div>

      </main>

    </div>
  );
}