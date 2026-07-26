import Stripe from "stripe";

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!,
  {
    apiVersion: "2026-06-24.dahlia",
  }
);

export type PaidPlan = "Pro" | "Premium";

export const STRIPE_PRICE_IDS: Record<PaidPlan, string | undefined> = {
  Pro: process.env.STRIPE_PRO_PRICE_ID,
  Premium: process.env.STRIPE_PREMIUM_PRICE_ID,
};

export function getStripePriceIdForPlan(plan: PaidPlan): string {
  const priceId = STRIPE_PRICE_IDS[plan];

  if (!priceId) {
    throw new Error(`Missing Stripe price id for ${plan} plan.`);
  }

  return priceId;
}

export function getPlanByPriceId(priceId: string | null | undefined): PaidPlan | null {
  if (!priceId) {
    return null;
  }

  if (priceId === STRIPE_PRICE_IDS.Pro) {
    return "Pro";
  }

  if (priceId === STRIPE_PRICE_IDS.Premium) {
    return "Premium";
  }

  return null;
}

export function getAppBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000";
}