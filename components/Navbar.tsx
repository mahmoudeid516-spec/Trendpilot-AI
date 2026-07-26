"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Navbar() {
  const links = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Login", href: "/login" },
  ];

  return (
    <motion.nav
      className="fixed inset-x-0 top-4 z-50 px-4 sm:top-6 sm:px-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-[rgba(15,23,42,0.72)] px-4 py-3 shadow-[0_20px_60px_-28px_rgba(124,58,237,0.85)] backdrop-blur-xl sm:px-6">
        <motion.div
          className="relative"
          whileHover={{ scale: 1.02 }}
        >
          <div className="pointer-events-none absolute -left-2 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full bg-violet-500/45 blur-lg" />
          <Link href="/" className="relative block text-lg font-bold tracking-tight text-white sm:text-xl">
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
              Trend
            </span>
            <span className="text-white">Pilot</span>
            <span className="ml-1 bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
              AI
            </span>
          </Link>
        </motion.div>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((item) => (
            <motion.a
              key={item.label}
              href={item.href}
              className="group relative rounded-full px-4 py-2 text-sm font-semibold text-slate-300 transition-all duration-300 hover:bg-white/10 hover:text-white"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              {item.label}
              <motion.div
                className="absolute inset-x-3 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 transition-transform duration-300 group-hover:scale-x-100"
                initial={{ width: 0 }}
              />
            </motion.a>
          ))}
        </div>

        <motion.a
          href="/register"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-300/40 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_48px_-16px_rgba(124,58,237,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_58px_-16px_rgba(99,102,241,0.95)] active:scale-[0.98]"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          Start Free Trial
          <ArrowRight className="h-4 w-4" />
        </motion.a>
      </div>
    </motion.nav>
  );
}