"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
  console.error("ERROR:", error);
  console.error("MESSAGE:", error.message);
  console.error("STACK:", error.stack);
}, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">
          Something went wrong
        </h1>

        <p className="mt-3 text-slate-400">
          Please try again.
        </p>

        <button
          onClick={reset}
          className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}