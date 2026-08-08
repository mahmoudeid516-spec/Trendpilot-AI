import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getValidShopifyAccessToken } from "../../../../lib/services/shopifyConnections";
import { fetchShopifyProducts } from "../../../../lib/services/shopifyProducts";
import { apiSuccess, apiError } from "../../../../lib/apiResponse";

// Returns the connected store's products as plain catalog data (never a
// token). The access token is decrypted and used only inside this request,
// server-side, to call Shopify's Admin API -- it never leaves this route.
//
// This deliberately mirrors /api/product-search's shape (client fetches
// Product[] from a route, then calls the existing importProducts() client
// function to persist them) instead of writing to `products` here directly,
// since importProducts() depends on the browser-session-bound Supabase
// client and cannot run inside a server route.
export async function GET(req: NextRequest) {
  try {
    if (!process.env.SHOPIFY_API_KEY || !process.env.SHOPIFY_API_SECRET) {
      return apiError(
        "SHOPIFY_PROVIDER_ERROR",
        "Shopify integration is not configured.",
        503
      );
    }

    const authHeader = req.headers.get("authorization") ?? "";

    if (!authHeader.startsWith("Bearer ")) {
      return apiError("UNAUTHORIZED", "Unauthorized", 401);
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return apiError("UNAUTHORIZED", "Unauthorized", 401);
    }

    const connection = await getValidShopifyAccessToken(user.id);

    if (!connection) {
      return apiError(
        "SHOPIFY_NOT_CONNECTED",
        "No connected Shopify store found. Connect a store first.",
        404
      );
    }

    const products = await fetchShopifyProducts({
      shopDomain: connection.shopDomain,
      accessToken: connection.accessToken,
    });

    return apiSuccess(products);
  } catch (error: unknown) {
    console.error("Shopify products fetch error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unable to fetch Shopify products.";

    return apiError("SHOPIFY_PRODUCTS_FETCH_FAILED", message, 500);
  }
}
