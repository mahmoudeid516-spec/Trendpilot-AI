"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  Crown,
  Dot,
  Radar,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { getProfile } from "../../services/profile";

function toDisplayName(value: string): string {
  const cleaned = value.trim();
  if (!cleaned) {
    return "";
  }

  if (cleaned.includes("@")) {
    return cleaned;
  }

  return cleaned
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export default function DashboardHero() {
  const [name, setName] = useState("");
  const [planLabel, setPlanLabel] = useState("Free Plan");
  const [today, setToday] = useState("--");
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const profile = await getProfile();
        const displayName = profile?.full_name?.trim()
          || profile?.email?.trim()
          || "";
        const plan = profile?.plan || "Free";

        const now = new Date();
        const nextGreeting = now.getHours() < 12
          ? "Good morning"
          : now.getHours() < 18
            ? "Good afternoon"
            : "Good evening";
        const nextDate = now.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        });

        if (!cancelled) {
          setName(toDisplayName(displayName));
          setPlanLabel(`${plan} Plan`);
          setGreeting(nextGreeting);
          setToday(nextDate);
        }
      } catch {
        if (!cancelled) {
          setName("");
          setPlanLabel("Free Plan");
          setGreeting("Welcome back");
          setToday("--");
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const firstName = name ? (name.includes("@") ? name : (name.split(" ")[0] || "there")) : "there";

  const quickActions = [
    { label: "Analyze Product", icon: Target },
    { label: "Generate Report", icon: Zap },
    { label: "Forecast Trend", icon: TrendingUp },
  ];

  const recentSearches = [
    "portable blender low competition",
    "beauty tools under $35 high margin",
    "pet cleaning accessories US market",
  ];

  return (
    <section>
      <motion.div
        className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_6%,rgba(99,102,241,0.09),transparent_30%)]" />

        <div className="relative z-10 grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-8">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              <span className="inline-flex items-center gap-1 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-indigo-700">
                <Sparkles size={13} />
                Executive workspace
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-emerald-700">
                <Activity size={13} />
                AI status online
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              {greeting}, {firstName}
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Your product intelligence workspace is ready. The current market signal favors utility-driven products with medium competition and strong margin spread.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Current plan</p>
                <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Crown size={14} className="text-amber-500" />
                  {planLabel}
                </p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Search quota</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">71%</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full w-[71%] rounded-full bg-indigo-500" />
                </div>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">AI confidence</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">96%</p>
                <p className="mt-1 text-xs text-emerald-700">Signal quality above benchmark</p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Today</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{today}</p>
                <p className="mt-1 text-xs text-slate-500">Peak demand window: 4pm to 10pm</p>
              </article>
            </div>

            <div className="mt-6 grid gap-3 lg:grid-cols-2">
              <article className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Today&apos;s insights</p>
                <div className="mt-2 space-y-2 text-sm text-slate-700">
                  <p className="inline-flex items-center gap-2"><Dot className="h-4 w-4 text-indigo-500" /> Portable kitchen tools continue strong conversion.</p>
                  <p className="inline-flex items-center gap-2"><Dot className="h-4 w-4 text-indigo-500" /> UK competition dropped in hydration accessories.</p>
                  <p className="inline-flex items-center gap-2"><Dot className="h-4 w-4 text-indigo-500" /> Margin opportunity is highest in bundle-ready products.</p>
                </div>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Quick actions</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {quickActions.map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.label}
                        type="button"
                        className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                      >
                        <Icon size={13} />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </article>
            </div>
          </div>

          <div className="xl:col-span-4">
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Recent searches</p>

              {recentSearches.map((query) => (
                <button
                  key={query}
                  type="button"
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <span className="line-clamp-1">{query}</span>
                  <Search className="h-4 w-4 shrink-0" />
                </button>
              ))}

              <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-3">
                <p className="text-xs font-semibold text-indigo-700">AI status</p>
                <p className="mt-1 text-sm text-indigo-800">Live crawling active across Shopify, Amazon and TikTok Shop.</p>
              </div>

              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                Open full insight feed
                <ArrowUpRight size={14} />
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <article className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Opportunity score</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">94</p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Market radar</p>
                <p className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                  <Radar size={14} />
                  Stable
                </p>
              </article>

              <article className="col-span-2 rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Today&apos;s opportunity</p>
                <p className="mt-1 text-sm text-slate-700">
                  Portable blender category shows $22 average margin advantage with reduced ad CPM in US and UK this morning.
                </p>
              </article>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}