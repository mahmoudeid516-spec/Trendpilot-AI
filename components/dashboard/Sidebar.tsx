"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import {
  LayoutDashboard,
  Sparkles,
  BarChart3,
  ShoppingBag,
  Settings,
  Crown,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout failed:", error.message);
    }

    router.push("/login");
  }

  const menu = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "AI Analyzer", href: "/dashboard", icon: Sparkles },
    { title: "Products", href: "/products", icon: ShoppingBag },
    { title: "Analytics", href: "/analytics", icon: BarChart3 },
    { title: "Settings", href: "/settings", icon: Settings },
  ];

  const brand = (
    <Link href="/dashboard" className="flex items-center gap-2.5 px-6 py-6" onClick={() => setMobileOpen(false)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-ai)] text-sm font-bold text-white">
        T
      </span>
      <span className="text-[15px] font-semibold tracking-tight text-[var(--ink-900)]">
        TrendPilot <span className="text-[var(--accent-ai)]">AI</span>
      </span>
    </Link>
  );

  const navContent = (
    <>
      {brand}

      <nav className="flex-1 space-y-0.5 px-3">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.title}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-[var(--accent-ai-soft)] text-[var(--accent-ai)]"
                  : "text-[var(--ink-500)] hover:bg-[var(--surface-muted)] hover:text-[var(--ink-900)]"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-[var(--accent-ai)]" />
              )}
              <Icon size={18} strokeWidth={2} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-3">
        <Link
          href="/pricing"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 rounded-lg border border-[var(--accent-warning)]/25 bg-[var(--accent-warning-soft)] px-3 py-2.5 text-sm font-semibold text-[var(--accent-warning)] transition-colors hover:border-[var(--accent-warning)]/40"
        >
          <Crown size={18} strokeWidth={2} />
          Upgrade to Pro
        </Link>
      </div>

      <div className="border-t border-[var(--border-subtle)] px-3 py-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--ink-500)] transition-colors hover:bg-[var(--accent-risk-soft)] hover:text-[var(--accent-risk)]"
        >
          <LogOut size={18} strokeWidth={2} />
          Log out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile/tablet top bar with menu button. Hidden on desktop where the
          persistent sidebar (below) is shown instead. */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--surface-card)]/90 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent-ai)] text-xs font-bold text-white">
            T
          </span>
          <span className="text-sm font-semibold text-[var(--ink-900)]">TrendPilot AI</span>
        </Link>

        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
          className="flex h-11 w-11 items-center justify-center rounded-lg text-[var(--ink-700)] hover:bg-[var(--surface-muted)]"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile/tablet drawer + backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />

          <aside className="relative z-50 flex h-full w-72 max-w-[85vw] flex-col bg-[var(--surface-card)] shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-lg text-[var(--ink-500)] hover:bg-[var(--surface-muted)]"
            >
              <X size={20} />
            </button>

            {navContent}
          </aside>
        </div>
      )}

      {/* Desktop persistent sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--border-subtle)] bg-[var(--surface-card)] lg:flex lg:min-h-screen">
        {navContent}
      </aside>
    </>
  );
}
