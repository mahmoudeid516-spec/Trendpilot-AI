"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "../../types/Product";

type Props = {
  product: Product;
};

export default function AIMarketing({ product }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function generateMarketing() {
    setLoading(true);

    try {
      const res = await fetch("/api/generate_marketing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: product.id,
        }),
      });

      const data = await res.json();

      console.log(data);

      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }

    setLoading(false);
  }

  return (
    <section className="mt-12 bg-white rounded-3xl shadow p-8">

      <h2 className="text-3xl font-bold mb-6">
        🚀 AI Marketing Generator
      </h2>

      <button
        onClick={generateMarketing}
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-xl font-bold"
      >
        {loading ? "Generating..." : "✨ Generate AI Marketing"}
      </button>

    </section>
  );
}