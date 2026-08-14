"use client";

import { useState } from "react";
import { ShoppingBag, Loader2, Check, RotateCcw } from "lucide-react";
import { getShopifyConnectionStatus, pushProductToShopify } from "../../lib/services/shopifyStoreClient";
import type { Product } from "../../types/Product";
import { buttonClass } from "../ui/button";
import ShopifyConnectModal from "./ShopifyConnectModal";

type Status = "idle" | "loading" | "success" | "error";

type Props = {
  product: Product;
};

/**
 * The "To My Shopify" action for a single product-table row. Reuses the
 * exact same service functions ProductDetails.tsx's "Import to Shopify"
 * button already calls (getShopifyConnectionStatus / pushProductToShopify,
 * both in lib/services/shopifyStoreClient.ts, hitting the existing
 * /api/shopify/status and /api/shopify/push routes) -- there is no second
 * Shopify implementation here, only a second, more compact place to
 * trigger the same one.
 *
 * There is no persisted "already imported" flag anywhere in the product
 * data model (the push route never writes back to Supabase), so "success"
 * is honestly scoped to this component's lifetime, exactly like the
 * Report's existing shopifyResult state -- it is never fabricated ahead of
 * a real, successful push.
 */
export default function ShopifyImportAction({ product }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [adminUrl, setAdminUrl] = useState<string | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);

  async function handleClick() {
    if (status === "loading") return;

    if (status === "success" && adminUrl) {
      window.open(adminUrl, "_blank", "noopener,noreferrer");
      return;
    }

    setStatus("loading");
    setErrorMessage(null);

    try {
      const connection = await getShopifyConnectionStatus();

      if (!connection.connected) {
        setShowConnectModal(true);
        setStatus("idle");
        return;
      }

      const result = await pushProductToShopify(product);

      setAdminUrl(result.shopify_admin_url);
      setStatus("success");
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to import product to Shopify.");
      setStatus("error");
    }
  }

  const label =
    status === "loading"
      ? "Adding to Shopify..."
      : status === "success"
        ? "Added to Shopify"
        : status === "error"
          ? "Try Again"
          : "To My Shopify";

  const ariaLabel =
    status === "loading"
      ? "Adding product to your Shopify store"
      : status === "success"
        ? "Product added to Shopify. View it in Shopify admin"
        : status === "error"
          ? `Retry adding product to Shopify. Last attempt failed: ${errorMessage ?? "unknown error"}`
          : "Add product to my Shopify store";

  return (
    <>
      <button
        onClick={handleClick}
        disabled={status === "loading"}
        title={status === "error" && errorMessage ? errorMessage : undefined}
        aria-label={ariaLabel}
        className={buttonClass({ tone: "positive", size: "sm", className: "px-2.5" })}
      >
        {status === "loading" && <Loader2 size={12} strokeWidth={2.5} className="animate-spin" aria-hidden="true" />}
        {status === "success" && <Check size={12} strokeWidth={2.5} aria-hidden="true" />}
        {status === "error" && <RotateCcw size={12} strokeWidth={2.5} aria-hidden="true" />}
        {status === "idle" && <ShoppingBag size={12} strokeWidth={2.5} aria-hidden="true" />}
        {label}
      </button>

      {showConnectModal && <ShopifyConnectModal onClose={() => setShowConnectModal(false)} />}
    </>
  );
}
