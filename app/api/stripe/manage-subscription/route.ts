import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getStripe } from "../../../../lib/stripe";
import { apiSuccess, apiError } from "../../../../lib/apiResponse";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") ?? "";

    if (!authHeader.startsWith("Bearer ")) {
      return apiError("UNAUTHORIZED", "Unauthorized", 401);
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
      return apiError(
        "CONFIG_ERROR",
        "Supabase configuration is missing.",
        500
      );
    }

    const supabase = createClient(supabaseUrl, anonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return apiError("UNAUTHORIZED", "Unauthorized", 401);
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.email) {
      return apiError(
        "PROFILE_EMAIL_MISSING",
        "Profile email is required to manage subscriptions.",
        400
      );
    }

    const stripe = getStripe();

    const customers = await stripe.customers.list({
      email: profile.email,
      limit: 1,
    });

    const customerId = customers.data[0]?.id;

    if (!customerId) {
      return apiError(
        "NO_STRIPE_CUSTOMER",
        "No Stripe customer found for this account.",
        404
      );
    }

    const origin =
      req.headers.get("origin") ??
      process.env.NEXT_PUBLIC_SITE_URL ??
      "http://localhost:3000";

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/dashboard`,
    });

    return apiSuccess({ url: portalSession.url });
  } catch (error: unknown) {
    console.error("Manage subscription error:", error);

    const message =
      error instanceof Error ? error.message : "Unable to open billing portal.";

    return apiError("BILLING_PORTAL_FAILED", message, 500);
  }
}
