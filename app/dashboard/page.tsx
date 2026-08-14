"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
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
import Eyebrow from "../../components/ui/Eyebrow";
import type { Product } from "../../types/Product";

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardPageContent />
    </Suspense>
  );
}

// useSearchParams() (used below to read the Shopify OAuth callback's query
// params) requires a Suspense boundary in the App Router -- split out so the
// default export can provide one without changing anything else about how
// this page behaves.
function DashboardPageContent() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const hasSupabaseClient = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  // Read once, from the initial render's URL, via a lazy initializer rather
  // than an effect + setState -- the value is fully derivable from the URL
  // Shopify's OAuth callback landed us on, and computing it here (instead of
  // setting it from inside an effect, which triggers cascading-render
  // warnings) also means it survives the URL-cleanup effect below without a
  // second state update.
  const [shopifyNotice] = useState<
    { type: "success" | "error"; text: string } | null
  >(() => {
    const connected = searchParams.get("shopify_connected");
    const error = searchParams.get("shopify_error");

    if (!connected && !error) return null;

    return connected
      ? { type: "success", text: "Shopify store connected successfully." }
      : {
          type: "error",
          text:
            error === "missing_session"
              ? "Shopify connection expired before it could complete. Please try connecting again."
              : "Could not connect your Shopify store. Please try again.",
        };
  });

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

  // Strip the Shopify callback's query params from the URL so they don't
  // persist across reloads -- shopifyNotice above already captured them.
  useEffect(() => {
    if (!searchParams.get("shopify_connected") && !searchParams.get("shopify_error")) return;

    router.replace("/dashboard", { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface-app)] lg:flex-row">

      <Sidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-8 lg:p-10">

        <div className="mx-auto max-w-7xl space-y-10">

          {shopifyNotice && (
            <div
              className={`rounded-xl border p-4 text-sm ${
                shopifyNotice.type === "success"
                  ? "border-[var(--accent-positive)]/20 bg-[var(--accent-positive-soft)] text-[var(--ink-900)]"
                  : "border-[var(--accent-risk)]/20 bg-[var(--accent-risk-soft)] text-[var(--ink-900)]"
              }`}
            >
              {shopifyNotice.text}
            </div>
          )}

          <DashboardHero totalProducts={0} winningProducts={0} />

          <section className="space-y-6">
            <StatsCards refreshKey={refreshKey} />
            <BusinessOverview />
          </section>

          <AIInsights />

          {/* Two distinct tools, deliberately presented as separate blocks:
              an AI advisor you talk to (ask questions, get strategy), and a
              product search engine you query (real products, real actions).
              The eyebrow labels + icons reinforce that distinction at a
              glance, without duplicating each other's UI. */}
          <section>
            <div className="mb-4 flex flex-col gap-1">
              <Eyebrow icon="🧠" label="AI Advisor" tone="ai" />
              <p className="text-sm text-[var(--ink-500)]">
                Ask questions and get market intelligence &mdash; not a product list.
              </p>
            </div>

            <AICommandCenter />
          </section>

          <section>
            <div className="mb-4 flex flex-col gap-1">
              <Eyebrow icon="🔎" label="Product Research" tone="data" />
              <h2 className="text-2xl font-bold text-[var(--ink-900)]">Find Winning Products</h2>
              <p className="text-sm text-[var(--ink-500)]">
                Search real products and evaluate opportunities with evidence &mdash; not AI guesses.
              </p>
            </div>

            <ProductResearchPanel
              onProductsSaved={() => setRefreshKey((prev) => prev + 1)}
              onSelectProduct={(product) => {
                setSelectedProduct(product);
                setShowProductModal(true);
              }}
            />
          </section>

          <section>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-[var(--ink-900)]">Saved Product Library</h2>
              <p className="mt-1 text-sm text-[var(--ink-500)]">
                Products you&apos;ve previously searched and saved &mdash; separate from live search results above.
              </p>
            </div>

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
          </section>

          {showProductModal && selectedProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6">

              <div className="relative max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-[var(--surface-card)] shadow-2xl">

                <button
                  onClick={() => setShowProductModal(false)}
                  aria-label="Close product report"
                  className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[var(--ink-700)] shadow-md hover:bg-white"
                >
                  <X size={18} />
                </button>

                <ProductDetails product={selectedProduct} />

                <AISalesForecast product={selectedProduct} />

                <MarketingKit productName={selectedProduct.name} />

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
