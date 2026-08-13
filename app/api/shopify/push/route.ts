import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getValidShopifyAccessToken } from "../../../../lib/services/shopifyConnections";
import { createShopifyProduct } from "../../../../lib/services/shopifyProductPush";
import type { Product } from "../../../../types/Product";

// Pushes a single TrendPilot product into the caller's connected Shopify
// store. Mirrors the response/error shape of the other /api/shopify routes
// (plain NextResponse.json, no wrapper) -- requires an existing
// store_connections row with write_products scope; if none exists, the
// client is told to connect a store first rather than this route silently
// doing nothing.
export async function POST(req: NextRequest) {
  try {
    if (!process.env.SHOPIFY_API_KEY || !process.env.SHOPIFY_API_SECRET) {
      return NextResponse.json(
        { error: "Shopify integration is not configured." },
        { status: 503 }
      );
    }

    const authHeader = req.headers.get("authorization") ?? "";

    if (!authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) as {
      product?: Product;
    };

    if (!body.product || typeof body.product !== "object") {
      return NextResponse.json(
        { error: "No product provided to import." },
        { status: 400 }
      );
    }

    console.log("[shopify-push] request", {
      userId: user.id,
      productName: body.product.name,
    });

    const connection = await getValidShopifyAccessToken(user.id);

    if (!connection) {
      return NextResponse.json(
        {
          error: "No connected Shopify store found. Connect a store first.",
        },
        { status: 404 }
      );
    }

    const result = await createShopifyProduct({
      shopDomain: connection.shopDomain,
      accessToken: connection.accessToken,
      product: body.product,
    });

    console.log("[shopify-push] success", {
      userId: user.id,
      shopDomain: connection.shopDomain,
      shopifyProductId: result.id,
    });

    return NextResponse.json({
      success: true,
      shopify_product_id: result.id,
      shopify_admin_url: result.adminUrl,
    });
  } catch (error: unknown) {
    console.error("Shopify product push error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to import product to Shopify.";

    return NextResponse.json({ error: message }, { status: 502 });
  }
}
