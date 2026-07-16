"use client";

import Link from "next/link";
import DashboardPreview from "./DashboardPreview";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-indigo-50">

      {/* Background Glow */}

      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-purple-400/20 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-indigo-300/20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-8 py-24">

        <div className="grid lg:grid-cols-2 gap-28 items-center">

          {/* LEFT */}

          <div>

            {/* Badge */}

            <span className="inline-flex items-center rounded-full bg-purple-100 text-purple-700 px-5 py-2 text-sm font-semibold shadow-sm">
              🏆 Trusted by Shopify & Amazon Sellers
            </span>

            {/* Title */}

            <h1 className="mt-8 text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-gray-900">

              Find Winning Products

              <br />

              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">

                Before They Go Viral

              </span>

            </h1>

            {/* Description */}

            <p className="mt-8 max-w-xl text-xl leading-9 text-gray-600">

              Discover winning products with AI.
              Analyze competitors, estimate profit,
              generate marketing campaigns and launch
              your next bestseller in minutes.

            </p>

            {/* Buttons */}

            <div className="mt-10 flex flex-wrap gap-5">

              <Link
                href="/register"
                className="rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-5 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                🚀 Start Free Trial
              </Link>

              <button className="rounded-2xl border border-gray-300 bg-white px-8 py-5 font-bold shadow-sm transition-all duration-300 hover:bg-gray-50 hover:shadow-lg">
                ▶ Watch Demo
              </button>

            </div>

            {/* Rating */}

            <div className="mt-10 flex items-center gap-3">

              <span className="text-xl text-yellow-500">
                ★★★★★
              </span>

              <span className="font-medium text-gray-600">
                Rated 4.9/5 by ecommerce sellers
              </span>

            </div>

            {/* Stats */}

            <div className="mt-14 flex flex-wrap gap-14">

              <div>

                <h3 className="text-4xl font-black text-gray-900">
                  50K+
                </h3>

                <p className="mt-2 text-gray-500">
                  Products Analyzed
                </p>

              </div>

              <div>

                <h3 className="text-4xl font-black text-gray-900">
                  96%
                </h3>

                <p className="mt-2 text-gray-500">
                  AI Accuracy
                </p>

              </div>

              <div>

                <h3 className="text-4xl font-black text-gray-900">
                  24/7
                </h3>

                <p className="mt-2 text-gray-500">
                  AI Monitoring
                </p>

              </div>

            </div>

            {/* Platforms */}

            <div className="mt-14">

              <p className="mb-6 text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">

                Supported Platforms

              </p>

              <div className="mt-6 flex flex-wrap items-center gap-10">

  <img
    src="/logos/shopify.svg"
    alt="Shopify"
    className="h-8 w-auto object-contain hover:scale-110 transition duration-300"
  />

  <img
    src="/logos/amazon.svg"
    alt="Amazon"
    className="h-8 w-auto object-contain hover:scale-110 transition duration-300"
  />

  <img
    src="/logos/tiktok.svg"
    alt="TikTok Shop"
    className="h-8 w-auto object-contain hover:scale-110 transition duration-300"
  />

  <img
    src="/logos/aliexpress.svg"
    alt="AliExpress"
    className="h-8 w-auto object-contain hover:scale-110 transition duration-300"
  />

</div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="relative flex justify-center">

            <div className="absolute -inset-12 rounded-[60px] bg-purple-500/10 blur-3xl" />

            <div className="relative w-full max-w-2xl rounded-[40px] border border-white/60 bg-white/80 p-6 shadow-[0_50px_120px_rgba(124,58,237,.22)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_70px_150px_rgba(124,58,237,.28)]">

              <DashboardPreview />

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}