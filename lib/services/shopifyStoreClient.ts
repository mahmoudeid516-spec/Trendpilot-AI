import { supabase } from "../supabase";
import type { Product } from "../../types/Product";
import type { StoreConnectionStatus } from "../../types/StoreConnection";

async function getAuthHeader(): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Please sign in to connect Shopify.");
  }

  return `Bearer ${session.access_token}`;
}

export async function getShopifyConnectionStatus(): Promise<StoreConnectionStatus> {
  const authorization = await getAuthHeader();

  const response = await fetch("/api/shopify/status", {
    headers: { Authorization: authorization },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Unable to load Shopify connection status.");
  }

  return data as StoreConnectionStatus;
}

export async function beginShopifyConnect(shop: string): Promise<string> {
  const authorization = await getAuthHeader();

  const response = await fetch("/api/shopify/connect", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization,
    },
    body: JSON.stringify({ shop }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Unable to start the Shopify connection.");
  }

  return data.url as string;
}

export async function disconnectShopify(): Promise<void> {
  const authorization = await getAuthHeader();

  const response = await fetch("/api/shopify/disconnect", {
    method: "POST",
    headers: { Authorization: authorization },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Unable to disconnect the Shopify store.");
  }
}

export type ShopifyPushResult = {
  shopify_product_id: string;
  shopify_admin_url: string;
};

export async function pushProductToShopify(product: Product): Promise<ShopifyPushResult> {
  const authorization = await getAuthHeader();

  const response = await fetch("/api/shopify/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization,
    },
    body: JSON.stringify({ product }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Failed to import product to Shopify.");
  }

  return data as ShopifyPushResult;
}
