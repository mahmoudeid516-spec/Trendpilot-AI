"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Globe,
  Send,
  Sparkles,
  Star,
} from "lucide-react";

export default function Footer() {
  const socialLinks = [
    { icon: Globe, label: "Twitter", href: "#" },
    { icon: Sparkles, label: "LinkedIn", href: "#" },
    { icon: Star, label: "Instagram", href: "#" },
    { icon: Send, label: "YouTube", href: "#" },
  ];

  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "How It Works", href: "#how-it-works" },
        { label: "Pricing", href: "#pricing" },
        { label: "Dashboard", href: "/dashboard" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "API Docs", href: "#" },
        { label: "Guides", href: "#" },
        { label: "Status", href: "#" },
        { label: "Help Center", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
        { label: "Security", href: "#" },
        { label: "Cookies", href: "#" },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[radial-gradient(circle_at_14%_0%,rgba(124,58,237,0.26),transparent_36%),radial-gradient(circle_at_88%_10%,rgba(56,189,248,0.18),transparent_34%),linear-gradient(180deg,#060915_0%,#050816_100%)] text-slate-200">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:58px_58px] opacity-30 [mask-image:radial-gradient(circle_at_center,black,transparent_84%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <motion.div
            className="rounded-3xl border border-white/10 bg-[rgba(17,24,39,0.58)] p-8 backdrop-blur-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                TrendPilot
              </span>
              <span className="text-white"> AI</span>
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              The AI Operating System for Ecommerce. Discover winning products, analyze trends, generate marketing campaigns and launch faster using artificial intelligence.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-slate-900/60 text-violet-200 shadow-lg shadow-violet-900/30 transition-all duration-300 hover:-translate-y-1 hover:border-violet-300/40 hover:text-white"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    title={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                );
              })}
            </div>

            <div className="mt-10 rounded-2xl border border-white/10 bg-slate-900/55 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Newsletter</p>
              <p className="mt-2 text-sm text-slate-300">Weekly product intelligence and AI strategy updates.</p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-sm text-slate-200 outline-none transition-all duration-200 placeholder:text-slate-500 focus:border-violet-300/40 focus:ring-2 focus:ring-violet-500/20"
                />
                <motion.button
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-300/30 bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_44px_-16px_rgba(124,58,237,0.9)] transition-all duration-300 hover:-translate-y-0.5"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Subscribe
                  <Send className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="grid gap-4 sm:grid-cols-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {footerSections.map((section) => (
              <div key={section.title} className="rounded-2xl border border-white/10 bg-[rgba(17,24,39,0.58)] p-5 backdrop-blur-xl">
                <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
                  {section.title}
                </h3>

                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition-colors duration-200 hover:text-violet-300"
                      >
                        {link.label}
                        <ArrowRight className="h-4 w-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-sm text-slate-400">
            © 2026 TrendPilot AI. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm text-slate-400">
            <motion.a
              href="#"
              className="transition-colors duration-200 hover:text-violet-300"
              whileHover={{ y: -1 }}
            >
              Privacy Policy
            </motion.a>

            <motion.a
              href="#"
              className="transition-colors duration-200 hover:text-violet-300"
              whileHover={{ y: -1 }}
            >
              Terms of Service
            </motion.a>

            <motion.a
              href="#"
              className="transition-colors duration-200 hover:text-violet-300"
              whileHover={{ y: -1 }}
            >
              Cookies
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}