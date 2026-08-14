"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import DashboardPreview from "./DashboardPreview";
import ScrollReveal from "./ScrollReveal";
import { buttonClass } from "../ui/button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--accent-ai-soft)] via-[var(--surface-app)] to-[var(--surface-app)]" />

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-12">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-ai)]/20 bg-[var(--accent-ai-soft)] px-4 py-1.5 text-xs font-semibold text-[var(--accent-ai)]">
              <Sparkles size={14} strokeWidth={2.5} />
              AI-powered product research
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-[var(--ink-900)] sm:text-5xl lg:text-[3.25rem]">
              Find products worth selling before everyone else.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--ink-500)]">
              TrendPilot AI analyzes demand, competition, profitability, and market signals to help you discover
              products with real selling potential.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/register" className={buttonClass({ tone: "ai", size: "md", className: "px-7 py-3.5 text-base" })}>
                Start Finding Products
              </Link>
              <a
                href="#how-it-works"
                className={buttonClass({ tone: "neutral", variant: "outline", size: "md", className: "px-7 py-3.5 text-base" })}
              >
                See How It Works
              </a>
            </div>

            <p className="mt-8 text-sm text-[var(--ink-400)]">Built for modern eCommerce sellers.</p>
          </ScrollReveal>

          <ScrollReveal delayMs={120}>
            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-[36px] bg-[var(--accent-ai)]/10 blur-3xl" aria-hidden="true" />
              <DashboardPreview />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
