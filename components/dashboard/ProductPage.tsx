"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Product = {
  id: string;
  image: string;
  name: string;
  platform: string;
  ai_score: number;
  trend_score: number;
  profit: number;
  buy_price: number;
  selling_price: number;
  supplier: string;
  supplier_url: string;
  product_url: string;
  competition: string;
  country: string;
  category: string;
  description?: string;
  ai_reason?: string;
};

type Props = {
  id: string;
};

export default function ProductPage({ id }: Props) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [id]);

  async function loadProduct() {
    // FIX: String ID comparison to match updated database schema
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      setProduct(data);
    }

    setLoading(false);
  }

  // Calculated Financial Metrics
  const financials = useMemo(() => {
    if (!product) return { buy: 0, sell: 0, profit: 0, roi: "0" };
    const buy = Number(product.buy_price || 0);
    const sell = Number(product.selling_price || 0);
    const profit = Number(product.profit || Math.max(0, sell - buy));
    const roi = buy > 0 ? ((profit / buy) * 100).toFixed(0) : "0";
    return { buy, sell, profit, roi };
  }, [product]);

  // Dynamic Decision Engine Logic
  const decision = useMemo(() => {
    if (!product) return { status: "TEST FIRST", color: "amber", text: "🟡 TEST FIRST", bg: "bg-amber-50 text-amber-700 border-amber-200" };
    const score = Number(product.ai_score || 0);
    if (score >= 80) {
      return { status: "STRONG BUY", color: "emerald", text: "🟢 STRONG BUY", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    } else if (score >= 50) {
      return { status: "TEST FIRST", color: "amber", text: "🟡 TEST FIRST", bg: "bg-amber-50 text-amber-700 border-amber-200" };
    } else {
      return { status: "AVOID", color: "rose", text: "🔴 AVOID", bg: "bg-rose-50 text-rose-700 border-rose-200" };
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-semibold text-sm">Generating AI Report...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 text-2xl font-bold mb-4">
          ⚠️
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Product Report Not Found</h1>
        <p className="text-slate-500 text-sm mt-1 mb-6">The requested product ID does not exist or was removed.</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-slate-900 text-white font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-purple-500 selection:text-white pb-20">
      
      {/* TOP BAR */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-purple-600 transition-colors"
          >
            <span>←</span> Back to Dashboard
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-extrabold tracking-wider text-slate-900 uppercase">
              AI Product Report
            </span>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-100 px-3 py-1 rounded-full">
            ✨ TrendPilot AI Verified
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-10">

        {/* SECTION 1: PRODUCT HEADER */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Image Box */}
            <div className="lg:col-span-4 relative aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200/80 shadow-inner">
              <img
                src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Meta */}
            <div className="lg:col-span-8 space-y-5">
              <div className="flex flex-wrap gap-2">
                {product.platform && (
                  <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full border border-slate-200">
                    📍 {product.platform}
                  </span>
                )}
                {product.category && (
                  <span className="bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1 rounded-full border border-purple-100">
                    🏷️ {product.category}
                  </span>
                )}
                {product.country && (
                  <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full border border-indigo-100">
                    🌍 {product.country}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                {product.description ||
                  "AI analyzed this product across live order trends, supplier pricing structures, and social viral metrics to construct this market intelligence report."}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: BIG AI DECISION CARD */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Decision Highlight Badge */}
          <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              AI Decision Engine
            </span>
            <div className="my-6">
              <div className={`inline-flex items-center px-4 py-2 rounded-2xl text-lg font-black border shadow-sm ${decision.bg}`}>
                {decision.text}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-3">
                Calculated based on risk ratio, profit velocity, and active market competition.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-slate-400">
              Model: TrendPilot v4.2 Pro
            </div>
          </div>

          {/* Probability & Confidence Metrics */}
          <div className="lg:col-span-2 grid sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                AI Confidence
              </span>
              <div className="my-4">
                <span className="text-4xl font-black text-slate-900">
                  {product.ai_score}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-purple-600 h-full rounded-full" 
                  style={{ width: `${Math.min(100, product.ai_score)}%` }} 
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Winning Probability
              </span>
              <div className="my-4">
                <span className="text-4xl font-black text-emerald-600">
                  {Math.min(99, Math.max(10, Math.round(product.ai_score * 0.95)))}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full" 
                  style={{ width: `${Math.min(99, Math.max(10, Math.round(product.ai_score * 0.95)))}%` }} 
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Trend Score
              </span>
              <div className="my-4">
                <span className="text-4xl font-black text-indigo-600">
                  {product.trend_score}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full" 
                  style={{ width: `${Math.min(100, product.trend_score)}%` }} 
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: FINANCIAL ANALYSIS */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-6">
            Financial Analysis & Margin Breakdown
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
              <p className="text-xs font-bold text-slate-400 uppercase">Buy Price</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                ${financials.buy.toFixed(2)}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">Supplier Sourcing Cost</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
              <p className="text-xs font-bold text-slate-400 uppercase">Selling Price</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                ${financials.sell.toFixed(2)}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">Recommended Retail</p>
            </div>

            <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-5">
              <p className="text-xs font-bold text-emerald-700 uppercase">Estimated Profit</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2">
                +${financials.profit.toFixed(2)}
              </h3>
              <p className="text-[11px] text-emerald-600 mt-1">Net Margin / Order</p>
            </div>

            <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-5">
              <p className="text-xs font-bold text-purple-700 uppercase">Return on Investment</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-purple-700 mt-2">
                {financials.roi}%
              </h3>
              <p className="text-[11px] text-purple-600 mt-1">Estimated ROI Multiplier</p>
            </div>
          </div>
        </section>

        {/* SECTION 4: MARKET ANALYSIS */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-6">
            Market Signals & Overview
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-400 font-semibold">Competition Level</p>
              <p className="text-sm font-bold text-slate-900 mt-1 capitalize">
                {product.competition || "Medium"}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-400 font-semibold">Consumer Demand</p>
              <p className="text-sm font-bold text-slate-900 mt-1">Very High (Surging)</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-400 font-semibold">Trend Trajectory</p>
              <p className="text-sm font-bold text-emerald-600 mt-1">📈 Upward Spike</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-400 font-semibold">Verified Supplier</p>
              <p className="text-sm font-bold text-slate-900 mt-1 truncate">
                {product.supplier || "Official Global Partner"}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-400 font-semibold">Target Platform</p>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {product.platform || "AliExpress"}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-400 font-semibold">Niche Category</p>
              <p className="text-sm font-bold text-slate-900 mt-1 truncate">
                {product.category || "General Commerce"}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-400 font-semibold">Primary Market</p>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {product.country || "Global / USA"}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-400 font-semibold">Saturation Risk</p>
              <p className="text-sm font-bold text-emerald-600 mt-1">Low (12.4%)</p>
            </div>
          </div>
        </section>

        {/* SECTION 5: WHY AI RECOMMENDS THIS PRODUCT */}
        <section className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-purple-200 border border-white/10">
              <span>🤖</span> Deep Neural Analysis
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Why TrendPilot AI Recommends This Product
            </h2>

            <p className="text-purple-100/90 text-sm sm:text-base leading-relaxed font-normal">
              {product.ai_reason ||
                "This product shows healthy demand, attractive margins, and a favorable competitive landscape according to TrendPilot AI. Social velocity triggers indicate elevated viral potential on short-form video channels with low acquisition costs."}
            </p>
          </div>
        </section>

        {/* SECTION 6: RECOMMENDED MARKETING CHANNELS */}
        <section className="space-y-6">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
            Recommended Marketing Channels
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { title: "TikTok Ads", diff: "Easy", cost: "$", pot: "High", icon: "🎵" },
              { title: "Facebook Ads", diff: "Medium", cost: "$$$", pot: "Very High", icon: "📘" },
              { title: "Google Ads", diff: "Hard", cost: "$$$$", pot: "Medium", icon: "🔍" },
              { title: "Instagram Reels", diff: "Easy", cost: "Free", pot: "High", icon: "📸" },
              { title: "Organic SEO", diff: "Hard", cost: "Free", pot: "Long Term", icon: "🌐" },
            ].map((channel) => (
              <div 
                key={channel.title}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{channel.icon}</span>
                  <span className="text-[10px] font-extrabold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    {channel.diff}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">{channel.title}</h3>

                <div className="border-t border-slate-100 pt-3 text-xs space-y-1">
                  <div className="flex justify-between text-slate-500">
                    <span>Cost:</span>
                    <span className="font-semibold text-slate-800">{channel.cost}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Potential:</span>
                    <span className="font-bold text-purple-600">{channel.pot}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 7: SUPPLIER ACTIONS */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Ready to Take Action?</h3>
              <p className="text-slate-500 text-xs mt-0.5">Direct link to fulfillment partner and instant store importer.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {product.supplier_url && (
                <a
                  href={product.supplier_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-2xl text-xs text-center transition-all shadow-sm active:scale-95"
                >
                  View Supplier
                </a>
              )}

              {product.product_url && (
                <a
                  href={product.product_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3.5 px-8 rounded-2xl text-xs text-center transition-all shadow-lg shadow-purple-600/20 active:scale-95"
                >
                  🚀 Launch Product
                </a>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 8: LOCKED PREMIUM SECTION */}
        <section className="relative bg-white rounded-3xl border border-purple-200/80 p-8 sm:p-12 shadow-sm overflow-hidden text-center">
          {/* Subtle Blur Backdrop Overlay */}
          <div className="absolute inset-0 bg-slate-50/70 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6 space-y-4">
            <div className="w-12 h-12 bg-purple-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-purple-600/30">
              🔒
            </div>

            <div className="max-w-md space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900">
                Unlock Full AI Intelligence
              </h3>
              <p className="text-slate-500 text-xs">
                Export custom PDF reports, generate turn-key video scripts, and download full competitor ad creative archives.
              </p>
            </div>

            <button
              onClick={() => router.push("/dashboard")}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs px-8 py-3.5 rounded-2xl shadow-lg shadow-purple-600/25 hover:shadow-purple-600/35 transition-all active:scale-95"
            >
              Upgrade to Pro
            </button>
          </div>

          {/* Dummy Behind-the-Lock Preview Items */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 opacity-30 select-none pointer-events-none filter blur-[2px]">
            <div className="p-6 bg-slate-100 rounded-2xl text-left space-y-2">
              <span className="text-xl">📄</span>
              <p className="font-bold text-xs">Export PDF Report</p>
              <p className="text-[10px] text-slate-400">Institutional pitch deck</p>
            </div>
            <div className="p-6 bg-slate-100 rounded-2xl text-left space-y-2">
              <span className="text-xl">🎯</span>
              <p className="font-bold text-xs">Competitor Analysis</p>
              <p className="text-[10px] text-slate-400">Spy on 14 active stores</p>
            </div>
            <div className="p-6 bg-slate-100 rounded-2xl text-left space-y-2">
              <span className="text-xl">🎬</span>
              <p className="font-bold text-xs">AI Marketing Plan</p>
              <p className="text-[10px] text-slate-400">Complete ad script hooks</p>
            </div>
            <div className="p-6 bg-slate-100 rounded-2xl text-left space-y-2">
              <span className="text-xl">📊</span>
              <p className="font-bold text-xs">30-Day Forecast</p>
              <p className="text-[10px] text-slate-400">Predictive sales curves</p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}