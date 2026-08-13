import { supabaseAdmin } from "../supabaseAdmin";
import { getShopify } from "../shopify";
import { encryptToken, decryptToken, type EncryptedToken } from "./tokenEncryption";
import type { StoreConnectionStatus } from "../../types/StoreConnection";

// This module is the only place that reads or writes `store_connections`.
// Every function here uses the service-role client, deliberately: unlike
// `products`, this table is never queried directly by browser-side code --
// every touchpoint (OAuth callback, status/disconnect routes, webhooks) is
// server-side, so RLS is present as defense-in-depth (matching the products
// pattern) rather than as the primary enforcement mechanism. Enforcement
// here is the explicit user_id/shop_domain filter on every query below.

const PROVIDER = "shopify";

// Proactively refresh if the access token expires within this window.
const REFRESH_BUFFER_MS = 5 * 60 * 1000;

type StoreConnectionRow = {
  shop_domain: string | null;
  encrypted_access_token: EncryptedToken | null;
  access_token_expires_at: string | null;
  encrypted_refresh_token: EncryptedToken | null;
  refresh_token_expires_at: string | null;
  scope: string | null;
  status: string;
  connected_at: string;
};

export async function saveShopifyConnection(params: {
  userId: string;
  shopDomain: string;
  accessToken: string;
  accessTokenExpiresAt: Date | null;
  refreshToken: string | null;
  refreshTokenExpiresAt: Date | null;
  scope: string | null;
}): Promise<void> {
  const {
    userId,
    shopDomain,
    accessToken,
    accessTokenExpiresAt,
    refreshToken,
    refreshTokenExpiresAt,
    scope,
  } = params;

  const { error } = await supabaseAdmin
    .from("store_connections")
    .upsert(
      {
        user_id: userId,
        provider: PROVIDER,
        shop_domain: shopDomain,
        encrypted_access_token: encryptToken(accessToken),
        access_token_expires_at: accessTokenExpiresAt
          ? accessTokenExpiresAt.toISOString()
          : null,
        encrypted_refresh_token: refreshToken
          ? encryptToken(refreshToken)
          : null,
        refresh_token_expires_at: refreshTokenExpiresAt
          ? refreshTokenExpiresAt.toISOString()
          : null,
        scope,
        status: "connected",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,provider,shop_domain" }
    );

  if (error) {
    throw error;
  }
}

export async function getShopifyConnectionStatus(
  userId: string
): Promise<StoreConnectionStatus> {
  const { data, error } = await supabaseAdmin
    .from("store_connections")
    .select("shop_domain, scope, status, connected_at")
    .eq("user_id", userId)
    .eq("provider", PROVIDER)
    .eq("status", "connected")
    .maybeSingle<StoreConnectionRow>();

  if (error || !data) {
    return { connected: false, provider: "shopify" };
  }

  return {
    connected: true,
    provider: "shopify",
    shopDomain: data.shop_domain ?? undefined,
    scope: data.scope ?? undefined,
    status: data.status as StoreConnectionStatus["status"],
    connectedAt: data.connected_at,
  };
}

/**
 * Returns a valid, decrypted access token for server-side Admin API calls,
 * refreshing it first if it's expiring soon. Never call this from a path
 * that could return its result to the browser.
 */
export async function getValidShopifyAccessToken(
  userId: string
): Promise<{ shopDomain: string; accessToken: string } | null> {
  const { data, error } = await supabaseAdmin
    .from("store_connections")
    .select(
      "shop_domain, encrypted_access_token, access_token_expires_at, encrypted_refresh_token, refresh_token_expires_at, scope, status, connected_at"
    )
    .eq("user_id", userId)
    .eq("provider", PROVIDER)
    .eq("status", "connected")
    .maybeSingle<StoreConnectionRow>();

  if (error || !data || !data.shop_domain || !data.encrypted_access_token) {
    return null;
  }

  const accessTokenExpiresAt = data.access_token_expires_at
    ? new Date(data.access_token_expires_at)
    : null;

  const isExpiring =
    accessTokenExpiresAt !== null &&
    accessTokenExpiresAt.getTime() - Date.now() < REFRESH_BUFFER_MS;

  if (!isExpiring) {
    return {
      shopDomain: data.shop_domain,
      accessToken: decryptToken(data.encrypted_access_token),
    };
  }

  if (!data.encrypted_refresh_token) {
    // Expiring/expired with no refresh token on file -- the connection
    // needs to be re-established via OAuth, not silently retried.
    return null;
  }

  const refreshToken = decryptToken(data.encrypted_refresh_token);
  const shopify = getShopify();

  const { session } = await shopify.auth.refreshToken({
    shop: data.shop_domain,
    refreshToken,
  });

  if (!session.accessToken) {
    return null;
  }

  await saveShopifyConnection({
    userId,
    shopDomain: data.shop_domain,
    accessToken: session.accessToken,
    accessTokenExpiresAt: session.expires ?? null,
    refreshToken: session.refreshToken ?? refreshToken,
    refreshTokenExpiresAt: session.refreshTokenExpires ?? null,
    scope: session.scope ?? data.scope ?? null,
  });

  return {
    shopDomain: data.shop_domain,
    accessToken: session.accessToken,
  };
}

export async function revokeShopifyConnection(userId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("store_connections")
    .update({
      status: "revoked",
      encrypted_access_token: null,
      access_token_expires_at: null,
      encrypted_refresh_token: null,
      refresh_token_expires_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("provider", PROVIDER);

  if (error) {
    throw error;
  }
}

export async function revokeShopifyConnectionByShopDomain(
  shopDomain: string
): Promise<void> {
  const { error } = await supabaseAdmin
    .from("store_connections")
    .update({
      status: "revoked",
      encrypted_access_token: null,
      access_token_expires_at: null,
      encrypted_refresh_token: null,
      refresh_token_expires_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("shop_domain", shopDomain)
    .eq("provider", PROVIDER);

  if (error) {
    throw error;
  }
}

/** Full erasure for the GDPR shop/redact webhook. */
export async function deleteShopifyConnectionsByShopDomain(
  shopDomain: string
): Promise<void> {
  const { error } = await supabaseAdmin
    .from("store_connections")
    .delete()
    .eq("shop_domain", shopDomain)
    .eq("provider", PROVIDER);

  if (error) {
    throw error;
  }
}
