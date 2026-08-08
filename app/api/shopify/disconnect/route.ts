import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { revokeShopifyConnection } from "../../../../lib/services/shopifyConnections";
import { apiSuccess, apiError } from "../../../../lib/apiResponse";

export async function POST(req: NextRequest) {
  try {
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

    await revokeShopifyConnection(user.id);

    return apiSuccess({ disconnected: true });
  } catch (error: unknown) {
    console.error("Shopify disconnect error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unable to disconnect the Shopify store.";

    return apiError("SHOPIFY_DISCONNECT_FAILED", message, 500);
  }
}
