"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    async function activatePlan() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
  .from("profiles")
  .update({
    plan: "Pro",
    subscription_status: "active",
  })
  .eq("id", session.user.id)
  .select();

  console.log("Session User ID:", session.user.id);
  console.log("Session Email:", session.user.email);
  console.log("Updated:", data);
  console.error("Update Error:", error);

      setTimeout(() => {
        router.push("/dashboard");
      }, 2500);
    }

    activatePlan();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg text-center">

        <h1 className="text-5xl font-bold text-green-600">
          🎉 Payment Successful
        </h1>

        <p className="mt-6 text-lg text-gray-700">
          Activating your Pro subscription...
        </p>

      </div>
    </div>
  );
}