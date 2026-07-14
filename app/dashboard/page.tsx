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
import Filters from "../../components/dashboard/Filters";
import AIAnalyzer from "../../components/dashboard/AIAnalyzer";
import ProductsTable from "../../components/dashboard/ProductsTable";
import ProductDetails from "../../components/dashboard/ProductDetails";
import TrendChart from "../../components/dashboard/TrendChart";
import AISalesForecast from "../../components/dashboard/AISalesForecast";
import MarketingKit from "../../components/dashboard/MarketingKit";
import ProGate from "../../components/dashboard/ProGate";
import { importProducts } from "../../lib/importers/importProducts";
import { searchAliExpress } from "../../services/providers/aliexpress";
import { mapApifyProduct } from "../../services/productMapper";
import { dummyProducts } from "../../lib/importers/dummyProducts";

export default function DashboardPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
      }
    }

    checkUser();
  }, [router]);

  async function handleSearch(
    searchText: string,
    selectedPlatform: string
  ) {
    console.log("Search:", searchText);
    console.log("Platform:", selectedPlatform);

    if (!searchText.trim()) {
      alert("Please enter a product name.");
      return;
    }
    const products = await searchAliExpress({
      keyword: searchText,
    });
    console.log("RAW PRODUCTS");
console.log(products);
console.log("COUNT:", products.length);
    
    const mappedProducts = products.map(mapApifyProduct);

    console.log("MAPPED PRODUCTS");
console.log(mappedProducts);
console.log("COUNT:", mappedProducts.length);

// اعرض النتائج فورًا
setSearchResults(mappedProducts);

// احفظها في الخلفية
await importProducts(mappedProducts);

setSearch(searchText);
setPlatform(selectedPlatform);
setRefreshKey((prev) => prev + 1);

  }

  async function loadDummyProducts() {
    const success = await importProducts(dummyProducts);

    if (success) {
      setRefreshKey((prev) => prev + 1);
      alert("Products Imported Successfully!");
    } else {
      alert("Import Failed");
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

<Sidebar />

      <main className="flex-1 p-10">

        <div className="max-w-7xl mx-auto">

          <DashboardHero totalProducts={0} winningProducts={0} /> 

          <StatsCards refreshKey={refreshKey} />

          <BusinessOverview />

          <AIInsights />

          <AICommandCenter />

          <SearchBar 
            search={search}
            setSearch={setSearch}
            platform={platform}
            setPlatform={setPlatform}
            onSearch={handleSearch}
          />

          <div className="mb-6">
            <button
              onClick={loadDummyProducts}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl"
            >
              Import Demo Products
            </button>
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