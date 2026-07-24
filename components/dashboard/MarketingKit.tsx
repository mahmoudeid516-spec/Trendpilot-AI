"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Zap, 
  Layout,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Share2,
  Layers
} from "lucide-react";

type Props = {
  productName: string;
};

interface MarketingData {
  facebook_ad: string;
  instagram_caption: string;
  tiktok_hook: string;
  seo_title: string;
  hashtags: string;
}

export default function MarketingKit({ productName }: Props) {
  const [loading, setLoading] = useState(false);
  const [marketing, setMarketing] = useState<MarketingData | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateMarketing = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: productName }),
      });

      if (!res.ok) throw new Error("Failed to generate marketing data");

      const data: MarketingData = await res.json();
      setMarketing(data);
    } catch (err) {
      console.error(err);
      setError("Unable to generate marketing strategy right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const stats = useMemo(() => ({
    score: "94%",
    conversion: "4.2%",
    ctr: "3.8%",
    roas: "4.5x"
  }), []);

  const contentItems = useMemo(() => {
    if (!marketing) return [];
    return [
      { id: "facebook", title: "📘 Facebook Ad Copy", content: marketing.facebook_ad },
      { id: "instagram", title: "📷 Instagram Caption", content: marketing.instagram_caption },
      { id: "tiktok", title: "🎬 TikTok Hook Script", content: marketing.tiktok_hook },
      { id: "seo", title: "🔍 SEO Title Tag", content: marketing.seo_title },
      { id: "hashtags", title: "🏷️ Recommended Hashtags", content: marketing.hashtags }
    ];
  }, [marketing]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-4">
      {/* Premium Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl">
        {/* Glow Effects Background */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-bold text-indigo-600">
              <Sparkles size={13} className="text-indigo-500" />
              <span>AI MARKETING STUDIO</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Marketing Campaign Kit
            </h1>
            <p className="text-sm sm:text-base text-slate-500 font-medium">
              Generating high-converting scripts for{" "}
              <span className="text-indigo-600 font-bold">{productName}</span>.
            </p>
          </div>

          {/* Action Button */}
          <div className="shrink-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generateMarketing}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:opacity-95 disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="animate-spin" size={18} />
              ) : (
                <Zap size={18} className="fill-white" />
              )}
              <span>{loading ? "Generating Assets..." : marketing ? "Regenerate Kit" : "Generate Marketing Kit"}</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700"
        >
          <AlertCircle size={18} className="shrink-0 text-red-500" />
          <p>{error}</p>
        </motion.div>
      )}

      {/* Empty State */}
      {!marketing && !loading && !error && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 py-16 px-4 text-center">
          <div className="rounded-2xl bg-white p-4 text-slate-400 shadow-sm border border-slate-100 mb-4">
            <Layout size={36} />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Marketing Kit Generated Yet</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">
            Click the generate button above to create customized ad copy, TikTok scripts, SEO tags, and social captions.
          </p>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 w-full animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      )}

      {/* Marketing Results */}
      <AnimatePresence>
        {marketing && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* AI Insight Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Marketing Score", val: stats.score, color: "text-indigo-600" },
                { label: "Est. Conversion", val: stats.conversion, color: "text-emerald-600" },
                { label: "Est. Click Rate", val: stats.ctr, color: "text-purple-600" },
                { label: "Est. Target ROAS", val: stats.roas, color: "text-amber-600" }
              ].map((stat, i) => (
                <div key={i} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{stat.label}</p>
                  <p className={`text-2xl font-black mt-1 ${stat.color}`}>{stat.val}</p>
                </div>
              ))}
            </div>

            {/* Generated Marketing Content Cards */}
            <div className="space-y-4">
              {contentItems.map((item) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                      {item.title}
                    </h3>
                    <button
                      onClick={() => handleCopy(item.content, item.id)}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check size={14} className="text-emerald-500" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                    {item.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}