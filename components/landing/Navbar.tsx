"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { buttonClass } from "../ui/button";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[box-shadow,padding,background-color,border-color] duration-300 ${
        scrolled
          ? "tp-nav-elevated border-[var(--border-subtle)] bg-[var(--surface-card)]/90 backdrop-blur-xl"
          : "border-transparent bg-[var(--surface-card)]/60 backdrop-blur-sm"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-[padding] duration-300 sm:px-6 lg:px-8 ${
          scrolled ? "py-3" : "py-4.5"
        }`}
      >
        <Link href="/" className="group flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent-ai)] to-[#4c2fd1] text-sm font-bold text-white shadow-[0_4px_14px_rgba(109,74,255,0.4)] transition-transform duration-300 group-hover:scale-105">
            T
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-[var(--ink-900)]">
            TrendPilot <span className="text-[var(--accent-ai)]">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium text-[var(--ink-700)] lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-lg px-3.5 py-2 transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--ink-900)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/login" className={buttonClass({ tone: "neutral", variant: "ghost" })}>
            Log In
          </Link>
          <Link
            href="/register"
            className={buttonClass({
              tone: "ai",
              className: "shadow-[0_8px_20px_-6px_rgba(109,74,255,0.55)] transition-transform hover:-translate-y-0.5",
            })}
          >
            Start Free
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          className="tp-focus-ring flex h-11 w-11 items-center justify-center rounded-lg text-[var(--ink-700)] hover:bg-[var(--surface-muted)] lg:hidden"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-[var(--border-subtle)] bg-[var(--surface-card)] px-4 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-2 py-3 text-sm font-medium text-[var(--ink-700)] hover:bg-[var(--surface-muted)]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-3 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className={buttonClass({ tone: "neutral", variant: "outline", className: "w-full" })}
            >
              Log In
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className={buttonClass({ tone: "ai", className: "w-full" })}
            >
              Start Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
