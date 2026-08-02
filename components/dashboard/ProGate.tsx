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
      <div className="mt-8 rounded-3xl border border-white/70 bg-white/88 p-8 text-slate-700 shadow-[0_24px_65px_-45px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <p className="text-sm font-medium text-slate-600">
          Checking your subscription...
        </p>
      </div>
    );
  }

  if (plan !== "Pro" && plan !== "Premium") {
    return (
      <div className="mt-8 rounded-3xl border border-violet-300/30 bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#06B6D4] p-10 text-white shadow-[0_30px_90px_-40px_rgba(124,58,237,0.75)]">

        <h2 className="text-3xl font-black tracking-tight">
          🔒 Pro Feature
        </h2>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/90">
          Upgrade to Pro to unlock AI Analyzer,
          Product Research, AI Marketing,
          Sales Forecast and all premium tools.
        </p>

        <Link
          href="/"
          className="mt-8 inline-block rounded-2xl bg-white px-8 py-3 text-sm font-bold text-violet-700 shadow-lg transition hover:-translate-y-0.5"
        >
          Upgrade to Pro
        </Link>

      </div>
    );
  }

  return <>{children}</>;
}