"use client";

import { useState } from "react";
import MarketingKit from "../../components/dashboard/MarketingKit";
import { importProducts } from "../../lib/importers/importProducts";
import { dummyProducts } from "../../lib/importers/dummyProducts";

import Sidebar from "../../components/dashboard/Sidebar";
import SearchBar from "../../components/dashboard/SearchBar";
import Filters from "../../components/dashboard/Filters";
import StatsCards from "../../components/dashboard/StatsCards";
import AIAnalyzer from "../../components/dashboard/AIAnalyzer";
import ProductsTable from "../../components/dashboard/ProductsTable";
import ProductDetails from "../../components/dashboard/ProductDetails";
import TrendChart from "../../components/dashboard/TrendChart";
import AIInsights from "../../components/dashboard/AIInsights";

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  async function loadAIProduct() {
    const success = await importProducts(dummyProducts);

    if (success) {
      alert("Products Imported Successfully!");
      setRefreshKey((prev) => prev + 1);
    } else {
      alert("Import Failed");
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <main className="flex-1 p-10">

        <div className="max-w-7xl mx-auto">

          <div className="mb-10">

            <h1 className="text-4xl font-bold">
              TrendPilot AI Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              Discover AI Selected Winning Products
            </p>

          </div>

          <SearchBar
            search={search}
            setSearch={setSearch}
            platform={platform}
            setPlatform={setPlatform}
            onSearch={loadAIProduct}
          />

<AIAnalyzer
  onProductSaved={() => {
    setRefreshKey((prev) => prev + 1);
  }}
/>

          <Filters
            platform={platform}
            setPlatform={setPlatform}
          />

<StatsCards refreshKey={refreshKey} />

<MarketingKit productName="Portable Blender" />

<ProductsTable
  refreshKey={refreshKey}
  search={search}
  platform={platform}
  onSelectProduct={setSelectedProduct}
/>

{/* {selectedProduct && (
  <ProductDetails
    product={selectedProduct}
  />
)}

<TrendChart />

<AIInsights /> */}

<MarketingKit />

        </div>

      </main>

    </div>
  );
}