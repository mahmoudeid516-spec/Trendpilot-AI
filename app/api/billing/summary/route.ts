import { NextRequest, NextResponse } from "next/server";
import { requireUserIdOrThrow, toSubscriptionGuardResponse } from "../../../../lib/billing/subscriptionMiddleware";
import { getUserCurrentPlanFromProfile } from "../../../../lib/services/plan";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

type BillingSummary = {
  plan: "Free" | "Pro" | "Premium";
  subscriptionStatus: string;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  renewalDate: string | null;
  cancelAtPeriodEnd: boolean;
  hasBillingAccount: boolean;
  events: Array<{
    id: string;
    eventType: string;
    createdAt: string;
  }>;
};

export async function GET(req: NextRequest) {
  try {
    const userId = await requireUserIdOrThrow(req);
    const plan = await getUserCurrentPlanFromProfile(userId);

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("stripe_customer_id, subscription_status, current_period_start, current_period_end, renewal_date, cancel_at_period_end")
      .eq("id", userId)
      .maybeSingle<{
        stripe_customer_id: string | null;
        subscription_status: string | null;
        current_period_start: string | null;
        current_period_end: string | null;
        renewal_date: string | null;
        cancel_at_period_end: boolean | null;
      }>();

    if (profileError) {
      throw new Error("Failed to load billing profile.");
    }

    const { data: events, error: eventsError } = await supabaseAdmin
      .from("billing_events")
      .select("id, event_type, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (eventsError) {
      throw new Error("Failed to load billing history.");
    }

    const response: BillingSummary = {
      plan,
      subscriptionStatus: profile?.subscription_status ?? "inactive",
      currentPeriodStart: profile?.current_period_start ?? null,
      currentPeriodEnd: profile?.current_period_end ?? profile?.renewal_date ?? null,
      renewalDate: profile?.current_period_end ?? profile?.renewal_date ?? null,
      cancelAtPeriodEnd: Boolean(profile?.cancel_at_period_end),
      hasBillingAccount: Boolean(profile?.stripe_customer_id),
      events: (events ?? []).map((event) => ({
        id: String(event.id),
        eventType: String(event.event_type),
        createdAt: String(event.created_at),
      })),
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "SubscriptionGuardError") {
      return toSubscriptionGuardResponse(error);
    }

    const message = error instanceof Error ? error.message : "Failed to load billing summary.";

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
