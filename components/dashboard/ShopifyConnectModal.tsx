"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { beginShopifyConnect } from "../../lib/services/shopifyStoreClient";
import { buttonClass } from "../ui/button";

type Props = {
  onClose: () => void;
};

/**
 * Same connect flow already used inline in ProductDetails.tsx (same copy,
 * same beginShopifyConnect() call, same "your-store.myshopify.com" field) --
 * just relocated into a modal so it also works from the compact product
 * table, which has no room for an inline form. Not a second Shopify
 * integration: this calls the exact same lib/services/shopifyStoreClient.ts
 * function, which hits the existing /api/shopify/connect route.
 */
export default function ShopifyConnectModal({ onClose }: Props) {
  const [shop, setShop] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConnect() {
    const domain = shop.trim().toLowerCase();

    if (!domain) {
      setError("Enter your Shopify store domain.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const url = await beginShopifyConnect(domain);

      window.location.href = url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to start the Shopify connection.");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 sm:p-6">
      <div className="relative w-full max-w-md rounded-2xl bg-[var(--surface-card)] p-6 shadow-2xl sm:p-7">
        <button
          onClick={onClose}
          aria-label="Close Shopify connect dialog"
          className="tp-focus-ring absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-[var(--ink-500)] hover:bg-[var(--surface-muted)]"
        >
          <X size={18} />
        </button>

        <h3 className="pr-8 text-base font-bold text-[var(--ink-900)]">Connect your Shopify store</h3>
        <p className="mt-1.5 text-xs text-[var(--ink-400)]">
          No connected Shopify store found. Enter your store domain to connect it, then try again.
        </p>

        <div className="mt-5 flex flex-col gap-3">
          <input
            type="text"
            placeholder="your-store.myshopify.com"
            value={shop}
            onChange={(e) => setShop(e.target.value)}
            className="tp-focus-ring min-h-11 rounded-lg border border-[var(--border-subtle)] px-4 text-sm outline-none"
          />
          <button
            onClick={handleConnect}
            disabled={loading}
            className={buttonClass({ tone: "positive", className: "min-h-11" })}
          >
            {loading ? "Connecting..." : "Connect Shopify"}
          </button>
        </div>

        {error && <p className="mt-3 text-xs text-[var(--accent-risk)]">{error}</p>}
      </div>
    </div>
  );
}
