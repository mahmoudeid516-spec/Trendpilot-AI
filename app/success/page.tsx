import Link from "next/link";
import type Stripe from "stripe";
import { getPlanByPriceId, stripe } from "../../lib/stripe";

type SearchParams = Record<string, string | string[] | undefined>;

export const dynamic = "force-dynamic";

type SuccessPageProps = {
  searchParams: Promise<SearchParams>;
};

function getStringParam(value: string | string[] | undefined): string | null {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (Array.isArray(value) && typeof value[0] === "string" && value[0].trim()) {
    return value[0].trim();
  }

  return null;
}

function getCustomerEmail(session: Stripe.Checkout.Session): string {
  const directEmail = session.customer_details?.email;
  if (directEmail) {
    return directEmail;
  }

  const customer = session.customer;
  if (customer && typeof customer !== "string" && "email" in customer && customer.email) {
    return customer.email;
  }

  return "Unknown";
}

function getCurrentPlan(session: Stripe.Checkout.Session): "Free" | "Pro" | "Premium" {
  const expandedLineItems = session.line_items?.data ?? [];
  const priceIdFromLineItem = expandedLineItems[0]?.price?.id ?? null;
  const mappedPlanFromLineItems = getPlanByPriceId(priceIdFromLineItem);

  if (mappedPlanFromLineItems) {
    return mappedPlanFromLineItems;
  }

  const subscription = session.subscription;
  const subscriptionItemPriceId = subscription && typeof subscription !== "string"
    ? subscription.items.data[0]?.price?.id ?? null
    : null;
  const mappedPlanFromSubscription = getPlanByPriceId(subscriptionItemPriceId);

  if (mappedPlanFromSubscription) {
    return mappedPlanFromSubscription;
  }

  return "Free";
}

function logStepError(error: unknown): never {
  if (error instanceof Error) {
    console.error(error.stack ?? error.message);
  } else {
    console.error(error);
  }

  throw error;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  console.log("=== SUCCESS PAGE STARTED ===");
  let resolvedSearchParams: SearchParams;
  try {
    console.log("STEP 1 - before await searchParams");
    resolvedSearchParams = await searchParams;
    console.log("STEP 1 - after await searchParams", resolvedSearchParams);
  } catch (error) {
    logStepError(error);
  }

  let sessionId: string | null;
  try {
    console.log("STEP 2 - before getStringParam(session_id)");
    sessionId = getStringParam(resolvedSearchParams.session_id);
    console.log("STEP 2 - after getStringParam(session_id)", sessionId);
  } catch (error) {
    logStepError(error);
  }

  if (!sessionId) {
    throw new Error("Missing session_id in /success route.");
  }

  let session: Stripe.Checkout.Session;
  try {
    console.log("STEP 3 - before stripe.checkout.sessions.retrieve()");
    console.log("STEP 3 - sessionId", sessionId);
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: [
        "customer",
        "subscription",
        "line_items",
        "line_items.data.price",
        "subscription.items",
        "subscription.items.data.price",
      ],
    });
    console.log("STEP 3 - after stripe.checkout.sessions.retrieve()", session);
  } catch (error) {
    logStepError(error);
  }

  let currentPlan: "Free" | "Pro" | "Premium";
  try {
    console.log("STEP 4 - before getCurrentPlan()");
    currentPlan = getCurrentPlan(session);
    console.log("STEP 4 - after getCurrentPlan()", currentPlan);
  } catch (error) {
    logStepError(error);
  }

  let customerEmail: string;
  try {
    console.log("STEP 5 - before getCustomerEmail()");
    customerEmail = getCustomerEmail(session);
    console.log("STEP 5 - after getCustomerEmail()", customerEmail);
  } catch (error) {
    logStepError(error);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg text-center">

        <h1 className="text-5xl font-bold text-green-600">
          Payment Successful
        </h1>

        <div className="mt-6 space-y-2 text-left text-sm text-slate-700">
          <p>✓ Payment Successful</p>
          <p>✓ Current Plan: {currentPlan}</p>
          <p>✓ Customer Email: {customerEmail}</p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
          >
            Go to Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}