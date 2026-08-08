"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { getProfile } from "../../services/profile";

// "Today" depends on the reader's local timezone, so the server (running
// in its own timezone) and the client can legitimately disagree on what
// today's date is -- rendering it directly during render is what causes
// React's hydration mismatch here. useSyncExternalStore is the React
// primitive built for exactly this: getServerSnapshot supplies a
// deterministic placeholder for the SSR pass and React's first client
// render (so hydration never mismatches), then the real client-local
// date is swapped in immediately after.
function subscribeNever() {
  return () => {};
}

function getTodayLabel() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function getServerTodayLabel() {
  return null;
}

function useTodayLabel() {
  return useSyncExternalStore(
    subscribeNever,
    getTodayLabel,
    getServerTodayLabel
  );
}

type Props = {
  totalProducts: number;
  winningProducts: number;
  avgOpportunityScore?: number | null;
  avgWinningProbability?: number | null;
};

export default function DashboardHero({
  totalProducts,
  winningProducts,
  avgOpportunityScore = null,
  avgWinningProbability = null,
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

  const today = useTodayLabel();

  return (
    <section className="mb-10">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700 p-10 shadow-2xl">

        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <span className="inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-purple-100">
              🚀 TrendPilot AI Dashboard
            </span>

            <h1 className="mt-6 text-5xl font-extrabold leading-tight">
              Welcome back,
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
                  {today ?? " "}
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

          <div className="grid grid-cols-2 gap-5">

            <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
              <p className="text-sm text-purple-200">
                Avg Opportunity Score
              </p>

              <h2 className="mt-2 text-5xl font-bold">
                {avgOpportunityScore === null ? "N/A" : `${avgOpportunityScore}%`}
              </h2>

              <p className="mt-3 text-green-300 font-semibold">
                {avgOpportunityScore === null
                  ? "No saved products yet"
                  : "Across saved products"}
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
              <p className="text-sm text-purple-200">
                Saved Products
              </p>

              <h2 className="mt-2 text-5xl font-bold">
              {totalProducts}
              </h2>

              <p className="mt-3 text-yellow-300 font-semibold">
                {totalProducts === 0 ? "No data available" : "In your library"}
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
                {winningProducts === 0 ? "No data available" : "Opportunity Score ≥ 90"}
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
              <p className="text-sm text-purple-200">
                Avg Win Probability
              </p>

              <h2 className="mt-2 text-5xl font-bold">
                {avgWinningProbability === null ? "N/A" : `${avgWinningProbability}%`}
              </h2>

              <p className="mt-3 text-green-300 font-semibold">
                {avgWinningProbability === null
                  ? "No saved products yet"
                  : "Across saved products"}
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}