import type { Metadata } from "next";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import TrustBar from "../components/landing/TrustBar";
import ProblemSection from "../components/landing/ProblemSection";
import HowItWorks from "../components/landing/HowItWorks";
import Features from "../components/landing/Features";
import IntelligenceShowcase from "../components/landing/IntelligenceShowcase";
import Differentiation from "../components/landing/Differentiation";
import FAQ from "../components/landing/FAQ";
import Pricing from "../components/landing/Pricing";
import FinalCTA from "../components/landing/FinalCTA";
import Footer from "../components/landing/Footer";

export const metadata: Metadata = {
  title: {
    absolute: "TrendPilot AI — AI-Powered Product Research & Market Intelligence",
  },
  description:
    "TrendPilot AI helps eCommerce sellers discover promising products, analyze demand and competition, estimate profitability, and generate marketing content with AI.",
  openGraph: {
    title: "TrendPilot AI — AI-Powered Product Research & Market Intelligence",
    description:
      "Find products worth selling before everyone else. TrendPilot AI analyzes demand, competition, profitability, and market signals.",
    url: "https://trendpilotai.com",
    siteName: "TrendPilot AI",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TrendPilot AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TrendPilot AI — AI-Powered Product Research & Market Intelligence",
    description: "Find products worth selling before everyone else.",
    images: ["/og-image.png"],
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--surface-app)]">
      <Navbar />
      <Hero />
      <TrustBar />
      <ProblemSection />
      <HowItWorks />
      <Features />
      <IntelligenceShowcase />
      <Differentiation />
      <FAQ />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  );
}
