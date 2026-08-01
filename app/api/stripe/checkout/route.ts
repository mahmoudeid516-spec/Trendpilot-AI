import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  getAppBaseUrl,
  getStripePriceIdForPlan,
  stripe,
  type PaidPlan,
} from "../../../../lib/stripe";
import { requireUserIdOrThrow, toSubscriptionGuardResponse } from "../../../../lib/billing/subscriptionMiddleware";
import { getUserCurrentPlanFromProfile } from "../../../../lib/services/plan";

type CheckoutRequestBody = {
  plan?: string;
};

function getBearerToken(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice("Bearer ".length).trim();
}

function createRequestScopedSupabase(accessToken: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    },
  );
}

function normalizeTargetPlan(plan: string | undefined): PaidPlan | null {
  if (plan === "Pro") {
    return "Pro";
  }

  if (plan === "Premium") {
    return "Premium";
  }

  return null;
}

async function getOrCreateStripeCustomer(accessToken: string, userId: string): Promise<string> {
  const supabase = createRequestScopedSupabase(accessToken);

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user || authData.user.id !== userId) {
    console.error("[stripe-checkout] getOrCreateStripeCustomer.getUser failed", {
      hasUser: Boolean(authData.user),
      authError,
      expectedUserId: userId,
      actualUserId: authData.user?.id,
    });
    throw new Error("Authentication required.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("email, stripe_customer_id")
    .eq("id", userId)
    .maybeSingle<{ email: string | null; stripe_customer_id: string | null }>();

  if (profileError) {
    console.error("[stripe-checkout] getOrCreateStripeCustomer.profileSelect failed", {
      userId,
      profileError,
    });
    throw new Error("Failed to load profile for checkout.");
  }

  if (!profile) {
    const fallbackName = authData.user.user_metadata?.full_name;
    const fullName = typeof fallbackName === "string" ? fallbackName.trim() : "";

    const { error: profileCreateError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: userId,
          email: authData.user.email ?? null,
          full_name: fullName || authData.user.email || null,
          plan: "Free",
          subscription_status: "inactive",
        },
        { onConflict: "id" },
      );

    if (profileCreateError) {
      console.error("[stripe-checkout] getOrCreateStripeCustomer.profileCreate failed", {
        userId,
        profileCreateError,
      });
      throw new Error("Failed to create profile for checkout.");
    }
  }

  const { data: refreshedProfile, error: refreshedProfileError } = await supabase
    .from("profiles")
    .select("email, stripe_customer_id")
    .eq("id", userId)
    .maybeSingle<{ email: string | null; stripe_customer_id: string | null }>();

  if (refreshedProfileError) {
    console.error("[stripe-checkout] getOrCreateStripeCustomer.profileRefetch failed", {
      userId,
      refreshedProfileError,
    });
    throw new Error("Failed to load profile for checkout.");
  }

  if (refreshedProfile?.stripe_customer_id) {
    return refreshedProfile.stripe_customer_id;
  }

  const customer = await stripe.customers.create({
    email: refreshedProfile?.email ?? authData.user.email ?? undefined,
    metadata: {
      userId,
    },
  });

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      stripe_customer_id: customer.id,
    })
    .eq("id", userId);

  if (updateError) {
    console.error("[stripe-checkout] getOrCreateStripeCustomer.profileUpdate failed", {
      userId,
      updateError,
    });
    throw new Error("Failed to persist Stripe customer id.");
  }

  return customer.id;
}

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserIdOrThrow(req);
    const accessToken = getBearerToken(req);

    if (!accessToken) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const payload = (await req.json().catch(() => ({}))) as CheckoutRequestBody;
    const plan = normalizeTargetPlan(payload.plan);

    if (!plan) {
      return NextResponse.json({ error: "Invalid plan selection." }, { status: 400 });
    }

    const currentPlan = await getUserCurrentPlanFromProfile(userId);
    const baseUrl = getAppBaseUrl();

    if (currentPlan === plan) {
      return NextResponse.json(
        {
          error: "You are already on this plan.",
          code: "already_on_plan",
        },
        { status: 409 },
      );
    }

    const customerId = await getOrCreateStripeCustomer(accessToken, userId);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: getStripePriceIdForPlan(plan),
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      client_reference_id: userId,
      metadata: {
        userId,
        targetPlan: plan,
      },
      subscription_data: {
        metadata: {
          userId,
          targetPlan: plan,
        },
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
    });

    return NextResponse.json({ url: session.url, mode: "checkout" });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "SubscriptionGuardError") {
      return toSubscriptionGuardResponse(error);
    }

    const message = error instanceof Error ? error.message : "Stripe checkout failed.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      },
    );
  }
}