"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { getProfile } from "../services/profile";

export default function Pricing() {
  const router = useRouter();
    const [currentPlan, setCurrentPlan] = useState<"Free" | "Pro" | "Premium" | "">("");
  const [processingPlan, setProcessingPlan] = useState<"Pro" | "Premium" | "">("");
  const [error, setError] = useState("");

    useEffect(() => {
      let cancelled = false;

      async function loadCurrentPlan() {
        try {
          const profile = await getProfile();
          const plan = profile?.plan;

          if (!cancelled && (plan === "Free" || plan === "Pro" || plan === "Premium")) {
            setCurrentPlan(plan);
          }
        } catch {
          if (!cancelled) {
            setCurrentPlan("");
          }
        }
      }

      void loadCurrentPlan();

      return () => {
        cancelled = true;
      };
    }, []);

    const plans = useMemo(() => [
      {
        name: "Free",
        price: "$0",
        ctaHref: "/register",
        ctaLabel: "Start Free",
        features: [
          "5 AI searches/day",
          "3 AI reports/day",
          "Basic Dashboard",
          "Community Support",
        ],
      },
      {
        name: "Pro",
        price: "$49",
        ctaHref: "/pricing",
        ctaLabel: "Choose Pro",
        features: [
          "Unlimited AI Searches",
          "Unlimited AI Reports",
          "Competitor Analysis",
          "Trend Prediction",
          "Marketing Generator",
          "Export Reports",
          "Priority Support",
        ],
      },
      {
        name: "Premium",
        price: "$99",
        ctaHref: "/pricing",
        ctaLabel: "Choose Premium",
        features: [
          "Everything in Pro",
          "Team Workspaces",
          "API Access",
          "White Label Reports",
          "Advanced Forecasting",
          "Premium Support",
        ],
      },
    ], []);

    async function handlePaidPlanCheckout(plan: "Pro" | "Premium") {
      try {
        setError("");
        setProcessingPlan(plan);

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          router.push("/login?redirectedFrom=/pricing");
          return;
        }

        const response = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ plan }),
        });

        const data = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;

        if (!response.ok || !data?.url) {
          throw new Error(data?.error || "Failed to start checkout.");
        }

        window.location.assign(data.url);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to start checkout.");
        setProcessingPlan("");
      }
    }
  
    return (
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold">
              Pricing Plans
            </h2>
  
            <p className="mt-4 text-xl text-gray-500">
              Choose the perfect plan for your business.
            </p>

            {error ? (
              <p className="mx-auto mt-5 max-w-xl rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
                {error}
              </p>
            ) : null}
          </div>
  
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="bg-white rounded-3xl shadow-xl p-8"
              >
                <h3 className="text-2xl font-bold">
                  {plan.name}
                </h3>
  
                <p className="text-5xl font-bold text-purple-600 mt-6">
                  {plan.price}
                  <span className="text-lg text-gray-400">
                    /month
                  </span>
                </p>
  
                <ul className="mt-8 space-y-4">
                  {plan.features.map((item) => (
                    <li key={item}>
                      ✅ {item}
                    </li>
                  ))}
                </ul>

                {currentPlan === plan.name ? (
                  <span className="mt-8 inline-flex w-full items-center justify-center bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold">
                    Current Plan
                  </span>
                ) : plan.name === "Pro" || plan.name === "Premium" ? (
                  <button
                    type="button"
                    onClick={() => void handlePaidPlanCheckout(plan.name as "Pro" | "Premium")}
                    disabled={processingPlan === (plan.name as "Pro" | "Premium")}
                    className="mt-8 inline-flex w-full items-center justify-center bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {processingPlan === plan.name ? "Redirecting..." : plan.ctaLabel}
                  </button>
                ) : (
                  <Link
                    href={plan.ctaHref}
                    className="mt-8 inline-flex w-full items-center justify-center bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition"
                  >
                    {plan.ctaLabel}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }