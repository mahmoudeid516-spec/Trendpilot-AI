"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    async function continueToDashboard() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      setTimeout(() => {
        router.push("/dashboard");
      }, 2500);
    }

    void continueToDashboard();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg text-center">

        <h1 className="text-5xl font-bold text-green-600">
          🎉 Payment Successful
        </h1>

        <p className="mt-6 text-lg text-gray-700">
          Activating your subscription and syncing your billing status...
        </p>

      </div>
    </div>
  );
}