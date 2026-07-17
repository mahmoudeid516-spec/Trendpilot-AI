import { getStripe } from "./stripe";

export type BillingPlan = "Starter" | "Pro" | "Enterprise";

const planAmounts: Record<BillingPlan, number> = {
  Starter: 2900,
  Pro: 4900,
  Enterprise: 9900,
};

export function normalizePlan(plan: unknown): BillingPlan {
  if (plan === "Pro" || plan === "Enterprise" || plan === "Starter") {
    return plan;
  }

  return "Starter";
}

export async function createCheckoutSession(params: {
  plan: BillingPlan;
  userId: string;
  email: string;
  origin: string;
}) {
  const { plan, userId, email, origin } = params;

  const stripe = getStripe();

  return stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `TrendPilot AI ${plan}`,
          },
          recurring: {
            interval: "month",
          },
          unit_amount: planAmounts[plan],
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      email,
      plan,
    },
    success_url: `${origin}/success`,
    cancel_url: `${origin}/cancel`,
  });
}