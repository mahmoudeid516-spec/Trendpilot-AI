import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "../../../../lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { upsertWithCompatibility } from "../../../../lib/services/supabaseCompatibility";

function mapStripeStatusToProfileStatus(status: string): "active" | "inactive" {
  if (status === "active" || status === "trialing") {
    return "active";
  }

  return "inactive";
}

function normalizeStripePlan(plan: string | undefined): "Free" | "Pro" | "Premium" {
  if (plan === "Pro") {
    return "Pro";
  }

  if (plan === "Premium" || plan === "Enterprise") {
    return "Premium";
  }

  return "Free";
}

async function resolveUserIdFromCustomer(
  supabaseUrl: string,
  serviceRoleKey: string,
  customerEmail: string | null
): Promise<string | null> {
  if (!customerEmail) return null;

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", customerEmail)
    .limit(1)
    .maybeSingle<{ id: string }>();

  if (error || !data?.id) {
    return null;
  }

  return String(data.id);
}

export async function POST(req: NextRequest) {
  const body = await req.text();

  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe Signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Invalid webhook signature.";

    console.error("Webhook verification failed:", message);

    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.userId;
      const plan = normalizeStripePlan(session.metadata?.plan);

      if (userId) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !serviceRoleKey) {
          throw new Error(
            "Supabase admin credentials are not configured for webhook processing."
          );
        }

        const supabase = createClient(supabaseUrl, serviceRoleKey);

        const { error } = await upsertWithCompatibility(
          supabase,
          "profiles",
          {
            id: userId,
            plan,
            subscription_status: "active",
          },
          "id"
        );

        if (error) {
          console.error(error);
        } else {
          console.log("User upgraded to Pro:", userId);
        }
      }

      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.created": {
      const subscription = event.data.object as Stripe.Subscription;

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !serviceRoleKey) {
        throw new Error(
          "Supabase admin credentials are not configured for webhook processing."
        );
      }

      const supabase = createClient(supabaseUrl, serviceRoleKey);

      const fallbackPlanFromAmount = (() => {
        const amount = subscription.items.data[0]?.price?.unit_amount ?? 0;
        if (amount >= 9900) return "Premium";
        if (amount >= 4900) return "Pro";
        return "Free";
      })();

      const userIdFromMetadata = subscription.metadata?.userId;
      const customerEmail =
        typeof subscription.customer === "object" &&
        "email" in subscription.customer &&
        typeof subscription.customer.email === "string"
          ? subscription.customer.email
          : null;

      const userId =
        userIdFromMetadata ??
        (await resolveUserIdFromCustomer(supabaseUrl, serviceRoleKey, customerEmail));

      if (!userId) {
        console.warn("Webhook subscription update without resolved user id", {
          subscriptionId: subscription.id,
          customerEmail,
        });
        break;
      }

      const plan = normalizeStripePlan(
        subscription.metadata?.plan ?? fallbackPlanFromAmount
      );

      const subscriptionStatus = mapStripeStatusToProfileStatus(subscription.status);

      const { error } = await upsertWithCompatibility(
        supabase,
        "profiles",
        {
          id: userId,
          plan,
          subscription_status: subscriptionStatus,
        },
        "id"
      );

      if (error) {
        console.error(error);
      }

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !serviceRoleKey) {
        throw new Error(
          "Supabase admin credentials are not configured for webhook processing."
        );
      }

      const supabase = createClient(supabaseUrl, serviceRoleKey);

      const userIdFromMetadata = subscription.metadata?.userId;
      const customerEmail =
        typeof subscription.customer === "object" &&
        "email" in subscription.customer &&
        typeof subscription.customer.email === "string"
          ? subscription.customer.email
          : null;

      const userId =
        userIdFromMetadata ??
        (await resolveUserIdFromCustomer(supabaseUrl, serviceRoleKey, customerEmail));

      if (!userId) {
        console.warn("Webhook subscription delete without resolved user id", {
          subscriptionId: subscription.id,
          customerEmail,
        });
        break;
      }

      const { error } = await upsertWithCompatibility(
        supabase,
        "profiles",
        {
          id: userId,
          plan: "Free",
          subscription_status: "inactive",
        },
        "id"
      );

      if (error) {
        console.error(error);
      }

      break;
    }

    default:
      console.log(`Unhandled event: ${event.type}`);
  }

  return NextResponse.json({
    received: true,
  });
}