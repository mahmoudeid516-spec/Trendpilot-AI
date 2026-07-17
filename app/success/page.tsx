"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function SuccessPage() {
  const router = useRouter();

  const [status, setStatus] = useState(
    "Payment received. Finalizing subscription activation..."
  );

  useEffect(() => {
    async function checkSessionAndContinue() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.replace("/login");
          return;
        }

        setStatus(
          "Subscription activation is in progress. You can continue to your dashboard."
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
  }, [router]);

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