"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-24 pt-16 sm:pt-20 lg:pt-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(124,58,237,0.32),transparent_24%),radial-gradient(circle_at_86%_15%,rgba(37,99,235,0.22),transparent_20%),linear-gradient(180deg,#090d16_0%,#0f172a_42%,#05070f_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.1)_1px,transparent_1px)] bg-[size:68px_68px] opacity-30 [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
      
      <motion.div
        className="pointer-events-none absolute left-[-8%] top-[8%] h-96 w-96 rounded-full bg-violet-500/25 blur-3xl"
        animate={{ scale: [1, 1.12, 1], x: [0, 10, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute right-[-6%] top-[18%] h-[30rem] w-[30rem] rounded-full bg-cyan-400/20 blur-3xl"
        animate={{ scale: [1, 1.08, 1], y: [0, -12, 0], opacity: [0.5, 0.75, 0.5] }}
        transition={{ duration: 14, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span
              className="inline-flex items-center gap-2 rounded-full border border-violet-300/40 bg-gradient-to-r from-violet-500/20 via-indigo-500/20 to-cyan-400/15 px-5 py-2.5 text-sm font-semibold text-violet-100 shadow-[0_16px_40px_-20px_rgba(124,58,237,0.8)] backdrop-blur"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <Sparkles className="h-4 w-4" />
              AI Powered Ecommerce Platform
            </motion.span>

            <h1 className="mt-8 text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-white via-violet-200 to-cyan-200 bg-clip-text text-transparent">
                Find Winning
              </span>
              <br />
              Products <span className="text-white">
                Before Everyone Else
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">
              TrendPilot AI helps ecommerce sellers discover profitable products, analyze competitors, generate marketing campaigns and launch faster using artificial intelligence.
            </p>

            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-300/40 bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 font-semibold text-white shadow-[0_20px_60px_-20px_rgba(124,58,237,0.8)] transition-all duration-300 hover:-translate-y-1 hover:from-purple-500 hover:to-indigo-500"
                >
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-8 py-4 font-semibold text-slate-100 shadow-[0_16px_42px_-20px_rgba(34,211,238,0.45)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/60 hover:bg-white/10"
              >
                <Play className="h-5 w-5" />
                Watch Demo
              </motion.button>
            </div>

            <motion.div
              className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {[
                { label: "Products Analyzed", value: "50K+" },
                { label: "AI Accuracy", value: "96%" },
                { label: "AI Monitoring", value: "24/7" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-slate-900/55 p-4 shadow-2xl shadow-purple-500/10 backdrop-blur">
                  <h3 className="bg-gradient-to-r from-violet-300 to-cyan-200 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
                    {stat.value}
                  </h3>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-violet-500/30 to-indigo-500/20 blur-2xl" />
              <motion.div
                className="relative overflow-hidden rounded-[40px] border border-white/10 bg-slate-900/70 p-8 shadow-[0_42px_110px_-35px_rgba(124,58,237,0.7)] backdrop-blur-sm"
                whileHover={{ y: -6, boxShadow: "0 48px 96px -12px rgba(124,58,237,0.38)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.26),transparent_42%)]" />
                <Image
                  src="/dashboard-preview.png"
                  alt="TrendPilot Dashboard"
                  width={1200}
                  height={800}
                  className="relative w-full rounded-3xl border border-white/10 shadow-2xl shadow-purple-500/15"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}