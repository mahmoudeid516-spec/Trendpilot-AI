import { NextRequest, NextResponse } from "next/server";
import {
  getAppBaseUrl,
  getStripePriceIdForPlan,
  stripe,
  type PaidPlan,
} from "../../../../lib/stripe";
import { requireUserIdOrThrow, toSubscriptionGuardResponse } from "../../../../lib/billing/subscriptionMiddleware";
import { getUserCurrentPlanFromProfile } from "../../../../lib/services/plan";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

type CheckoutRequestBody = {
  plan?: string;
};

function normalizeTargetPlan(plan: string | undefined): PaidPlan | null {
  if (plan === "Pro") {
    return "Pro";
  }

  if (plan === "Premium") {
    return "Premium";
  }

  return null;
}

async function getOrCreateStripeCustomer(userId: string): Promise<string> {
  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("email, stripe_customer_id")
    .eq("id", userId)
    .maybeSingle<{ email: string | null; stripe_customer_id: string | null }>();

  if (profileError) {
    throw new Error("Failed to load profile for checkout.");
  }

  if (profile?.stripe_customer_id) {
    return profile.stripe_customer_id;
  }

  const customer = await stripe.customers.create({
    email: profile?.email ?? undefined,
    metadata: {
      userId,
    },
  });

  const { error: updateError } = await supabaseAdmin
    .from("profiles")
    .update({
      stripe_customer_id: customer.id,
    })
    .eq("id", userId);

  if (updateError) {
    throw new Error("Failed to persist Stripe customer id.");
  }

  return customer.id;
}

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserIdOrThrow(req);
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

    const customerId = await getOrCreateStripeCustomer(userId);

    if (currentPlan === "Pro" || currentPlan === "Premium") {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${baseUrl}/billing`,
      });

      return NextResponse.json({ url: portalSession.url, mode: "portal" });
    }

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