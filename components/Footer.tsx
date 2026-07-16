"use client";

import Link from "next/link";
import {
  FaXTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-[#09090B] border-t border-gray-800 text-white">

      <div className="max-w-7xl mx-auto px-8 py-20">

        <div className="grid lg:grid-cols-5 gap-14">

          {/* Logo */}

          <div className="lg:col-span-2">

            <img
              src="/logos/trendpilot.jpeg"
              alt="TrendPilot AI"
              className="h-16 w-auto"
            />

            <p className="mt-8 max-w-md text-gray-400 leading-8">

              Discover winning ecommerce products before they go viral.
              Analyze competitors, estimate profit, generate marketing
              campaigns and launch faster using artificial intelligence.

            </p>

            {/* Social */}

            <div className="flex gap-4 mt-10">

              <a
                href="#"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 hover:bg-black transition"
              >
                <FaXTwitter size={18} />
              </a>

              <a
                href="#"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 hover:bg-blue-600 transition"
              >
                <FaLinkedin size={18} />
              </a>

              <a
                href="#"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 hover:bg-pink-600 transition"
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="#"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 hover:bg-red-600 transition"
              >
                <FaYoutube size={18} />
              </a>

            </div>

          </div>

          {/* Product */}

          <div>

            <h3 className="mb-7 text-xl font-bold">
              Product
            </h3>

            <ul className="space-y-4 text-gray-400">

              <li>
                <a href="#features" className="hover:text-white transition">
                  Features
                </a>
              </li>

              <li>
                <a href="#pricing" className="hover:text-white transition">
                  Pricing
                </a>
              </li>

              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-white transition"
                >
                  Dashboard
                </Link>
              </li>

              <li>
                <Link
                  href="/register"
                  className="hover:text-white transition"
                >
                  Start Free Trial
                </Link>
              </li>

            </ul>

          </div>

          {/* Company */}

          <div>

            <h3 className="mb-7 text-xl font-bold">
              Company
            </h3>

            <ul className="space-y-4 text-gray-400">

              <li>
                <Link href="/about" className="hover:text-white transition">
                  About
                </Link>
              </li>

              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>

              <li>
                <Link href="/login" className="hover:text-white transition">
                  Login
                </Link>
              </li>

              <li>
                <Link href="/register" className="hover:text-white transition">
                  Register
                </Link>
              </li>

            </ul>

          </div>

          {/* Newsletter */}

          <div>

            <h3 className="mb-7 text-xl font-bold">
              Stay Updated
            </h3>

            <p className="mb-6 text-gray-400 leading-7">

              Join thousands of ecommerce founders and receive
              AI tips, winning products and market insights every week.

            </p>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-2xl border border-gray-700 bg-gray-900 px-5 py-4 outline-none focus:border-purple-500 transition"
            />

            <button
              className="mt-5 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 py-4 font-bold transition hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-700/30"
            >
              Subscribe
            </button>

          </div>

        </div>

        {/* Bottom */}

        <div className="mt-20 border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">

          <p className="text-gray-500">

            © 2026 TrendPilot AI. All rights reserved.

          </p>

          <div className="flex flex-wrap gap-6 mt-6 md:mt-0 text-gray-500">

            <Link href="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>

            <Link href="/terms" className="hover:text-white transition">
              Terms of Service
            </Link>

            <Link href="/contact" className="hover:text-white transition">
              Contact
            </Link>

            <Link href="/about" className="hover:text-white transition">
              About
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}