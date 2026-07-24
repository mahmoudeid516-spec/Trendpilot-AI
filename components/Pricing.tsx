"use client";


import { useState } from "react";

const plans = [
  {
    id: "free",
    name: "free",
    price: "$0",
    description: "Start for free and upgrade anytime.",
    features: [
      "14-Day Free Trial",
      "Analyze up to 50 Products",
      "20 Product Searches",
      "AI Product Scores",
      "Basic Analytics",
      "ROI Calculator",
    ],
    buttonText: "Get Started Free",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$49",
    description: "Perfect for serious Shopify & TikTok sellers.",
    features: [
      "500 Products / Month",
      "Unlimited Searches",
      "AI-Powered Insights",
      "Trend Alerts",
      "Export CSV",
      "Priority Support",
      "14-Day Free Trial Included",
    ],
    buttonText: "Start 14-Day Free Trial",
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "$99",
    description: "Built for agencies and high-volume sellers.",
    features: [
      "Unlimited Products",
      "Unlimited AI Analysis",
      "Unlimited Searches",
      "Instant Fresh 🔥",
      "Advanced ROI Tracking",
      "Dedicated Success Manager",
      "14-Day Free Trial Included",
    ],
    buttonText: "Start 14-Day Free Trial",
    popular: false,
  },
];

export default function Pricing() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (planId: string) => {
    if (planId === "free") {
      window.location.href = "/dashboard";
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId }),
      });

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Subscription Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Choose Your Growth Plan
          </h2>

          <p className="text-gray-600 text-lg">
          Start free today and upgrade only when you're ready to scale.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-8 rounded-3xl border transition-all duration-500 hover:-translate-y-2 ${
                plan.popular
                  ? "border-indigo-600 bg-gradient-to-b from-indigo-50 via-white to-white shadow-2xl shadow-indigo-500/20 scale-110"
                  : "border-gray-200 bg-white hover:shadow-2xl hover:border-indigo-300"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  Most Popular
                </span>
              )}

              {plan.id === "free" && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  New Users Start Here
                </span>
              )}

              <h3 className="text-2xl font-bold mt-6">{plan.name}</h3>

              <div className="my-6">
                <span className="text-5xl font-extrabold">
                  {plan.price}
                </span>

                {plan.id !== "free" && (
                  <span className="text-gray-500">/mo</span>
                )}
              </div>

              <p className="text-gray-600 mb-6">{plan.description}</p>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center text-gray-700"
                  >
                    <svg
                      className="w-5 h-5 text-indigo-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>

                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 ${
                  plan.popular
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                {loading ? "Processing..." : plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-gray-200 bg-gray-50 p-8">
          <div className="grid gap-8 md:grid-cols-4 text-center">
            <div>
              <div className="text-3xl">🔒</div>
              <h4 className="mt-2 font-bold">Secure Payments</h4>
              <p className="text-sm text-gray-500">
                Powered securely by Stripe
              </p>
            </div>

            <div>
              <div className="text-3xl">✅</div>
              <h4 className="mt-2 font-bold">No Setup Fees</h4>
              <p className="text-sm text-gray-500">
                Start instantly with no hidden costs.
              </p>
            </div>

            <div>
              <div className="text-3xl">⏱️</div>
              <h4 className="mt-2 font-bold">14-Day Free Trial</h4>
              <p className="text-sm text-gray-500">
                Available for Pro & Premium plans.
              </p>
            </div>

            <div>
              <div className="text-3xl">❌</div>
              <h4 className="mt-2 font-bold">Cancel Anytime</h4>
              <p className="text-sm text-gray-500">
                No contracts. No commitments.
              </p>
            </div>
            </div>
        </div>

        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
          <div>🔒 Secure payments with Stripe</div>
          <div>✅ Cancel anytime</div>
          <div>⚡ Instant account activation</div>
          <div>⭐ Trusted by eCommerce sellers</div>
        </div>
    
    </section>
  );
}