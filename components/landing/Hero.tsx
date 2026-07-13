"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-indigo-50" />

      <div className="relative max-w-7xl mx-auto px-8 py-24">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Left */}

          <div>

            <span className="inline-flex items-center rounded-full bg-purple-100 text-purple-700 px-5 py-2 text-sm font-semibold">
              🚀 AI Powered Ecommerce Platform
            </span>

            <h1 className="mt-8 text-6xl font-extrabold leading-tight tracking-tight">

              Find Winning Products
              <br />

              <span className="text-purple-600">
                Before Everyone Else.
              </span>

            </h1>

            <p className="mt-8 text-xl text-gray-600 leading-9">

              TrendPilot AI helps ecommerce sellers discover
              profitable products, analyze competitors,
              generate marketing campaigns and launch faster
              using artificial intelligence.

            </p>

            <div className="flex flex-wrap gap-5 mt-12">

              <Link
                href="/register"
                className="rounded-2xl bg-purple-600 hover:bg-purple-700 transition px-8 py-5 text-white font-bold text-lg shadow-xl"
              >
                🚀 Start Free Trial
              </Link>

              <button className="rounded-2xl border border-gray-300 px-8 py-5 font-bold hover:bg-gray-100 transition">
                ▶ Watch Demo
              </button>

            </div>

            <div className="flex flex-wrap gap-10 mt-14">

              <div>

                <h3 className="text-4xl font-bold">
                  50K+
                </h3>

                <p className="text-gray-500">
                  Products Analyzed
                </p>

              </div>

              <div>

                <h3 className="text-4xl font-bold">
                  96%
                </h3>

                <p className="text-gray-500">
                  AI Accuracy
                </p>

              </div>

              <div>

                <h3 className="text-4xl font-bold">
                  24/7
                </h3>

                <p className="text-gray-500">
                  AI Monitoring
                </p>

              </div>

            </div>

          </div>

          {/* Right */}

          <div>

            <div className="rounded-[40px] bg-white shadow-2xl border border-gray-100 p-8">

              <img
                src="/dashboard-preview.png"
                alt="TrendPilot Dashboard"
                className="rounded-3xl"
              />

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}