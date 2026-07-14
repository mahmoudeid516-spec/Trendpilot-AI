"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-xl">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-5">

        {/* Logo */}

        <Link
          href="/"
          className="flex items-center gap-3"
        >

          <img
            src="/logo.png"
            alt="TrendPilot AI"
            className="h-11 w-auto"
          />

          <div className="leading-tight">

            <h1 className="text-3xl font-black tracking-tight">

              <span className="text-purple-600">
                Trend
              </span>

              <span className="text-gray-900">
                Pilot
              </span>

              <span className="ml-1 bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
                AI
              </span>

            </h1>

            <p className="text-xs text-gray-400 tracking-widest uppercase">
              AI Product Research
            </p>

          </div>

        </Link>

        {/* Menu */}

        <div className="hidden lg:flex items-center gap-10 font-medium text-gray-600">

          <a
            href="#features"
            className="hover:text-purple-600 transition"
          >
            Features
          </a>

          <a
            href="#pricing"
            className="hover:text-purple-600 transition"
          >
            Pricing
          </a>

          <a
            href="#testimonials"
            className="hover:text-purple-600 transition"
          >
            Reviews
          </a>

          <Link
            href="/login"
            className="hover:text-purple-600 transition"
          >
            Login
          </Link>

        </div>

        {/* Right Side */}

        <div className="flex items-center gap-4">

          <Link
            href="/pricing"
            className="hidden md:block rounded-xl border border-purple-200 px-5 py-3 font-semibold text-purple-600 transition hover:bg-purple-50"
          >
            Pricing
          </Link>

          <Link
            href="/register"
            className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 font-bold text-white shadow-lg transition hover:scale-105 hover:shadow-purple-300"
          >
            🚀 Start Free Trial
          </Link>

        </div>

      </div>

    </nav>
  );
}