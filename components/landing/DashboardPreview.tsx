"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function DashboardPreview() {
  const productThumbs = [
    "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='180'%3E%3Cdefs%3E%3ClinearGradient id='a' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%237c3aed'/%3E%3Cstop offset='1' stop-color='%2322d3ee'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' rx='18' fill='url(%23a)'/%3E%3Ccircle cx='170' cy='60' r='40' fill='rgba(255,255,255,0.2)'/%3E%3Crect x='20' y='118' width='140' height='18' rx='9' fill='rgba(255,255,255,0.45)'/%3E%3Crect x='20' y='144' width='90' height='12' rx='6' fill='rgba(255,255,255,0.35)'/%3E%3C/svg%3E",
    "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='180'%3E%3Cdefs%3E%3ClinearGradient id='b' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%230ea5e9'/%3E%3Cstop offset='1' stop-color='%2310b981'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' rx='18' fill='url(%23b)'/%3E%3Crect x='30' y='30' width='180' height='70' rx='14' fill='rgba(15,23,42,0.28)'/%3E%3Crect x='30' y='118' width='120' height='18' rx='9' fill='rgba(255,255,255,0.4)'/%3E%3Crect x='30' y='144' width='70' height='12' rx='6' fill='rgba(255,255,255,0.3)'/%3E%3C/svg%3E",
    "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='180'%3E%3Cdefs%3E%3ClinearGradient id='c' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%236366f1'/%3E%3Cstop offset='1' stop-color='%23f43f5e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' rx='18' fill='url(%23c)'/%3E%3Ccircle cx='60' cy='65' r='35' fill='rgba(255,255,255,0.18)'/%3E%3Crect x='100' y='42' width='100' height='14' rx='7' fill='rgba(255,255,255,0.45)'/%3E%3Crect x='100' y='66' width='70' height='12' rx='6' fill='rgba(255,255,255,0.32)'/%3E%3Crect x='25' y='130' width='100' height='18' rx='9' fill='rgba(255,255,255,0.35)'/%3E%3C/svg%3E",
    "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='180'%3E%3Cdefs%3E%3ClinearGradient id='d' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%238b5cf6'/%3E%3Cstop offset='1' stop-color='%233b82f6'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' rx='18' fill='url(%23d)'/%3E%3Crect x='24' y='30' width='190' height='82' rx='16' fill='rgba(15,23,42,0.24)'/%3E%3Cpath d='M40 96 C80 50,120 130,180 72' stroke='rgba(255,255,255,0.65)' stroke-width='6' fill='none' stroke-linecap='round'/%3E%3Crect x='24' y='130' width='130' height='18' rx='9' fill='rgba(255,255,255,0.38)'/%3E%3C/svg%3E",
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_10%_0%,rgba(124,58,237,0.34),transparent_42%),radial-gradient(circle_at_90%_10%,rgba(34,211,238,0.18),transparent_34%),linear-gradient(165deg,#0a1021_0%,#111827_42%,#090d18_100%)] p-5 shadow-[0_36px_120px_-48px_rgba(124,58,237,0.85)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:42px_42px] opacity-30" />

      <motion.div
        className="pointer-events-none absolute -right-10 top-12 h-28 w-28 rounded-full bg-violet-500/30 blur-3xl"
        animate={{ opacity: [0.35, 0.7, 0.35], y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <div className="relative z-10 space-y-4">
        <div className="rounded-2xl border border-white/10 bg-slate-900/65 p-3 backdrop-blur-xl">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2">
            <Search className="h-4 w-4 text-violet-300" />
            <p className="flex-1 text-xs text-slate-300">AI Search: &ldquo;portable blender under $30 with low competition&rdquo;</p>
            <span className="rounded-full bg-violet-500/20 px-2 py-1 text-[10px] font-semibold text-violet-200">AI Active</span>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.4fr_1fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-xl">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Filters Sidebar</p>
              <div className="space-y-2 text-xs text-slate-200">
                {[
                  "Platform: Shopify",
                  "Category: Home",
                  "Profit: > $18",
                  "Competition: Medium",
                  "Demand: Rising",
                ].map((item) => (
                  <div key={item} className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5">{item}</div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Keyword Insights</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[
                  "portable blender",
                  "usb juicer",
                  "smoothie bottle",
                  "travel mixer",
                ].map((item) => (
                  <span key={item} className="rounded-full border border-purple-300/25 bg-purple-500/10 px-2 py-1 text-[10px] text-violet-100">{item}</span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Supplier Information</p>
              <p className="mt-2 text-xs text-slate-200">Shenzhen HomeTech Co.</p>
              <p className="text-[11px] text-emerald-300">4.8 rating • 5 year verified</p>
              <p className="text-[11px] text-slate-400">MOQ: 120 • Lead time: 6 days</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {["Travel Blender Pro", "Smart Heat Mug"].map((name, idx) => (
                <motion.div
                  key={name}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-xl"
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                >
                  <div className="relative overflow-hidden rounded-xl border border-white/10">
                    <Image src={productThumbs[idx]} alt={name} width={240} height={180} className="h-24 w-full object-cover" />
                  </div>
                  <p className="mt-2 text-xs font-semibold text-slate-100">{name}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold text-emerald-300">AI Opportunity 92</span>
                    <span className="text-[10px] text-slate-400">Strong Buy</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-xl">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Demand Trend Line</p>
                <span className="text-[10px] text-cyan-300">+18.7%</span>
              </div>
              <svg viewBox="0 0 260 80" className="h-20 w-full">
                <defs>
                  <linearGradient id="trendLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M8 64 C40 50, 72 58, 102 34 C132 14, 160 30, 192 18 C218 10, 236 22, 252 14"
                  fill="none"
                  stroke="url(#trendLine)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.8, ease: "easeOut" }}
                />
                <motion.circle
                  cx="252"
                  cy="14"
                  r="4"
                  fill="#22d3ee"
                  animate={{ r: [4, 6, 4], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.4, repeat: Number.POSITIVE_INFINITY }}
                />
              </svg>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-xl">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Market Trend Heatmap</p>
              <div className="grid grid-cols-6 gap-1.5">
                {[22, 38, 58, 74, 64, 45, 18, 36, 62, 84, 78, 54].map((tone, idx) => (
                  <motion.div
                    key={idx}
                    className="h-6 rounded-md"
                    style={{ backgroundColor: `rgba(124,58,237,${0.12 + tone / 110})` }}
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2 + (idx % 4) * 0.4, repeat: Number.POSITIVE_INFINITY }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">AI Recommendation Panel</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">Travel Blender Pro</p>
              <span className="mt-2 inline-flex rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold text-emerald-300">Strong Buy</span>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-300">High demand momentum and favorable margins with medium competition profile.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Competition Meter</p>
              <div className="mt-2 h-2 w-full rounded-full bg-white/10">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-400" initial={{ width: 0 }} animate={{ width: "58%" }} transition={{ duration: 1.2 }} />
              </div>
              <p className="mt-1 text-[11px] text-amber-300">Medium Competitive Pressure</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Profit Calculator</p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-slate-300">Buy: $12.90</div>
                <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-slate-300">Sell: $34.00</div>
              </div>
              <p className="mt-2 text-sm font-bold text-emerald-300">Est. Profit: $21.10</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-xl">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Sales Forecast Graph</p>
                <span className="text-[10px] text-violet-300">30/60/90 Days</span>
              </div>
              <div className="flex h-16 items-end gap-1.5">
                {[28, 42, 56, 64, 72, 80].map((h, idx) => (
                  <motion.div
                    key={idx}
                    className="w-full rounded-t-md bg-gradient-to-t from-indigo-600 to-purple-300"
                    style={{ height: `${h}%` }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: idx * 0.08, duration: 0.45 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[1.2fr_1fr_1.3fr]">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-xl">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Revenue Chart</p>
            <svg viewBox="0 0 280 76" className="h-16 w-full">
              <defs>
                <linearGradient id="revArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(34,197,94,0.45)" />
                  <stop offset="100%" stopColor="rgba(34,197,94,0.02)" />
                </linearGradient>
              </defs>
              <motion.path
                d="M4 65 C42 48,82 58,120 38 C154 20,186 30,218 16 C240 10,260 14,276 8"
                fill="none"
                stroke="#22c55e"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.6, ease: "easeOut" }}
              />
              <path d="M4 65 C42 48,82 58,120 38 C154 20,186 30,218 16 C240 10,260 14,276 8 L276 76 L4 76 Z" fill="url(#revArea)" />
            </svg>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Product Thumbnail Gallery</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {productThumbs.slice(0, 4).map((src, idx) => (
                <div key={idx} className="overflow-hidden rounded-lg border border-white/10">
                  <Image src={src} alt={`Gallery ${idx + 1}`} width={120} height={90} className="h-14 w-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">AI Generated Summary Panel</p>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-300">
              Demand for portable blending tools is accelerating in US and UK. Margins remain attractive at $18-$24 net with supplier reliability above benchmark. Recommendation: launch with influencer-first positioning and bundled accessories.
            </p>
            <p className="mt-2 text-[11px] font-semibold text-emerald-300">Winning Product Card: Travel Blender Pro • 96/100</p>
          </div>
        </div>
      </div>
    </div>
  );
}
