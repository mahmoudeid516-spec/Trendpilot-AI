import { getStripe } from "./stripe";

export type BillingPlan = "Free" | "Pro" | "Premium";

const planAmounts: Record<BillingPlan, number> = {
  Free: 0,
  Pro: 4900,
  Premium: 9900,
};

export function normalizePlan(plan: unknown): BillingPlan {
  if (plan === "Pro") {
    return "Pro";
  }

  if (plan === "Premium" || plan === "Enterprise") {
    return "Premium";
  }

  if (plan === "Free" || plan === "Starter") {
    return "Free";
  }

  return "Free";
}

export async function createCheckoutSession(params: {
  plan: BillingPlan;
  userId: string;
  email: string;
  origin: string;
}) {
  const { plan, userId, email, origin } = params;

  if (plan === "Free") {
    throw new Error("Free plan does not require Stripe checkout.");
  }

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
    subscription_data: {
      metadata: {
        userId,
        email,
        plan,
      },
    },
    success_url: `${origin}/success`,
    cancel_url: `${origin}/cancel`,
  });
}