"use client";

import { Check, Sparkles } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { buttonClass } from "../ui/button";
import ScrollReveal from "./ScrollReveal";

// Real plan pricing, sourced from lib/billing.ts (planAmounts, in cents) --
// the same values the actual Stripe checkout session is created with.
// Free = $0, Pro = 4900 = $49/mo, Premium = 9900 = $99/mo. Not invented,
// not estimated -- kept in sync with the billing source of truth.
const PLANS = [
  {
    name: "Free",
    price: "$0",
    description: "Try TrendPilot with limited research.",
    features: ["Limited Product Search", "Basic AI Analysis", "Community Support"],
    featured: false,
  },
  {
    name: "Pro",
    price: "$49",
    description: "For sellers actively sourcing products.",
    features: ["Unlimited Products", "Advanced AI Analysis", "Priority Support"],
    featured: true,
  },
  {
    name: "Premium",
    price: "$99",
    description: "For teams that need the full toolkit.",
    features: ["Unlimited Everything", "Private API", "Dedicated Manager"],
    featured: false,
  },
] as const;

export default function Pricing() {
  const hasSupabaseClient = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return (
    <section id="pricing" className="relative overflow-hidden bg-[var(--surface-app)] py-24">
      <div
        className="tp-glow-violet pointer-events-none absolute left-1/2 top-0 h-96 w-[36rem] -translate-x-1/2 opacity-40 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-ai)]">Pricing</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--ink-900)] sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-[var(--ink-500)]">
              Choose the plan that fits how you research products. Upgrade, downgrade, or cancel anytime.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3 md:items-end">
          {PLANS.map((plan, i) => (
            <ScrollReveal key={plan.name} delayMs={i * 90}>
              <div
                className={`relative flex h-full flex-col p-8 ${
                  plan.featured
                    ? "tp-card-elevated border-[var(--accent-ai)]/35 ring-1 ring-[var(--accent-ai)]/25 md:scale-[1.04]"
                    : "tp-card-elevated"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-gradient-to-r from-[var(--accent-ai)] to-[#4c2fd1] px-3.5 py-1.5 text-[11px] font-bold text-white shadow-[0_8px_20px_-6px_rgba(109,74,255,0.55)]">
                    <Sparkles size={12} strokeWidth={2.5} />
                    Most Popular
                  </span>
                )}

                <h3 className="text-lg font-bold text-[var(--ink-900)]">{plan.name}</h3>
                <p className="mt-1.5 text-sm text-[var(--ink-500)]">{plan.description}</p>

                <p className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tabular-nums text-[var(--ink-900)]">{plan.price}</span>
                  <span className="text-sm font-medium text-[var(--ink-400)]">/month</span>
                </p>

                <ul className="mt-7 flex-1 space-y-3">
                  {plan.features.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-[var(--ink-700)]">
                      <Check size={16} strokeWidth={2.5} className="shrink-0 text-[var(--accent-positive)]" />
                      {item}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={async () => {
                    try {
                      if (!hasSupabaseClient) {
                        window.location.href = "/login";
                        return;
                      }

                      const {
                        data: { session },
                      } = await supabase.auth.getSession();

                      if (!session) {
                        window.location.href = "/login";
                        return;
                      }

                      if (plan.name === "Free") {
                        window.location.href = "/dashboard";
                        return;
                      }

                      const res = await fetch("/api/stripe/checkout", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${session.access_token}`,
                        },
                        body: JSON.stringify({ plan: plan.name }),
                      });

                      const data = await res.json();

                      if (!res.ok) {
                        alert(data.error || "Checkout failed");
                        return;
                      }

                      window.location.href = data.url;
                    } catch (error: unknown) {
                      console.error(error);

                      if (error instanceof Error) {
                        alert(error.message);
                      } else {
                        alert("Unknown error");
                      }
                    }
                  }}
                  className={buttonClass({
                    tone: plan.featured ? "ai" : "neutral",
                    variant: plan.featured ? "solid" : "outline",
                    className: `mt-8 w-full ${plan.featured ? "shadow-[0_12px_28px_-10px_rgba(109,74,255,0.55)]" : ""}`,
                  })}
                >
                  {plan.name === "Free" ? "Continue Free" : "Get Started"}
                </button>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
