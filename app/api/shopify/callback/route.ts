import { NextRequest, NextResponse } from "next/server";
import { getShopify, SHOPIFY_CONNECT_UID_COOKIE } from "../../../../lib/shopify";
import { saveShopifyConnection } from "../../../../lib/services/shopifyConnections";

// Shopify redirects the merchant's browser here after they approve
// installation. There is no Supabase session on this request -- the
// first-party cookie set by /api/shopify/connect is how we know which of
// our users this belongs to. CSRF protection and Shopify's own HMAC
// verification are both handled internally by shopify.auth.callback().
export async function GET(req: NextRequest) {
  const redirectTo = (path: string) =>
    NextResponse.redirect(new URL(path, req.url));

  const userId = req.cookies.get(SHOPIFY_CONNECT_UID_COOKIE)?.value;

  if (!userId) {
    return redirectTo(
      "/dashboard/integrations?shopify_error=missing_session"
    );
  }

  try {
    const shopify = getShopify();

    // expiring: true opts into Shopify's expiring offline-token model
    // (access token + refresh token, both with their own expiry) rather
    // than the legacy non-expiring offline token.
    const { headers, session } = await shopify.auth.callback({
      expiring: true,
      rawRequest: req,
    });

    if (!session.accessToken || !session.shop) {
      throw new Error("Shopify did not return an access token.");
    }

    await saveShopifyConnection({
      userId,
      shopDomain: session.shop,
      accessToken: session.accessToken,
      accessTokenExpiresAt: session.expires ?? null,
      refreshToken: session.refreshToken ?? null,
      refreshTokenExpiresAt: session.refreshTokenExpires ?? null,
      scope: session.scope ?? null,
    });

    const response = redirectTo(
      "/dashboard/integrations?shopify_connected=1"
    );

    (headers as Headers).forEach((value: string, key: string) => {
      if (key.toLowerCase() === "set-cookie") {
        response.headers.append("set-cookie", value);
      }
    });

    response.cookies.delete(SHOPIFY_CONNECT_UID_COOKIE);

    return response;
  } catch (error: unknown) {
    console.error("Shopify OAuth callback failed:", error);

    const response = redirectTo(
      "/dashboard/integrations?shopify_error=connect_failed"
    );
    response.cookies.delete(SHOPIFY_CONNECT_UID_COOKIE);
    return response;
  }
}
