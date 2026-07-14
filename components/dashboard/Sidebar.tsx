"use client";

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
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const router = useRouter();

  async function handleLogout() {
    console.log("Logout Clicked");
  
    const { error } = await supabase.auth.signOut();
  
    console.log(error);
  
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

  return (
    <aside className="w-72 bg-white shadow-xl border-r min-h-screen flex flex-col">

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

    </aside>
  );
}