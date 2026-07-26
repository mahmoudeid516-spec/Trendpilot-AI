import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getPlanByPriceId, stripe } from "../../../../lib/stripe";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";
import { recordBillingEvent } from "../../../../lib/services/billing";

export const runtime = "nodejs";

function toSubscriptionStatus(status: Stripe.Subscription.Status):
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "incomplete"
  | "inactive" {
  if (status === "trialing") {
    return "trialing";
  }

  if (status === "active") {
    return "active";
  }

  if (status === "past_due") {
    return "past_due";
  }

  if (status === "canceled") {
    return "canceled";
  }

  if (status === "incomplete") {
    return "incomplete";
  }

  return "inactive";
}

function toPlanCode(plan: "Free" | "Pro" | "Premium"): "free-monthly" | "pro-monthly" | "premium-monthly" {
  if (plan === "Pro") {
    return "pro-monthly";
  }

  if (plan === "Premium") {
    return "premium-monthly";
  }

  return "free-monthly";
}

async function getPlanIdByCode(code: "free-monthly" | "pro-monthly" | "premium-monthly"): Promise<string> {
  const { data, error } = await supabaseAdmin
    .from("plans")
    .select("id")
    .eq("code", code)
    .maybeSingle<{ id: string }>();

  if (error || !data?.id) {
    throw new Error(`Failed to resolve billing plan by code: ${code}`);
  }

  return data.id;
}

async function findUserIdByStripeCustomerId(customerId: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle<{ id: string }>();

  if (error) {
    throw new Error("Failed to resolve user by Stripe customer id.");
  }

  return data?.id ?? null;
}

async function resolveUserIdForSubscription(subscription: Stripe.Subscription): Promise<string | null> {
  const metadataUserId = typeof subscription.metadata?.userId === "string" ? subscription.metadata.userId : null;
  if (metadataUserId) {
    return metadataUserId;
  }

  const customerId = typeof subscription.customer === "string" ? subscription.customer : null;
  if (!customerId) {
    return null;
  }

  return findUserIdByStripeCustomerId(customerId);
}

async function syncSubscription(subscription: Stripe.Subscription): Promise<string | null> {
  const userId = await resolveUserIdForSubscription(subscription);
  const customerId = typeof subscription.customer === "string" ? subscription.customer : null;

  if (!userId || !customerId) {
    return null;
  }

  const stripePriceId = subscription.items.data[0]?.price?.id ?? null;
  const mappedPlan = getPlanByPriceId(stripePriceId)
    ?? (subscription.metadata?.targetPlan === "Premium" ? "Premium" : subscription.metadata?.targetPlan === "Pro" ? "Pro" : null);

  const currentPlan = mappedPlan ?? "Free";
  const dbStatus = toSubscriptionStatus(subscription.status);
  const effectivePlan = dbStatus === "canceled" || dbStatus === "inactive" ? "Free" : currentPlan;
  const planId = await getPlanIdByCode(toPlanCode(effectivePlan));

  await supabaseAdmin
    .from("subscriptions")
    .update({
      status: "canceled",
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .in("status", ["trialing", "active", "past_due"])
    .neq("stripe_subscription_id", subscription.id);

  const currentPeriodStartIso = new Date(subscription.current_period_start * 1000).toISOString();
  const currentPeriodEndIso = new Date(subscription.current_period_end * 1000).toISOString();

  const { data: savedSubscription, error: upsertError } = await supabaseAdmin
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        plan_id: planId,
        status: dbStatus,
        current_period_start: currentPeriodStartIso,
        current_period_end: currentPeriodEndIso,
        cancel_at_period_end: subscription.cancel_at_period_end,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscription.id,
      },
      { onConflict: "stripe_subscription_id" },
    )
    .select("id")
    .maybeSingle<{ id: string }>();

  if (upsertError) {
    throw new Error("Failed to persist subscription state.");
  }

  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .update({
      stripe_customer_id: customerId,
      subscription_id: subscription.id,
      plan: effectivePlan,
      subscription_status: dbStatus,
      renewal_date: currentPeriodEndIso,
      cancel_at_period_end: subscription.cancel_at_period_end,
    })
    .eq("id", userId);

  if (profileError) {
    throw new Error("Failed to sync profile subscription state.");
  }

  await recordBillingEvent({
    userId,
    subscriptionId: savedSubscription?.id ?? null,
    eventType: `stripe.subscription.${subscription.status}`,
    payload: {
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: customerId,
      priceId: stripePriceId,
      status: subscription.status,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });

  return userId;
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const userId = typeof session.client_reference_id === "string"
    ? session.client_reference_id
    : typeof session.metadata?.userId === "string"
      ? session.metadata.userId
      : null;
  const customerId = typeof session.customer === "string" ? session.customer : null;

  if (userId && customerId) {
    await supabaseAdmin
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", userId);
  }

  const subscriptionId = typeof session.subscription === "string" ? session.subscription : null;

  if (subscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    await syncSubscription(subscription);
    return;
  }

  if (userId) {
    await recordBillingEvent({
      userId,
      eventType: "stripe.checkout.session.completed",
      payload: {
        checkoutSessionId: session.id,
        customerId,
      },
    });
  }
}

async function handleInvoiceEvent(invoice: Stripe.Invoice, eventType: string): Promise<void> {
  const customerId = typeof invoice.customer === "string" ? invoice.customer : null;
  const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : null;

  if (subscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const userId = await syncSubscription(subscription);

    if (userId) {
      await recordBillingEvent({
        userId,
        eventType,
        payload: {
          invoiceId: invoice.id,
          stripeSubscriptionId: subscriptionId,
          customerId,
          amountPaid: invoice.amount_paid,
          amountDue: invoice.amount_due,
        },
      });
    }

    return;
  }

  if (customerId) {
    const userId = await findUserIdByStripeCustomerId(customerId);
    if (userId) {
      await recordBillingEvent({
        userId,
        eventType,
        payload: {
          invoiceId: invoice.id,
          customerId,
          amountPaid: invoice.amount_paid,
          amountDue: invoice.amount_due,
        },
      });
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET." }, { status: 500 });
    }

    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
    }

    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    switch (event.type) {
      case "checkout.session.completed": {
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await syncSubscription(event.data.object as Stripe.Subscription);
        break;
      }
      case "invoice.payment_succeeded":
      case "invoice.payment_failed": {
        await handleInvoiceEvent(event.data.object as Stripe.Invoice, event.type);
        break;
      }
      default:
        break;
    }

    return NextResponse.json({
      received: true,
    });
  } catch {

    return NextResponse.json(
      { error: "Webhook Error" },
      { status: 400 }
    );
  }
}