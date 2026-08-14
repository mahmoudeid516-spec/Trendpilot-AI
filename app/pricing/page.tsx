import Pricing from "../../components/Pricing";
import Navbar from "../../components/landing/Navbar";
import Footer from "../../components/landing/Footer";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[var(--surface-app)]">
      <Navbar />
      <Pricing />
      <Footer />
    </main>
  );
}