import { NextRequest, NextResponse } from "next/server";
import { getAppBaseUrl, stripe } from "../../../../lib/stripe";
import { requireUserIdOrThrow, toSubscriptionGuardResponse } from "../../../../lib/billing/subscriptionMiddleware";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

function resolveSafeReturnUrl(inputUrl: unknown, defaultReturnUrl: string): string {
  if (typeof inputUrl !== "string" || inputUrl.trim().length === 0) {
    return defaultReturnUrl;
  }

  try {
    const baseUrl = new URL(defaultReturnUrl);
    const candidate = new URL(inputUrl);

    if (candidate.origin !== baseUrl.origin) {
      return defaultReturnUrl;
    }

    return candidate.toString();
  } catch {
    return defaultReturnUrl;
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserIdOrThrow(req);
    const body = (await req.json().catch(() => ({}))) as { returnUrl?: string };

    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", userId)
      .maybeSingle<{ stripe_customer_id: string | null }>();

    if (error) {
      throw new Error("Failed to load billing profile.");
    }

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        {
          error: "No active Stripe billing account found for this user.",
          code: "billing_account_not_found",
        },
        { status: 404 },
      );
    }

    const defaultReturnUrl = `${getAppBaseUrl()}/dashboard/billing`;
    const returnUrl = resolveSafeReturnUrl(body.returnUrl, defaultReturnUrl);

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: returnUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "SubscriptionGuardError") {
      return toSubscriptionGuardResponse(error);
    }

    const message = error instanceof Error ? error.message : "Failed to create billing portal session.";

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
