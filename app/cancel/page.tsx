"use client";

import { useRouter } from "next/navigation";

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white">

      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-xl text-center">

        <div className="text-6xl">
          ❌
        </div>

        <h1 className="mt-6 text-4xl font-bold text-red-600">
          Payment Cancelled
        </h1>

        <p className="mt-6 text-lg text-gray-600">
          Your subscription has not been activated.
        </p>

        <p className="mt-3 text-gray-500">
          You can try again anytime.
        </p>

        <button
          onClick={() => router.push("/dashboard")}
          className="mt-8 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-bold transition"
        >
          Back to Dashboard
        </button>

      </div>

    </div>
  );
}