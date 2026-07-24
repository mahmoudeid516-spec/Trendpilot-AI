"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hasSupabaseConfig, supabase } from "../../lib/supabase";

export default function SuccessPage() {
  const router = useRouter();
  const isSupabaseConfigured = hasSupabaseConfig();

  const [status, setStatus] = useState(
    "Payment received. Finalizing subscription activation..."
  );

  useEffect(() => {
    async function checkSessionAndContinue() {
      try {
        if (!isSupabaseConfigured) {
          setStatus(
            "Subscription was created, but profile verification is unavailable in this environment."
          );

          setTimeout(() => {
            router.replace("/dashboard");
          }, 2000);

          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.replace("/login");
          return;
        }

        for (let attempt = 0; attempt < 6; attempt += 1) {
          const { data, error } = await supabase
            .from("profiles")
            .select("plan, subscription_status")
            .eq("id", session.user.id)
            .single();

          if (!error && data?.subscription_status === "active") {
            setStatus(`Subscription activated: ${data.plan}. Redirecting to dashboard...`);
            setTimeout(() => {
              router.replace("/dashboard");
            }, 1200);
            return;
          }

          setStatus("Subscription activation is still processing. This usually takes a few seconds...");

          await new Promise((resolve) => {
            setTimeout(resolve, 1000);
          });
        }

        setStatus(
          "Payment succeeded. Activation may still be processing; you can continue to your dashboard now."
        );

        setTimeout(() => {
          router.replace("/dashboard");
        }, 2000);

      } catch (error) {
        console.error(error);
        setStatus("Unexpected error.");
      }
    }

    checkSessionAndContinue();
  }, [isSupabaseConfigured, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">

      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-xl text-center">

        <div className="text-6xl">
          🎉
        </div>

        <h1 className="mt-6 text-4xl font-bold text-green-600">
          Welcome to TrendPilot Pro
        </h1>

        <p className="mt-6 text-lg text-gray-600">
          {status}
        </p>

      </div>

    </div>
  );
}