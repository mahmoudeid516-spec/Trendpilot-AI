import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { revokeShopifyConnection } from "../../../../lib/services/shopifyConnections";

export async function POST(req: NextRequest) {
  try {
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

    await revokeShopifyConnection(user.id);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Shopify disconnect error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unable to disconnect the Shopify store.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
