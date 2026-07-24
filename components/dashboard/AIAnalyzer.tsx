"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ChevronDown, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Zap
} from "lucide-react";

import { generateBusinessAdvisor } from "../../lib/ai/businessAdvisor";
import { calculateAIScore } from "../../lib/ai/score";
import { predictSuccess } from "../../lib/ai/prediction";
import { analyzeCompetition } from "../../lib/ai/competition";
import { generateMarketing } from "../../lib/ai/marketing";

import { searchProduct } from "../../lib/services/searchProduct";
import { analyzeProduct } from "../../lib/services/analyzeProduct";
import { saveProduct } from "../../lib/services/saveProduct";

import { supabase } from "../../lib/supabase";

type Props = {
  onProductSaved: () => void;
};

const STEPS = [
  { id: "search", label: "Market Search" },
  { id: "analyze", label: "Product Analysis" },
  { id: "score", label: "Scoring Engine" },
  { id: "predict", label: "Success Prediction" },
  { id: "save", label: "Database Sync" },
];

export default function AIAnalyzer({ onProductSaved }: Props) {
  const [product, setProduct] = useState("");
  const [platform, setPlatform] = useState("AliExpress");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  async function handleAnalyzeProduct() {
    if (!product.trim()) return;

    setLoading(true);
    setResult("");
    setCurrentStep(0);

    try {
      // Step 0: Search
      setCurrentStep(0);
      const searchData = await searchProduct(product);
      if (!searchData?.name) throw new Error("Product search failed.");

      // Step 1: Analyze
      setCurrentStep(1);
      const productData = await analyzeProduct(searchData.name);
      if (!productData) throw new Error("No product data returned.");

      // Step 2: AI Scoring
      setCurrentStep(2);
      const aiScore = calculateAIScore(productData);
      productData.trend_score = Number(productData.trend_score ?? 90);
      productData.competition = productData.competition ?? "Low";
      productData.profit = Number(productData.profit ?? 30);
      productData.selling_price = Number(productData.selling_price ?? 40);

      // Step 3: Success Prediction & Market Analysis
      setCurrentStep(3);
      const prediction = predictSuccess(productData);
      const competition = analyzeCompetition(productData);
      const marketing = generateMarketing(productData);
      const businessAdvisor = generateBusinessAdvisor({ ...productData, ai_score: aiScore });

      // Check existing product in Supabase
      const { data: existingProduct } = await supabase
        .from("products")
        .select("id")
        .eq("name", productData.name)
        .limit(1);

      if (existingProduct?.length) {
        setResult("⚠️ Product already exists in your database.");
        return;
      }

      const productObject = {
        name: productData.name,
        image: searchData.image ?? "https://picsum.photos/400",
        platform,
        category: productData.category ?? "General",
        description: productData.description ?? "",
        buy_price: Number(productData.buy_price ?? 10),
        selling_price: Number(productData.selling_price ?? 40),
        profit: Number(productData.profit ?? 30),
        ai_score: aiScore,
        trend_score: Number(productData.market_score ?? productData.trend_score ?? 80),
        supplier: searchData.source ?? "",
        supplier_url: searchData.link ?? "",
        product_url: searchData.link ?? "",
        competition: productData.competition ?? "Medium",
        country: productData.country ?? "Worldwide",
        recommendation: competition.recommendation,
        pros: productData.pros ?? [],
        cons: productData.cons ?? [],
        success_probability: prediction.success_probability,
        trend_stage: prediction.trend_stage,
        market_saturation: prediction.market_saturation,
        difficulty: prediction.difficulty,
        marketing_json: marketing,
        business_advisor: businessAdvisor,
      };

      // Step 4: Save to Database
      setCurrentStep(4);
      await saveProduct(productObject);
      setResult("✅ Product analyzed and saved successfully.");
      setProduct("");
      setTimeout(onProductSaved, 500);
    } catch (err: any) {
      setResult(`❌ Error: ${err?.message ?? "Unknown error during analysis."}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-8 shadow-2xl shadow-indigo-500/5">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-slate-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                <Cpu size={20} />
              </div>
              AI Command Center
            </h2>
            <p className="mt-2 text-sm text-slate-500">Run multi-stage analysis pipelines in real-time.</p>
          </div>
          <div className="rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-xs font-bold text-indigo-700 shadow-inner">
            ENGINE: ACTIVE
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex flex-1 flex-col sm:flex-row gap-3">
            <div className="relative sm:w-48">
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="h-14 w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/80 pl-4 pr-10 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 cursor-pointer"
              >
                {["AliExpress", "Amazon", "Shopify", "TikTok Shop"].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>

            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Analyze new product opportunity..."
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyzeProduct()}
                className="h-14 w-full rounded-2xl border border-slate-200 pl-12 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
          </div>

          <button
            onClick={handleAnalyzeProduct}
            disabled={loading || !product.trim()}
            className="group flex h-14 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-8 text-sm font-bold text-white transition-all hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
            {loading ? "Analyzing..." : "Analyze Pipeline"}
          </button>
        </div>

        {/* Dynamic Pipeline Progress Bar */}
        {loading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mt-8 grid grid-cols-5 gap-2"
          >
            {STEPS.map((step, i) => (
              <div key={step.id} className="space-y-2">
                <div className={`h-2 rounded-full transition-all duration-300 ${i <= currentStep ? "bg-indigo-600 shadow-sm" : "bg-slate-100"}`} />
                <span className={`block text-[10px] font-bold uppercase tracking-wider transition-colors ${i === currentStep ? "text-indigo-600" : i < currentStep ? "text-slate-600" : "text-slate-300"}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Results Message */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`mt-6 overflow-hidden rounded-2xl p-4 text-sm font-semibold border ${
                result.startsWith("✅") 
                  ? "bg-emerald-50/80 text-emerald-800 border-emerald-200/80" 
                  : result.startsWith("⚠️")
                  ? "bg-amber-50/80 text-amber-800 border-amber-200/80"
                  : "bg-rose-50/80 text-rose-800 border-rose-200/80"
              }`}
            >
              <div className="flex items-center gap-3">
                {result.startsWith("✅") ? (
                  <CheckCircle2 className="text-emerald-600 shrink-0" size={20} />
                ) : (
                  <AlertCircle className="shrink-0" size={20} />
                )}
                <span>{result}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}