"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type Props = {
  children: React.ReactNode;
};

export default function ProGate({ children }: Props) {
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
        .maybeSingle();

      if (data?.plan) {
        setPlan(data.plan);
      }

      setLoading(false);
    }

    void loadPlan();
  }, []);

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
          Upgrade to Pro to unlock AI Analyzer,
          Product Research, AI Marketing,
          Sales Forecast and all premium tools.
        </p>

        <Link
          href="/"
          className="inline-block mt-8 bg-white text-purple-700 px-8 py-4 rounded-xl font-bold"
        >
          Upgrade to Pro
        </Link>

      </div>
    );
  }

  return <>{children}</>;
}