"use client";

import { supabase } from "../lib/supabase";
import { Check } from "lucide-react";
import { buttonClass } from "./ui/button";

export default function Pricing() {
    const hasSupabaseClient = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const plans = [
      {
        name: "Free",
        price: "$0",
        features: [
          "Limited Product Search",
          "Basic AI Analysis",
          "Community Support",
        ],
      },
      {
        name: "Pro",
        price: "$49",
        features: [
          "Unlimited Products",
          "Advanced AI Analysis",
          "Priority Support",
        ],
        featured: true,
      },
      {
        name: "Premium",
        price: "$99",
        features: [
          "Unlimited Everything",
          "Private API",
          "Dedicated Manager",
        ],
      },
    ];

    return (
      <section className="bg-[var(--surface-app)] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--ink-900)] sm:text-4xl">
              Pricing Plans
            </h1>

            <p className="mt-4 text-base text-[var(--ink-500)]">
              Choose the perfect plan for your business.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`tp-card flex flex-col p-8 ${
                  plan.featured ? "border-[var(--accent-ai)]/40 ring-1 ring-[var(--accent-ai)]/20" : ""
                }`}
              >
                <h3 className="text-lg font-bold text-[var(--ink-900)]">
                  {plan.name}
                </h3>

                <p className="mt-4 text-4xl font-extrabold text-[var(--ink-900)]">
                  {plan.price}
                  <span className="text-base font-medium text-[var(--ink-400)]">
                    /month
                  </span>
                </p>

                <ul className="mt-8 flex-1 space-y-3">
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
        body: JSON.stringify({
          plan: plan.name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Checkout failed");
        return;
      }

      window.location.href = data.url;
    }
    catch (error: unknown) {
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
    className: "mt-8 w-full",
  })}
>
  {plan.name === "Free" ? "Continue Free" : "Get Started"}
</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
