"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Props = {
  children: React.ReactNode;
};

export default function ProGate({ children }: Props) {
  const router = useRouter();
  const hasSupabaseClient = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState("Free");

  useEffect(() => {
    async function loadPlan() {
      if (!hasSupabaseClient) {
        setLoading(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", session.user.id)
        .single();

      if (data?.plan) {
        setPlan(data.plan);
      }

      setLoading(false);
    }

    loadPlan();
  }, [hasSupabaseClient]);

  async function handleUpgrade() {
    try {
      if (!hasSupabaseClient) {
        router.push("/login");
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          plan: "Pro",
        }),
      });

      const data = await response.json();

      if (data.success && data.data?.url) {
        window.location.href = data.data.url;
      } else {
        alert(data.error?.message ?? "Unable to start checkout.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  }

  async function handleManageSubscription() {
    try {
      if (!hasSupabaseClient) {
        router.push("/login");
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/stripe/manage-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (data.success && data.data?.url) {
        window.location.href = data.data.url;
      } else {
        alert(data.error?.message ?? "Unable to open billing settings.");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to open billing settings.");
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
        <p className="text-gray-500">
          Checking your subscription...
        </p>
      </div>
    );
  }

  if (plan !== "Pro" && plan !== "Premium") {
    return (
      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 rounded-3xl text-white p-10 mt-8">

        <h2 className="text-3xl font-bold">
          🔒 Pro Feature
        </h2>

        <p className="mt-4 text-purple-100">
          Upgrade to Pro to unlock:
        </p>

        <ul className="mt-6 space-y-2 text-purple-100">
          <li>✅ Unlimited Product Search</li>
          <li>✅ AI Product Analyzer</li>
          <li>✅ AI Marketing Generator</li>
          <li>✅ Sales Forecast</li>
          <li>✅ Winning Product Reports</li>
          <li>✅ Future Premium Features</li>
        </ul>

        <button
          onClick={handleUpgrade}
          className="mt-8 bg-white text-purple-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition"
        >
          Upgrade to Pro - $49/month
        </button>

      </div>
    );
  }

  if (plan === "Pro" || plan === "Premium") {
    return (
      <>
        <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>
              You are on the <strong>{plan}</strong> plan.
            </p>

            <button
              onClick={handleManageSubscription}
              className="rounded-xl bg-white px-4 py-2 font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-100"
            >
              Manage Subscription
            </button>
          </div>
        </div>

        {children}
      </>
    );
  }

  return <>{children}</>;
}