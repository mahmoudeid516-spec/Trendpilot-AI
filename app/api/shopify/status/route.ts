import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getShopifyConnectionStatus } from "../../../../lib/services/shopifyConnections";
import { apiSuccess, apiError } from "../../../../lib/apiResponse";

// Returns connection status only -- never a token, encrypted or otherwise.
export async function GET(req: NextRequest) {
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

    const status = await getShopifyConnectionStatus(user.id);

    return apiSuccess(status);
  } catch (error: unknown) {
    console.error("Shopify status error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unable to load Shopify connection status.";

    return apiError("SHOPIFY_STATUS_FAILED", message, 500);
  }
}
