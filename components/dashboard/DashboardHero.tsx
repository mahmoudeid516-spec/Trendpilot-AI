"use client";

import { useEffect, useState } from "react";
import { getProfile } from "../../services/profile";

type Props = {
  totalProducts: number;
  winningProducts: number;
};

export default function DashboardHero({
  totalProducts,
  winningProducts,
}: Props) {
  const [name, setName] = useState("User");

  useEffect(() => {
    async function loadProfile() {
      const profile = await getProfile();

      if (profile?.full_name) {
        setName(profile.full_name);
      }
    }

    loadProfile();
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="mb-10">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700 p-10 shadow-2xl">

        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <span className="inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-purple-100">
            🔥 AI Powered Ecommerce Dashboard
            </span>

            <h1 className="mt-6 text-5xl font-extrabold leading-tight">
              Welcome back,
              <p className="mt-3 text-purple-200 text-lg">
  Ready to discover your next winning product?
</p>
              <br />
              <span className="text-yellow-300">{name}</span>
            </h1>

            <p className="mt-5 max-w-2xl text-lg text-purple-100">
              Discover winning products, generate AI marketing,
              analyze competitors and grow your Shopify business
              faster using artificial intelligence.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <div className="rounded-2xl bg-white/10 px-5 py-3 backdrop-blur">
                <p className="text-xs uppercase text-purple-200">
                  Today
                </p>

                <h3 className="font-bold">
                  {today}
                </h3>
              </div>

              <div className="rounded-2xl bg-white/10 px-5 py-3 backdrop-blur">
                <p className="text-xs uppercase text-purple-200">
                  AI Status
                </p>

                <h3 className="font-bold text-green-300">
                🟢 GPT + Market Scanner Active
                </h3>
              </div>

            </div>

          </div>

          <div className="grid grid-cols-2 gap-5">

            <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
              <p className="text-sm text-purple-200">
                Business Health
              </p>

              <h2 className="mt-2 text-5xl font-bold">
                92%
              </h2>

              <p className="mt-3 text-green-300 font-semibold">
                Excellent
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
              <p className="text-sm text-purple-200">
                AI Reports
              </p>

              <h2 className="mt-2 text-5xl font-bold">
              {totalProducts}
              </h2>

              <p className="mt-3 text-yellow-300 font-semibold">
                Generated
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
              <p className="text-sm text-purple-200">
                Winning Products
              </p>

              <h2 className="mt-2 text-5xl font-bold">
              {winningProducts}
              </h2>

              <p className="mt-3 text-cyan-300 font-semibold">
                Available
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
              <p className="text-sm text-purple-200">
                Success Rate
              </p>

              <div className="col-span-2 rounded-3xl bg-white/10 p-6 backdrop-blur">

  <p className="text-sm uppercase tracking-wider text-purple-200">
    Quick Actions
  </p>

  <div className="mt-5 flex flex-wrap gap-4">

    <button className="rounded-xl bg-white px-5 py-3 font-semibold text-purple-700 hover:bg-purple-100 transition">
      🔍 Find Products
    </button>

    <button className="rounded-xl bg-purple-500 px-5 py-3 font-semibold text-white hover:bg-purple-600 transition">
      🤖 Ask AI
    </button>

    <button className="rounded-xl bg-indigo-500 px-5 py-3 font-semibold text-white hover:bg-indigo-600 transition">
      📈 Analytics
    </button>

  </div>

</div>

              <h2 className="mt-2 text-5xl font-bold">
                96%
              </h2>

              <p className="mt-3 text-green-300 font-semibold">
                AI Optimized
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}