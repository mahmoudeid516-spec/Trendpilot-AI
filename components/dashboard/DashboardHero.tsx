"use client";

import { useEffect, useState } from "react";
import { getProfile } from "../../services/profile";
import MetricTile from "../ui/MetricTile";

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
    <section className="tp-card overflow-hidden">
      {/* A single thin accent bar carries the "AI" identity instead of a
          full gradient banner -- the rest of the header is a plain,
          scannable product surface. */}
      <div className="h-1 bg-gradient-to-r from-[var(--accent-ai)] via-[var(--accent-data)] to-[var(--accent-positive)]" />

      <div className="flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">

        <div className="min-w-0">
          <p className="text-sm text-[var(--ink-500)]">{today}</p>

          <h1 className="mt-1 break-words text-2xl font-bold tracking-tight text-[var(--ink-900)] sm:text-3xl">
            Welcome back, {name}
          </h1>

          <p className="mt-2 max-w-xl text-sm text-[var(--ink-500)]">
            Here&apos;s how your product research is performing today.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--accent-positive)]/25 bg-[var(--accent-positive-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-positive)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-positive)]" />
            AI systems online
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-[var(--border-subtle)] pt-6 sm:grid-cols-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <MetricTile label="Business Health" value="92%" tone="positive" hint="Excellent" />
          <MetricTile label="AI Reports" value={totalProducts} tone="ai" hint="Generated" />
          <MetricTile label="Winning Products" value={winningProducts} tone="data" hint="Available" />
          <MetricTile label="Success Rate" value="96%" tone="positive" hint="AI optimized" />
        </div>

      </div>
    </section>
  );
}
