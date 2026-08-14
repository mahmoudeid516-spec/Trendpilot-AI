"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { buttonClass } from "../ui/button";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "/pricing" },
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
      className={`sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--surface-card)]/85 backdrop-blur-xl transition-[box-shadow,padding] duration-300 ${
        scrolled ? "tp-nav-elevated" : ""
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-[padding] duration-300 sm:px-6 lg:px-8 ${
          scrolled ? "py-3" : "py-4"
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-ai)] text-sm font-bold text-white">
            T
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-[var(--ink-900)]">
            TrendPilot <span className="text-[var(--accent-ai)]">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-[var(--ink-700)] lg:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="transition-colors hover:text-[var(--ink-900)]">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/login" className={buttonClass({ tone: "neutral", variant: "ghost" })}>
            Log In
          </Link>
          <Link href="/register" className={buttonClass({ tone: "ai" })}>
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
