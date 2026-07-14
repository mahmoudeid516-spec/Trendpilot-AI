"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Props = {
  children: React.ReactNode;
};

export default function ProGate({ children }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState("Free");

  useEffect(() => {
    async function loadPlan() {
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
  }, []);

  async function handleUpgrade() {
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
      });

      const data = await response.json();

      if (data.url) {
        router.push(data.url);
      } else {
        alert("Unable to start checkout.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
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

  if (plan !== "Pro") {
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
          Upgrade to Pro - $29/month
        </button>

      </div>
    );
  }

  return <>{children}</>;
}