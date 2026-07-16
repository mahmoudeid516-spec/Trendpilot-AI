"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">

        {/* Logo */}

        <Link href="/" className="flex items-center gap-4">

          <img
            src="/logos/trendpilot.jpeg"
            alt="TrendPilot AI"
            className="h-50 w-auto"
          />

        </Link>

        {/* Menu */}

        <div className="hidden lg:flex items-center gap-10 font-medium text-gray-600">

          <a
            href="#features"
            className="transition hover:text-purple-600"
          >
            Features
          </a>

          <a
            href="#pricing"
            className="transition hover:text-purple-600"
          >
            Pricing
          </a>

          <a
            href="#testimonials"
            className="transition hover:text-purple-600"
          >
            Reviews
          </a>

          <Link
            href="/login"
            className="transition hover:text-purple-600"
          >
            Login
          </Link>

        </div>

        {/* Right Buttons */}

        <div className="flex items-center gap-4">

          <Link
            href="/pricing"
            className="hidden rounded-xl border border-purple-200 px-5 py-3 font-semibold text-purple-600 transition hover:bg-purple-50 md:block"
          >
            Pricing
          </Link>

          <Link
            href="/register"
            className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 font-bold text-white shadow-lg transition duration-300 hover:scale-105 hover:shadow-purple-300"
          >
            🚀 Start Free Trial
          </Link>

        </div>

      </div>
    </nav>
  );
}