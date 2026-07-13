import Navbar from "../components/Navbar";
import Features from "../components/Features";
import Stats from "../components/Stats";
import HowItWorks from "../components/HowItWorks";
import Pricing from "../components/Pricing";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import Hero from "../components/landing/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-20 flex flex-col lg:flex-row items-center justify-between gap-16">
        <div className="max-w-xl">
          <h1 className="text-6xl font-bold leading-tight">
            Find Winning Products
            <br />
            Before They Go Viral
          </h1>

          <p className="mt-6 text-xl text-gray-500">
            AI-powered product research platform for Shopify, Amazon and TikTok Shop.
          </p>

          <div className="mt-10 flex gap-4">
            <button className="bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 transition">
              Start Free Trial
            </button>

            <button className="border px-8 py-4 rounded-xl hover:bg-gray-100 transition">
              Watch Demo
            </button>
          </div>
        </div>

      
      </section>

      {/* Features */}
      <Features />

      {/* Hero */}
      <Hero />

      {/* Stats */}
      <Stats />

      {/* How It Works */}
      <HowItWorks />

      {/* Pricing */}
      <Pricing />

      {/* Testimonials */}
      <Testimonials />

      {/* Footer */}
      <Footer />
    </main>
  );
}