import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  createCheckoutSession,
  normalizePlan,
} from "../../../../lib/billing";
import { apiSuccess, apiError } from "../../../../lib/apiResponse";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") ?? "";

    if (!authHeader.startsWith("Bearer ")) {
      return apiError("UNAUTHORIZED", "Unauthorized", 401);
    }

    const body = (await req.json().catch(() => ({}))) as {
      plan?: unknown;
    };

    const plan = normalizePlan(body.plan);

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

    const origin =
      req.headers.get("origin") ??
      process.env.NEXT_PUBLIC_SITE_URL ??
      "http://localhost:3000";

    const session = await createCheckoutSession({
      plan,
      userId: user.id,
      email: user.email ?? "",
      origin,
    });

    return apiSuccess({ url: session.url });

  } catch (error: unknown) {
    console.error("Stripe Error:", error);

    const message =
      error instanceof Error ? error.message : "Checkout failed.";

    return apiError("CHECKOUT_FAILED", message, 500);
  }
}