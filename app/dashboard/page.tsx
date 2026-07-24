"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { useProducts } from "@/context/ProductContext";
import { importProducts } from "../../lib/importers/importProducts";
import { searchAliExpress } from "../../services/providers/aliexpress";
import { dummyProducts } from "../../lib/importers/dummyProducts";
import { calculateWinningProbability } from "../../lib/scoring/productScore";

// Kept imports intact for future sub-pages/usage
import ProductDrawer from "../../components/dashboard/ProductDrawer";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import DashboardStats from "../../components/dashboard/DashboardStats";
import DashboardSearch from "../../components/dashboard/DashboardSearch";
import Sidebar from "../../components/dashboard/Sidebar";
import StatsCards from "../../components/dashboard/StatsCards";
import BusinessOverview from "../../components/dashboard/BusinessOverview";
import AIInsights from "../../components/dashboard/AIInsights";
import AICommandCenter from "../../components/dashboard/AICommandCenter";
import ProductsTable from "../../components/dashboard/ProductsTable";
import TrendChart from "../../components/dashboard/TrendChart";

import type { Product } from "../../types/Product";

type SortOption = "score" | "profit" | "winningProbability";

export default function DashboardPage() {
  const router = useRouter();
  const { setProducts } = useProducts();

  const [search, setSearch] = useState<string>("");
  const [platform, setPlatform] = useState<string>("All");
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [subscriptionRole, setSubscriptionRole] = useState<"free" | "pro" | "premium">("free");
  const [userName, setUserName] = useState<string>("User");

  // Pagination & Sorting State
  const [pageSize, setPageSize] = useState<number>(20);
  const [sortBy, setSortBy] = useState<SortOption>("score");

  useEffect(() => {
    async function checkUserAndSubscription() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      const params = new URLSearchParams(window.location.search);
      if (params.get("success") === "true") {
        const { error } = await supabase
          .from("profiles")
          .update({
            plan: "Pro",
            subscription_status: "active",
          })
          .eq("id", session.user.id);

        if (!error) {
          window.history.replaceState({}, "", "/dashboard");
        }
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, plan, subscription_status")
        .eq("id", session.user.id)
        .single();

      if (data?.full_name) {
        setUserName(data.full_name);
      }

      if (!error && data) {
        if (data.subscription_status === "active") {
          setSubscriptionRole((data.plan?.toLowerCase() as "free" | "pro" | "premium") || "free");
        } else {
          setSubscriptionRole("free");
        }
      } else {
        setSubscriptionRole("free");
      }
    }

    checkUserAndSubscription();
  }, [router]);

  const handleSearch = useCallback(
    async (searchText: string, selectedPlatform: string) => {
      const keyword = searchText.trim();
  
      if (!keyword) return;
  
      // Clear previous results immediately
      setSearchResults([]);
      setProducts([]);
  
      setSearch(keyword);
      setPlatform(selectedPlatform);
  
      try {
        let products = await searchAliExpress(keyword);
  
        console.log("Search:", keyword);
        console.log("API returned:", products.length);
  
        if (subscriptionRole === "free") {
          products = products.slice(0, 3);
        } else if (subscriptionRole === "pro") {
          products = products.slice(0, 15);
        }
  
        if (!products.length) {
          setSearchResults([]);
          return;
        }
  
        setSearchResults(products);
        setProducts(products);
  
        if (subscriptionRole !== "free") {
          await importProducts(products);
        }
  
        setRefreshKey((k) => k + 1);
      } catch (err) {
        console.error(err);
        setSearchResults([]);
      }
    },
    [subscriptionRole, setProducts]
  );

  const handleManualFresh = useCallback(async () => {
    if (subscriptionRole !== "premium") {
      alert("This Instant Fresh feature is only available for Premium Elite users!");
      return;
    }

    if (!search.trim()) return;

    setIsRefreshing(true);

    try {
      const freshProducts = await searchAliExpress(search);

      setSearchResults(freshProducts);
      setProducts(freshProducts);
      await importProducts(freshProducts);
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error("Error refreshing products:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [search, subscriptionRole, setProducts]);

  const loadDummyProducts = useCallback(async () => {
    const success = await importProducts(dummyProducts);
    if (success) {
      setSearchResults(dummyProducts);
      setProducts(dummyProducts);
      setRefreshKey((prev) => prev + 1);
    }
  }, [setProducts]);

  const scoredProducts = useMemo(() => {
    return searchResults.map((product) => {
      const buyPrice = Number(product.buy_price || 0);
      const sellingPrice = Number(product.selling_price || 0);
      const estimatedProfit = Math.max(0, sellingPrice - buyPrice);

      const score = calculateWinningProbability({
        supplierPrice: buyPrice,
        sellingPrice: sellingPrice,
        rating: Number(product.rating || 4.5),
        orders: Number(product.orders || 0),
        shippingDays: Number(product.shipping_days || 10),
        trendScore: Number(product.trend_score || 10),
        competitionScore: 15,
        marketingScore: 15,
      });

      return {
        ...product,
        estimatedProfit,
        score,
      };
    });
  }, [searchResults]);

  // Handle Sort & Pagination
  const processedProducts = useMemo(() => {
    const productsCopy = [...scoredProducts];

    productsCopy.sort((a, b) => {
      if (sortBy === "score") {
        return (b.score.totalScore || 0) - (a.score.totalScore || 0);
      }
      if (sortBy === "profit") {
        return b.estimatedProfit - a.estimatedProfit;
      }
      if (sortBy === "winningProbability") {
        return (b.score.winningProbability || 0) - (a.score.winningProbability || 0);
      }
      return 0;
    });

    return productsCopy.slice(0, pageSize);
  }, [scoredProducts, sortBy, pageSize]);

  const winningProductsCount = useMemo(() => {
    return scoredProducts.filter((p) => p.score.winningProbability >= 90).length;
  }, [scoredProducts]);

  const handleSelectProduct = useCallback(
    (product: Product) => {
      router.push(`/products/${product.id}`);
    },
    [router]
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-purple-500 selection:text-white">
      {/* 1. Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10 transition-all duration-300">
        <div className="mx-auto max-w-7xl space-y-8">
          
          {/* 2. Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <DashboardHeader name={userName} />

            <div className="flex items-center gap-3">
              {process.env.NODE_ENV === "development" && (
                <button
                  onClick={loadDummyProducts}
                  className="rounded-xl bg-white px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 transition-all active:scale-95"
                >
                  Import Demo Data
                </button>
              )}
              <button
                onClick={handleManualFresh}
                disabled={isRefreshing}
                className={`relative group overflow-hidden rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 active:scale-95 shadow-sm ${
                  subscriptionRole === "premium"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/20 hover:shadow-lg"
                    : "cursor-not-allowed bg-slate-200 text-slate-400"
                }`}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  {isRefreshing ? "🔄 Refreshing..." : "⚡ Instant Fresh"}
                </span>
              </button>
            </div>
          </div>

          {/* 3. Primary Hero Search Section */}
          <section className="relative bg-white rounded-3xl border border-purple-100/80 p-8 shadow-xl shadow-purple-950/5 overflow-hidden">
            {/* Soft Ambient Glow Background */}
            <div className="absolute -top-12 left-1/2 -z-10 h-64 w-96 -translate-x-1/2 rounded-full bg-gradient-to-tr from-purple-200/40 to-indigo-200/40 blur-3xl" />

            <div className="max-w-3xl mx-auto text-center space-y-3 mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 flex items-center justify-center gap-2">
                <span>🔥</span> Find Winning Products
              </h1>
              <p className="text-slate-500 text-sm sm:text-base font-medium">
                Search any niche and discover AI-selected winning products in seconds.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <DashboardSearch 
                onSearch={handleSearch} 
                platform={platform} 
                search={search} 
                setPlatform={setPlatform} 
                setSearch={setSearch} 
              />
            </div>
          </section>

          {/* 4. Dashboard Stats */}
          <section>
            <DashboardStats 
              totalProducts={searchResults.length} 
              winningProducts={winningProductsCount} 
            />
          </section>

          {/* 5. Results Controls & Products Table */}
          <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="text-slate-900 font-bold text-lg">
                Found <span className="text-purple-600">{searchResults.length}</span> Products
              </div>

              <div className="flex flex-wrap items-center gap-6">
                {/* Results Per Page */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Results per page:
                  </span>
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    {[20, 50, 100, 200].map((size) => (
                      <button
                        key={size}
                        onClick={() => setPageSize(size)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                          pageSize === size
                            ? "bg-white text-purple-600 shadow-sm"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Sort by:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600 cursor-pointer"
                  >
                    <option value="score">AI Score</option>
                    <option value="profit">Profit</option>
                    <option value="winningProbability">Winning Probability</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Core Product Grid/Table */}
            <ProductsTable 
              onSelectProduct={handleSelectProduct} 
              platform={platform} 
              products={processedProducts} 
              refreshKey={refreshKey} 
              search={search} 
              subscription={subscriptionRole} 
            />
          </section>

        </div>
      </main>
    </div>
  );
}