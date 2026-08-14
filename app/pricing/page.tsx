import type { Metadata } from "next";
import Pricing from "../../components/landing/Pricing";
import Navbar from "../../components/landing/Navbar";
import Footer from "../../components/landing/Footer";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent TrendPilot AI pricing. Choose the plan that fits how you research products.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[var(--surface-app)]">
      <Navbar />
      <Pricing />
      <Footer />
    </main>
  );
}