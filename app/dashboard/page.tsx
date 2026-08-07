"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Sidebar from "../../components/dashboard/Sidebar";
import DashboardHero from "../../components/dashboard/DashboardHero";
import StatsCards from "../../components/dashboard/StatsCards";
import BusinessOverview from "../../components/dashboard/BusinessOverview";
import AIInsights from "../../components/dashboard/AIInsights";
import AICommandCenter from "../../components/dashboard/AICommandCenter";
import SearchBar from "../../components/dashboard/SearchBar";
import Filters from "../../components/dashboard/Filters";
import ProductsTable from "../../components/dashboard/ProductsTable";
import ProductDetails from "../../components/dashboard/ProductDetails";
import ReportHistoryPanel from "../../components/dashboard/ReportHistoryPanel";
import TrendChart from "../../components/dashboard/TrendChart";
import AISalesForecast from "../../components/dashboard/AISalesForecast";
import MarketingKit from "../../components/dashboard/MarketingKit";
import type { Product } from "../../components/dashboard/ProductsTable";
import { importProducts } from "../../lib/importers/importProducts";
import { dummyProducts } from "../../lib/importers/dummyProducts";
import ProductAnalysisDrawer from "../../components/dashboard/ProductAnalysisDrawer";

export default function DashboardPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [reportRefreshSignal, setReportRefreshSignal] = useState(0);

  useEffect(() => {
    let active = true;

    async function checkUser() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (active && !session) {
          router.replace("/login");
        }
      } catch {
        if (active) {
          router.replace("/login");
        }
      }
    }

    void checkUser();

    return () => {
      active = false;
    };
  }, [router]);

  const handleSearch = useCallback(async (
    searchText: string,
    selectedPlatform: string
  ) => {
    setSearch(searchText);
    setPlatform(selectedPlatform);
  }, []);

  async function loadDummyProducts() {
    const success = await importProducts(dummyProducts);

    if (success) {
      setRefreshKey((prev) => prev + 1);
      alert("Products imported successfully.");
      return;
    }

    alert("Import failed.");
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <div className="relative z-10 flex min-h-screen">
        <Sidebar />

        <main className="flex-1 px-4 pb-14 pt-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid grid-cols-12 gap-7">
              <div className="col-span-12">
                <DashboardHero />
                <div className="mt-4 flex justify-end">
                  <Link
                    href="/dashboard/billing"
                    className="inline-flex items-center rounded-2xl border border-indigo-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50"
                  >
                    Manage Billing
                  </Link>
                </div>
              </div>

              <div className="col-span-12">
                <StatsCards refreshKey={refreshKey} />
              </div>

              <div className="col-span-12">
                <AIInsights />
              </div>

              <div className="col-span-12">
                <BusinessOverview />
              </div>

              <div className="col-span-12">
                <AICommandCenter />
              </div>

              <section className="col-span-12 rounded-[32px] border border-white/70 bg-white/80 p-5 shadow-[0_24px_65px_-45px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-6">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Product Discovery
                    </p>
                    <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                      Winning Products Table
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={loadDummyProducts}
                    className="inline-flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-700"
                  >
                    Import Demo Products
                  </button>
                </div>

                <SearchBar
                  search={search}
                  setSearch={setSearch}
                  platform={platform}
                  setPlatform={setPlatform}
                  onSearch={handleSearch}
                />

                <Filters
                  platform={platform}
                  setPlatform={setPlatform}
                />

                <ProductsTable
                  refreshKey={refreshKey}
                  search={search}
                  platform={platform}
                  onSelectProduct={setSelectedProduct}
                />
              </section>

              <div className="col-span-12">
                <TrendChart />
              </div>

              <div className="col-span-12">
                <ReportHistoryPanel refreshSignal={reportRefreshSignal} />
              </div>
            </div>

            <ProductAnalysisDrawer
    product={selectedProduct}
    onClose={() => setSelectedProduct(null)}
    onReportGenerated={() =>
        setReportRefreshSignal((prev) => prev + 1)
    }
/>

<pre className="fixed bottom-5 left-5 z-[99999] rounded bg-black p-3 text-white">
  {JSON.stringify(selectedProduct?.name)}
</pre>
          </div>
        </main>
      </div>
    </div>
  );
}