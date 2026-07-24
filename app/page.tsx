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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. الهيدر وشريط التنقل */}
      <Navbar />

      <main className="overflow-hidden">
        {/* 2. قسم Hero الرئيسي */}
        <section className="relative bg-white border-b border-slate-100">
          <Hero />
        </section>

        {/* 3. الإحصائيات والأرقام (وضعها هنا يبني الثقة فوراً بعد الـ Hero) */}
        <section id="stats" className="bg-slate-50/70 border-b border-slate-100/80 py-4">
          <Stats />
        </section>

        {/* 4. مميزات المنصة */}
        <section id="features" className="bg-white border-b border-slate-100 py-6">
          <Features />
        </section>

        {/* 5. طريقة العمل Step-by-Step */}
        <section id="how-it-works" className="bg-slate-50/70 border-b border-slate-100/80 py-6">
          <HowItWorks />
        </section>

        {/* 6. آراء العملاء والتوصيات */}
        <section id="testimonials" className="bg-white border-b border-slate-100 py-6">
          <Testimonials />
        </section>

        {/* 7. خطط الأسعار */}
        <section id="pricing" className="bg-slate-50/70 py-6">
          <Pricing />
        </section>
      </main>

      {/* 8. الفوتر */}
      <Footer />
    </div>
  );
}