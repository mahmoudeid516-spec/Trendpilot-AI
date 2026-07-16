"use client";

import { useState } from "react";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    description: "Perfect for beginners to start testing.",
    features: ["3 Product Searches/day", "Basic Analytics", "Community Support"],
    buttonText: "Get Started",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$49",
    description: "Best for growing your online store.",
    features: ["Unlimited Searches", "AI-Powered Insights", "Trending Alerts", "Priority Support"],
    buttonText: "Go Pro",
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "$99",
    description: "For scaling businesses & agencies.",
    features: ["Everything in Pro", "Instant Fresh 🔥", "Advanced ROI Tracking", "Dedicated Success Manager"],
    buttonText: "Unlock Premium",
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
        headers: { "Content-Type": "application/json" },
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
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Simple, Transparent Pricing</h2>
          <p className="text-gray-600 text-lg">Choose the plan that fits your business needs.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`p-8 rounded-3xl border ${plan.popular ? "border-indigo-600 shadow-2xl scale-105" : "border-gray-200"}`}
            >
              {plan.popular && (
                <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  Most Popular
                </span>
              )}
              <h3 className="text-2xl font-bold mt-4">{plan.name}</h3>
              <div className="my-6">
                <span className="text-5xl font-extrabold">{plan.price}</span>
                <span className="text-gray-500">/mo</span>
              </div>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold transition-all ${
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
      </div>
    </section>
  );
}