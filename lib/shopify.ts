import "@shopify/shopify-api/adapters/web-api";
import { shopifyApi, ApiVersion, type Shopify } from "@shopify/shopify-api";

export const SHOPIFY_API_VERSION = ApiVersion.July26;

// read_products: reading/importing a connected store's own catalog.
// write_products: pushing a TrendPilot-discovered product INTO the store
// (lib/services/shopifyProductPush.ts / POST /api/shopify/push).
export const SHOPIFY_SCOPES = ["read_products", "write_products"];

export const SHOPIFY_CALLBACK_PATH = "/api/shopify/callback";

// First-party cookie (separate from the SDK's own state cookie) used only to
// remember which of *our* authenticated users started the OAuth flow, so the
// callback -- which Shopify calls with no Supabase session attached -- knows
// whose store_connections row to write. Short-lived, httpOnly, cleared after
// the callback consumes it.
export const SHOPIFY_CONNECT_UID_COOKIE = "shopify_connect_uid";

let shopifyClient: Shopify | null = null;

function getSiteHostName(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL is not configured.");
  }

  return siteUrl.replace(/^https?:\/\//, "").replace(/\/+$/, "");
}

export function getShopify(): Shopify {
  const apiKey = process.env.SHOPIFY_API_KEY;
  const apiSecretKey = process.env.SHOPIFY_API_SECRET;

  if (!apiKey || !apiSecretKey) {
    throw new Error(
      "SHOPIFY_API_KEY / SHOPIFY_API_SECRET are not configured."
    );
  }

  if (!shopifyClient) {
    shopifyClient = shopifyApi({
      apiKey,
      apiSecretKey,
      scopes: SHOPIFY_SCOPES,
      hostName: getSiteHostName(),
      apiVersion: SHOPIFY_API_VERSION,
      isEmbeddedApp: false,
    });
  }

  return shopifyClient;
}

const SHOP_DOMAIN_PATTERN = /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i;

export function isValidShopDomain(shop: string): boolean {
  return SHOP_DOMAIN_PATTERN.test(shop);
}
