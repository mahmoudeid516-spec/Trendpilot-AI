"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  FileSearch,
  Gauge,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Sparkles,
  BarChart3,
  ShoppingBag,
  Settings,
  Crown,
  Zap,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
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

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [subtitle, setSubtitle] = useState("Member account");
  const [planLabel, setPlanLabel] = useState("Free");

  const avatarFallback = useMemo(() => {
    const sourceName = displayName || subtitle || "Member";
    const tokens = sourceName.trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) {
      return "U";
    }

    if (tokens.length === 1) {
      return tokens[0].slice(0, 2).toUpperCase();
    }

    return `${tokens[0][0] ?? ""}${tokens[1][0] ?? ""}`.toUpperCase();
  }, [displayName, subtitle]);

  useEffect(() => {
    let cancelled = false;

    async function loadIdentity() {
      try {
        const profile = await getProfile();
        const fullName = profile?.full_name?.trim();
        const email = profile?.email?.trim();
        const nextName = fullName || email || "";
        const nextPlan = profile?.plan || "Free";

        if (!cancelled) {
          setDisplayName(toDisplayName(nextName));
          setPlanLabel(nextPlan);
          setSubtitle(email || "Member account");
        }
      } catch {
        if (!cancelled) {
          setDisplayName("");
          setPlanLabel("Free");
          setSubtitle("Member account");
        }
      }
    }

    void loadIdentity();

    return () => {
      cancelled = true;
    };
  }, []);

  const menu = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "AI Analyzer",
      href: "/dashboard",
      icon: Sparkles,
    },
    {
      title: "Products",
      href: "/products",
      icon: ShoppingBag,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart3,
    },
    {
      title: "Reports",
      href: "/dashboard/reports",
      icon: FileSearch,
    },
    {
      title: "Upgrade",
      href: "/pricing",
      icon: Crown,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
    {
      title: "Billing",
      href: "/dashboard/billing",
      icon: Crown,
    },
  ];

  async function handleLogout() {
    try {
      setLoggingOut(true);
      setLogoutError("");

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      router.replace("/login?logout=success");
      router.refresh();
    } catch (error) {
      setLoggingOut(false);
      setLogoutError(error instanceof Error ? error.message : "Logout failed. Please try again.");
    }
  }

  return (
    <aside className={`sticky top-0 hidden h-screen shrink-0 p-4 lg:block ${collapsed ? "w-[104px]" : "w-[308px]"}`}>
      <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-indigo-100/35 bg-[linear-gradient(180deg,rgba(15,23,42,0.95)_0%,rgba(15,23,42,0.88)_100%)] shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.18),transparent_42%)]" />

        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-indigo-200/20 bg-slate-900/70 text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <div className="relative border-b border-indigo-100/15 px-5 pb-5 pt-6">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-200/20 bg-indigo-500/20 text-indigo-100">
              <Zap size={20} />
            </div>
            {!collapsed ? (
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-50">TrendPilot AI</h1>
                <p className="text-xs font-medium text-slate-400">Executive workspace</p>
              </div>
            ) : null}
          </div>

          {!collapsed ? (
            <div className="mt-4 rounded-2xl border border-indigo-100/20 bg-slate-900/50 p-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Current plan</p>
                <span className="rounded-full border border-indigo-200/20 bg-indigo-400/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-indigo-100">
                  {planLabel}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-300">71% search quota remaining</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-700/80">
                <div className="h-full w-[71%] rounded-full bg-indigo-400" />
              </div>
            </div>
          ) : null}
        </div>

        <nav className="relative flex-1 space-y-2 p-4">

        {menu.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300
              ${
                active
                  ? "border border-indigo-200/20 bg-indigo-400/15 text-slate-100"
                  : "border border-transparent text-slate-300 hover:border-indigo-100/15 hover:bg-slate-800/80 hover:text-white"
              }`}
              title={item.title}
            >
              {active ? <span className="absolute left-1 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-indigo-300" /> : null}
              <Icon size={18} />
              {!collapsed ? <span>{item.title}</span> : null}
            </Link>
          );
        })}

      </nav>

      <div className="relative border-t border-indigo-100/15 p-4">
        {!collapsed ? (
          <div className="mb-4 rounded-2xl border border-indigo-100/15 bg-slate-900/45 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Search progress</p>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-300">
              <Gauge size={14} />
              29 of 100 analyses used
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-700/80">
              <div className="h-full w-[29%] rounded-full bg-emerald-400" />
            </div>

            <Link
              href="/pricing"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200/20 bg-indigo-500/20 px-3 py-2 text-xs font-semibold text-indigo-100 transition hover:bg-indigo-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
            >
              <Crown size={14} />
              Upgrade plan
            </Link>
          </div>
        ) : null}

        <div className={`mb-3 flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-indigo-200/20 bg-indigo-400/10 text-[11px] font-semibold text-indigo-100">
            {avatarFallback ? avatarFallback : <CircleUserRound size={18} />}
          </div>
          {!collapsed ? (
            <div>
              <p className="text-sm font-semibold text-slate-100">{displayName || subtitle || "Member"}</p>
              <p className="text-xs text-slate-400">{subtitle}</p>
            </div>
          ) : null}
        </div>

        {!collapsed && logoutError ? (
          <p className="mb-3 rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
            {logoutError}
          </p>
        ) : null}

        <button
          type="button"
          onClick={() => void handleLogout()}
          disabled={loggingOut}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-100/20 bg-slate-900/70 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200 transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loggingOut ? <LoaderCircle size={14} className="animate-spin" /> : <LogOut size={14} />}
          {!collapsed ? (loggingOut ? "Logging Out..." : "Logout") : null}
        </button>

        </div>
      </div>
    </aside>
  );
}