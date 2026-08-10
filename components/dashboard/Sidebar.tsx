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
      title: "Upgrade Pro",
      href: "/pricing",
      icon: Crown,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  const navContent = (
    <>
      <div className="p-8 border-b">
        <h1 className="text-3xl font-bold text-purple-700">
          TrendPilot AI
        </h1>

        <p className="text-gray-500 text-sm mt-2">
          AI Product Research
        </p>
      </div>

      <nav className="flex-1 p-5 space-y-2">

        {menu.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href;

          return (
            <Link
              key={item.title}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition
              ${
                active
                  ? "bg-purple-600 text-white"
                  : "text-gray-700 hover:bg-purple-100"
              }`}
            >
              <Icon size={20} />
              <span>{item.title}</span>
            </Link>
          );
        })}

      </nav>

      <div className="p-5 border-t">

      <button
  onClick={handleLogout}
  className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition"
>
          <LogOut size={18} />
          Logout
        </button>

      </div>
    </>
  );

  return (
    <>
      {/* Mobile/tablet top bar with menu button. Hidden on desktop where the
          persistent sidebar (below) is shown instead. */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b bg-white px-5 py-4 shadow-sm lg:hidden">
        <span className="text-xl font-bold text-purple-700">TrendPilot AI</span>

        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 hover:bg-purple-100"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile/tablet drawer + backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />

          <aside className="relative z-50 flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100"
            >
              <X size={20} />
            </button>

            {navContent}
          </aside>
        </div>
      )}

      {/* Desktop persistent sidebar */}
      <aside className="hidden w-72 shrink-0 flex-col border-r bg-white shadow-xl lg:flex lg:min-h-screen">
        {navContent}
      </aside>
    </>
  );
}
