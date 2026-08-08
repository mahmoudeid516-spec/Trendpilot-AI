"use client";

import { Suspense } from "react";
import Sidebar from "../../../components/dashboard/Sidebar";
import ShopifyConnectCard from "../../../components/dashboard/ShopifyConnectCard";

export default function IntegrationsPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">
            🔌 Integrations
          </h1>

          <p className="text-gray-500 mb-8">
            Connect your store so TrendPilot can import your products.
          </p>

          <Suspense fallback={null}>
            <ShopifyConnectCard />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
