import Navbar from "../components/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/Features";
import Stats from "../components/Stats";
import HowItWorks from "../components/HowItWorks";
import Pricing from "../components/Pricing";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">

<section id="features">
  <Features />
</section>

<Hero />

<Stats />

<HowItWorks />

<section id="pricing">
  <Pricing />
</section>

<section id="testimonials">
  <Testimonials />
</section>

<Footer />

    </main>
  );
}