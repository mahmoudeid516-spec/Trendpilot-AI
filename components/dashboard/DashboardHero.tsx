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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700 p-6 shadow-2xl sm:p-10">

        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">

          <div className="min-w-0">

            <span className="inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-purple-100">
              🚀 TrendPilot AI Dashboard
            </span>

            <h1 className="mt-6 break-words text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              Welcome back,
              <br />
              <span className="text-yellow-300">{name}</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base text-purple-100 sm:text-lg">
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
                  ● Online
                </h3>
              </div>

            </div>

          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5">

            <div className="min-w-0 rounded-3xl bg-white/10 p-4 backdrop-blur sm:p-6">
              <p className="text-sm text-purple-200">
                Business Health
              </p>

              <h2 className="mt-2 text-3xl font-bold sm:text-5xl">
                92%
              </h2>

              <p className="mt-3 text-green-300 font-semibold">
                Excellent
              </p>
            </div>

            <div className="min-w-0 rounded-3xl bg-white/10 p-4 backdrop-blur sm:p-6">
              <p className="text-sm text-purple-200">
                AI Reports
              </p>

              <h2 className="mt-2 text-3xl font-bold sm:text-5xl">
              {totalProducts}
              </h2>

              <p className="mt-3 text-yellow-300 font-semibold">
                Generated
              </p>
            </div>

            <div className="min-w-0 rounded-3xl bg-white/10 p-4 backdrop-blur sm:p-6">
              <p className="text-sm text-purple-200">
                Winning Products
              </p>

              <h2 className="mt-2 text-3xl font-bold sm:text-5xl">
              {winningProducts}
              </h2>

              <p className="mt-3 text-cyan-300 font-semibold">
                Available
              </p>
            </div>

            <div className="min-w-0 rounded-3xl bg-white/10 p-4 backdrop-blur sm:p-6">
              <p className="text-sm text-purple-200">
                Success Rate
              </p>

              <h2 className="mt-2 text-3xl font-bold sm:text-5xl">
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