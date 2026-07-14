"use client";
import DashboardPreview from "./DashboardPreview";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-indigo-50" />

      <div className="relative max-w-7xl mx-auto px-8 py-24">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* LEFT */}

          <div>

            {/* Badge */}

            <span className="inline-flex items-center rounded-full bg-purple-100 text-purple-700 px-5 py-2 text-sm font-semibold">
              🏆 Trusted by Shopify & Amazon Sellers
            </span>

            {/* Heading */}

            <h1 className="mt-8 text-6xl font-extrabold leading-tight tracking-tight">

              Find Winning Products

              <br />

              <span className="text-purple-600">

                Before They Go Viral

              </span>

            </h1>

            {/* Description */}

            <p className="mt-8 text-xl text-gray-600 leading-9">

              Discover winning products with AI. Analyze competitors,
              estimate profit, generate marketing campaigns and launch
              your next bestseller in minutes.

            </p>

            {/* Buttons */}

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                href="/register"
                className="rounded-2xl bg-purple-600 hover:bg-purple-700 transition px-8 py-5 text-white font-bold text-lg shadow-xl"
              >
                🚀 Start Free Trial
              </Link>

              <button className="rounded-2xl border border-gray-300 bg-white px-8 py-5 font-bold hover:bg-gray-100 transition">
                ▶ Watch Demo
              </button>

            </div>

            {/* Rating */}

            <div className="mt-10 flex items-center gap-3 text-gray-500">

              <span className="text-yellow-500 text-xl">
                ★★★★★
              </span>

              <span>
                Rated 4.9/5 by ecommerce sellers
              </span>

            </div>

            {/* Stats */}

            <div className="flex flex-wrap gap-12 mt-14">

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

            {/* Supported Platforms */}

            <div className="mt-14">

              <p className="text-gray-400 text-sm mb-6 uppercase tracking-widest">

                SUPPORTED PLATFORMS

              </p>

              <div className="flex flex-wrap gap-10 items-center opacity-70">

                <img
                  src="/logos/shopify.svg"
                  alt="Shopify"
                  className="h-8"
                />

                <img
                  src="/logos/amazon.svg"
                  alt="Amazon"
                  className="h-8"
                />

                <img
                  src="/logos/tiktok.svg"
                  alt="TikTok"
                  className="h-8"
                />

                <img
                  src="/logos/aliexpress.svg"
                  alt="AliExpress"
                  className="h-8"
                />

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="relative">

            {/* Glow */}

            <div className="absolute -inset-8 rounded-[50px] bg-purple-500/10 blur-3xl" />

            {/* Dashboard */}

            <div className="relative rounded-[40px] border border-gray-200 bg-white p-6 shadow-[0_40px_100px_rgba(124,58,237,.20)] lg:scale-110 transition duration-500 hover:scale-[1.13]">

            <DashboardPreview />

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}