"use client";

import RevenueAnalytics from "@/components/dashboard/RevenueAnalytics";
import ProfitTrendChart from "@/components/dashboard/ProfitTrendChart";
import { useProducts } from "@/context/ProductContext";

export default function AnalyticsPage() {
  const { products } = useProducts();

  return (
    <main className="space-y-8 p-8">
      <div>
        <h1 className="text-4xl font-bold">
          📊 Analytics Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Advanced business intelligence powered by TrendPilot AI.
        </p>
      </div>

      <RevenueAnalytics products={products} />

      <ProfitTrendChart products={products} />
    </main>
  );
}