"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import DashboardPreview from "./DashboardPreview";
import ScrollReveal from "./ScrollReveal";
import { buttonClass } from "../ui/button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="tp-mesh-hero absolute inset-0 -z-20" aria-hidden="true" />
      <div className="tp-dot-grid absolute inset-0 -z-10 opacity-70" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28 xl:py-32">
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-ai)]/20 bg-[var(--accent-ai-soft)] px-4 py-1.5 text-xs font-semibold text-[var(--accent-ai)]">
              <Sparkles size={14} strokeWidth={2.5} />
              AI-powered product research
            </div>

            <h1 className="mt-7 text-[2.75rem] font-extrabold leading-[1.06] tracking-tight text-[var(--ink-900)] sm:text-6xl lg:text-[3.75rem]">
              Find products worth selling{" "}
              <span className="bg-gradient-to-r from-[var(--accent-ai)] to-[#4c2fd1] bg-clip-text text-transparent">
                before everyone else.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--ink-500)]">
              TrendPilot AI analyzes demand, competition, profitability, and market signals to help you discover
              products with real selling potential.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className={buttonClass({
                  tone: "ai",
                  size: "md",
                  className:
                    "px-7 py-4 text-base shadow-[0_16px_36px_-10px_rgba(109,74,255,0.55)] transition-transform duration-200 hover:-translate-y-0.5",
                })}
              >
                Start Finding Products
              </Link>
              <a
                href="#how-it-works"
                className={buttonClass({
                  tone: "neutral",
                  variant: "outline",
                  size: "md",
                  className: "border-[var(--border-subtle)] bg-[var(--surface-card)]/80 px-7 py-4 text-base backdrop-blur",
                })}
              >
                See How It Works
              </a>
            </div>

            <div className="mt-10 flex items-center gap-3">
              <div className="tp-divider-fade w-10" />
              <p className="text-sm text-[var(--ink-400)]">Built for modern eCommerce sellers.</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={120}>
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="tp-glow-violet absolute -inset-10 -z-10 blur-3xl" aria-hidden="true" />
              <DashboardPreview />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
