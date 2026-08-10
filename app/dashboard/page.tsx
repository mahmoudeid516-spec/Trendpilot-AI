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
import ProductResearchPanel from "../../components/product-research/ProductResearchPanel";
import ProductsTable from "../../components/dashboard/ProductsTable";
import ProductDetails from "../../components/dashboard/ProductDetails";
import TrendChart from "../../components/dashboard/TrendChart";
import AISalesForecast from "../../components/dashboard/AISalesForecast";
import MarketingKit from "../../components/dashboard/MarketingKit";
import type { Product } from "../../types/Product";

export default function DashboardPage() {

  const router = useRouter();
  const hasSupabaseClient = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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

  return (
    <div className="flex min-h-screen bg-gray-100">

<Sidebar />

      <main className="flex-1 p-10">

        <div className="max-w-7xl mx-auto">

          <DashboardHero totalProducts={0} winningProducts={0} /> 

          <StatsCards refreshKey={refreshKey} />

          <BusinessOverview />

          <AIInsights />

          {/* Two distinct tools, deliberately presented as separate blocks:
              an AI advisor you talk to (ask questions, get strategy), and a
              product search engine you query (real products, real actions).
              The eyebrow labels + icons reinforce that distinction at a
              glance, without duplicating each other's UI. */}
          <section className="mt-12">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-sm text-white">
                🧠
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-purple-600">
                  AI Advisor
                </p>
                <p className="text-sm text-gray-500">
                  Ask questions and get market intelligence &mdash; not a product list.
                </p>
              </div>
            </div>

            <AICommandCenter />
          </section>

          <section className="mt-12">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm text-white">
                🔎
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                  Product Search Engine
                </p>
                <p className="text-sm text-gray-500">
                  Search real products and evaluate opportunities with evidence.
                </p>
              </div>
            </div>

            <ProductResearchPanel
              onProductsSaved={() => setRefreshKey((prev) => prev + 1)}
              onSelectProduct={(product) => {
                setSelectedProduct(product);
                setShowProductModal(true);
              }}
            />
          </section>

          <h2 className="mt-12 text-2xl font-bold text-gray-900">Saved Products</h2>
          <p className="mb-4 text-sm text-gray-500">Products you&apos;ve previously searched and saved.</p>

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
  products={[]}
  refreshKey={refreshKey}
  search=""
  platform="All"
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