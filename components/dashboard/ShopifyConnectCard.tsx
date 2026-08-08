"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { importProducts } from "../../lib/importers/importProducts";
import { ensureUniqueProductIds } from "../../lib/services/productIdentity";
import type { Product } from "../../types/Product";
import type { StoreConnectionStatus } from "../../types/StoreConnection";

type Props = {
  onProductsImported?: () => void;
};

export default function ShopifyConnectCard({ onProductsImported }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState("");
  const [status, setStatus] = useState<StoreConnectionStatus | null>(null);
  const [shopInput, setShopInput] = useState("");
  const [error, setError] = useState("");

  const notice = searchParams.get("shopify_connected")
    ? "Shopify store connected successfully."
    : searchParams.get("shopify_error")
    ? "Could not connect your Shopify store. Please try again."
    : "";

  useEffect(() => {
    async function loadStatus() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      try {
        const res = await fetch("/api/shopify/status", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        const data = await res.json();

        if (res.ok && data?.success) {
          setStatus(data.data);
        }
      } catch (err) {
        console.error("Failed to load Shopify status:", err);
      } finally {
        setLoading(false);
      }
    }

    void loadStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refreshStatus() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.replace("/login");
      return;
    }

    try {
      const res = await fetch("/api/shopify/status", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data?.success) {
        setStatus(data.data);
      }
    } catch (err) {
      console.error("Failed to load Shopify status:", err);
    }
  }

  async function handleConnect() {
    setError("");

    const shop = shopInput.trim().toLowerCase();

    if (!shop) {
      setError("Enter your Shopify store domain.");
      return;
    }

    setConnecting(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      const res = await fetch("/api/shopify/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ shop }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        setError(
          data?.error?.message || "Unable to start the Shopify connection."
        );
        setConnecting(false);
        return;
      }

      window.location.href = data.data.url;
    } catch (err) {
      console.error("Shopify connect failed:", err);
      setError("Unable to start the Shopify connection.");
      setConnecting(false);
    }
  }

  async function handleDisconnect() {
    setDisconnecting(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      const res = await fetch("/api/shopify/disconnect", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (res.ok) {
        await refreshStatus();
      }
    } catch (err) {
      console.error("Shopify disconnect failed:", err);
    } finally {
      setDisconnecting(false);
    }
  }

  async function handleImportProducts() {
    setImportResult("");
    setImporting(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      const res = await fetch("/api/shopify/products", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        setImportResult(
          `❌ ${data?.error?.message || "Unable to import Shopify products."}`
        );
        return;
      }

      const products = ensureUniqueProductIds(data.data as Product[]);

      const success = await importProducts(products);

      setImportResult(
        success
          ? `✅ Imported ${products.length} product${
              products.length === 1 ? "" : "s"
            } from Shopify.`
          : "❌ Some products could not be imported. Check the console for details."
      );

      onProductsImported?.();
    } catch (err) {
      console.error("Shopify product import failed:", err);
      setImportResult("❌ Unable to import Shopify products.");
    } finally {
      setImporting(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <p className="text-gray-500">Loading Shopify connection...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-14 w-14 rounded-2xl bg-green-100 flex items-center justify-center text-3xl">
          🛍️
        </div>

        <div>
          <h2 className="text-2xl font-bold">Shopify</h2>
          <p className="text-gray-500">
            Import products directly from your connected store.
          </p>
        </div>
      </div>

      {notice && (
        <div
          className={`mb-6 rounded-xl p-4 text-sm ${
            searchParams.get("shopify_connected")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {notice}
        </div>
      )}

      {status?.connected ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-emerald-50 border border-emerald-100 p-6">
          <div>
            <p className="font-semibold text-emerald-900">
              Connected to {status.shopDomain}
            </p>
            <p className="text-sm text-emerald-700 mt-1">
              Status: {status.status}
              {status.connectedAt
                ? ` · Connected ${new Date(status.connectedAt).toLocaleDateString()}`
                : ""}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleImportProducts}
              disabled={importing}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              {importing ? "Importing..." : "Import Products"}
            </button>

            <button
              onClick={handleDisconnect}
              disabled={disconnecting}
              className="bg-white text-red-600 border border-red-200 px-6 py-3 rounded-xl font-semibold hover:bg-red-50 transition disabled:opacity-50"
            >
              {disconnecting ? "Disconnecting..." : "Disconnect"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="your-store.myshopify.com"
            value={shopInput}
            onChange={(e) => setShopInput(e.target.value)}
            className="flex-1 border rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            onClick={handleConnect}
            disabled={connecting}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-xl font-bold transition"
          >
            {connecting ? "Connecting..." : "Connect Shopify Store"}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl bg-red-100 text-red-700 p-4 text-sm">
          {error}
        </div>
      )}

      {importResult && (
        <div
          className={`mt-4 rounded-xl p-4 text-sm ${
            importResult.startsWith("✅")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {importResult}
        </div>
      )}
    </div>
  );
}
