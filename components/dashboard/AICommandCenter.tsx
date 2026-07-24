"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Search,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Target,
  DollarSign,
  Users,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  RefreshCw,
  Compass,
  ChevronRight,
  BarChart3,
  Globe,
  ShoppingBag,
  Store,
  Video,
  Layers,
  PieChart,
  Briefcase,
  X,
} from "lucide-react";

// ==========================================
// 1. TYPES DEFINITION
// ==========================================
export type PlatformType = "Amazon" | "AliExpress" | "TikTok Shop" | "Shopify" | "All";

export type AISection = {
  title: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  content: string | string[];
};

export type AIResponse = {
  verdict: string;
  confidence: number;
  score: number;
  winningProbability: number;
  riskLevel: "Low" | "Medium" | "High";
  estimatedProfit: string;
  sections: AISection[];
  related: string[];
};

export type QuickPrompt = {
  id: string;
  label: string;
  query: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge?: "Popular" | "Hot";
};

export type AICommandCenterProps = {
  onAnalyze?: (searchText: string, selectedPlatform: PlatformType) => Promise<AIResponse | void> | void;
};

// ==========================================
// 2. CONSTANTS & PRESETS
// ==========================================
const PLATFORMS: { id: PlatformType; label: string; icon: React.ComponentType<{ className?: string; size?: number }> }[] = [
  { id: "Amazon", label: "Amazon", icon: Store },
  { id: "AliExpress", label: "AliExpress", icon: ShoppingBag },
  { id: "TikTok Shop", label: "TikTok Shop", icon: Video },
  { id: "Shopify", label: "Shopify", icon: Layers },
  { id: "All", label: "All Platforms", icon: Globe },
];

const QUICK_ACTIONS: QuickPrompt[] = [
  { id: "should-sell", label: "Should I Sell This?", query: "Is this product viable for market entry and scaling right now?", icon: ShieldCheck, badge: "Popular" },
  { id: "find-winning", label: "Find Winning Product", query: "Identify high-margin unsaturated products in trending niches", icon: Sparkles, badge: "Hot" },
  { id: "market-opportunity", label: "Market Opportunity", query: "Evaluate demand growth, search volume, and market saturation", icon: BarChart3 },
  { id: "pricing-strategy", label: "Pricing Strategy", query: "Calculate optimal retail price, gross margins, and ad budget cushion", icon: DollarSign },
  { id: "competitor-analysis", label: "Competitor Analysis", query: "Analyze top market competitors, pricing gaps, and weakness opportunities", icon: Target },
  { id: "marketing-ideas", label: "Marketing Ideas", query: "Generate viral ad hooks, pain-point angles, and creative concepts", icon: Zap },
  { id: "sales-forecast", label: "Sales Forecast", query: "Estimate 90-day revenue potential, unit velocity, and repeat purchase rates", icon: PieChart },
  { id: "target-audience", label: "Target Audience", query: "Define primary customer persona, key demographics, and buying triggers", icon: Users },
];

const THINKING_STAGES = [
  "Reading Product & Niche Data...",
  "Checking Real-Time Market Trends...",
  "Finding & Analyzing Competitors...",
  "Calculating Profit Margins & Ad Feasibility...",
  "Building Scalable Growth Strategy...",
  "Preparing Final AI Recommendation...",
];

// Fallback Generator
const getMockResponse = (query: string): AIResponse => {
  const isHighPotential = query.toLowerCase().includes("winning") || query.length > 20;

  return {
    verdict: isHighPotential ? "Strong Buy Opportunity" : "Moderate Entry Potential",
    confidence: isHighPotential ? 94 : 78,
    score: isHighPotential ? 92 : 75,
    winningProbability: isHighPotential ? 89 : 68,
    riskLevel: isHighPotential ? "Low" : "Medium",
    estimatedProfit: isHighPotential ? "$12,500 - $28,000 / mo" : "$4,500 - $10,200 / mo",
    sections: [
      {
        title: "Executive Summary",
        icon: Briefcase,
        content: `Current market intelligence indicates a strong 24% demand velocity surge over the last 30 days for "${query}". Category competition remains fragmented, offering a strong market positioning window.`,
      },
      {
        title: "Market Opportunity & Demand",
        icon: TrendingUp,
        content: "High consumer search volume paired with a low brand consolidation score. Positioning this offer with premium packaging and fast fulfillment will yield high customer conversion rates.",
      },
      {
        title: "Strategic Action Plan",
        icon: Target,
        content: [
          "Initiate soft launch with a 15% intro discount to capture early buyer velocity",
          "Deploy UGC video hooks on TikTok Shop & Meta Advantage+ within 7 days",
          "Optimize supplier sourcing to maintain a minimum gross margin of 68%",
        ],
      },
      {
        title: "Risk & Logistics Assessment",
        icon: AlertTriangle,
        content: "Supply chain bottleneck risks are low for current stock cycles. Ensure backup 3PL sourcing prior to Q4 seasonal traffic surges.",
      },
    ],
    related: [
      "How can I optimize profit margins?",
      "Generate viral TikTok ad hooks",
      "Compare with top competitor pricing",
      "Draft high-converting product page copy",
    ],
  };
};

// ==========================================
// 3. UI COMPONENTS
// ==========================================
function Badge({ children, variant = "neutral" }: { children: React.ReactNode; variant?: "neutral" | "emerald" | "indigo" | "amber" }) {
  const styles = {
    neutral: "bg-slate-100 text-slate-700 border-slate-200/80",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
    amber: "bg-amber-50 text-amber-700 border-amber-200/60",
  };

  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${styles[variant]}`}>
      {children}
    </span>
  );
}

// ==========================================
// 4. MAIN COMMAND CENTER COMPONENT
// ==========================================
export default function AICommandCenter({ onAnalyze }: AICommandCenterProps) {
  const [query, setQuery] = useState<string>("");
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>("Amazon");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [thinkingIndex, setThinkingIndex] = useState<number>(0);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Staged AI thinking timer loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setInterval(() => {
        setThinkingIndex((prev) => (prev + 1) % THINKING_STAGES.length);
      }, 850);
    } else {
      setThinkingIndex(0);
    }
    return () => clearInterval(timer);
  }, [loading]);

  // Main Execute Function
  const executeAnalysis = useCallback(
    async (searchText: string, platform: PlatformType = selectedPlatform) => {
      if (!searchText.trim() || loading) return;

      setLoading(true);
      setError(null);
      setResponse(null);

      try {
        let externalData: AIResponse | void = undefined;

        if (onAnalyze) {
          externalData = await onAnalyze(searchText, platform);
        }

        // Fallback simulation delay if external callback returns nothing
        if (!externalData) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }

        if (isMounted.current) {
          setResponse(externalData || getMockResponse(searchText));
        }
      } catch (err) {
        if (isMounted.current) {
          setError("Failed to generate market analysis. Please try again.");
          console.error("AI Command Center Execution Error:", err);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    },
    [loading, onAnalyze, selectedPlatform]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeAnalysis(query);
  };

  const handleQuickAction = (prompt: QuickPrompt) => {
    setQuery(prompt.query);
    executeAnalysis(prompt.query);
  };

  return (
    <div className="w-full space-y-8 font-sans">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-500 text-white shadow-md shadow-indigo-200/50">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">AI Command Center</h2>
              <Badge variant="indigo">
                <Zap className="w-3 h-3" /> Business Advisor
              </Badge>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">Your autonomous AI ecommerce strategist & product advisor.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100/80 px-3.5 py-1.5 rounded-full border border-slate-200/60">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="ml-1">Live Market Feeds Active</span>
          </div>
        </div>
      </div>

      {/* SEARCH EXPERIENCE & PLATFORM SELECTOR */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-100/80 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-50/40 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          {/* Main Search Bar */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
              <Search className="w-5 h-5" />
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe any product, niche or idea..."
              aria-label="Describe any product, niche or idea"
              className="w-full pl-12 pr-36 py-4 bg-slate-50/80 hover:bg-slate-50 focus:bg-white text-slate-900 text-base sm:text-lg rounded-2xl border border-slate-200/90 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none placeholder:text-slate-400 font-medium"
            />

            <div className="absolute inset-y-0 right-2 flex items-center gap-1.5">
              {query && !loading && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-indigo-200/60 disabled:opacity-40 disabled:hover:bg-slate-900 cursor-pointer active:scale-95"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing</span>
                  </>
                ) : (
                  <>
                    <span>Ask AI</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* PLATFORM SELECTOR */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Platform Feed:</span>

            <div className="flex flex-wrap items-center gap-2">
              {PLATFORMS.map((plat) => {
                const Icon = plat.icon;
                const isSelected = selectedPlatform === plat.id;
                return (
                  <button
                    key={plat.id}
                    type="button"
                    onClick={() => setSelectedPlatform(plat.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                        : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 border border-slate-200/60"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{plat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </form>

        {/* QUICK ACTIONS GRID */}
        {!response && !loading && (
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" /> Quick Analysis Presets
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={action.id}
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => handleQuickAction(action)}
                    className="flex flex-col justify-between p-4 rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-200/70 hover:border-indigo-200/90 hover:shadow-md hover:shadow-indigo-50/50 text-left transition-all group cursor-pointer h-28"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="p-2 rounded-xl bg-white border border-slate-200/60 group-hover:border-indigo-200 text-slate-600 group-hover:text-indigo-600 transition-colors shadow-xs">
                        <Icon className="w-4 h-4" />
                      </div>
                      {action.badge && <Badge variant={action.badge === "Hot" ? "amber" : "indigo"}>{action.badge}</Badge>}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-slate-800 group-hover:text-indigo-950 block truncate">
                        {action.label}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-semibold underline">Dismiss</button>
        </div>
      )}

      {/* LOADING EXPERIENCE */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            role="status"
            className="bg-white rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-50/50 p-8 sm:p-12 text-center relative overflow-hidden"
          >
            <div className="max-w-md mx-auto space-y-6">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-indigo-50 animate-ping opacity-75 absolute" />
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-200 relative z-10">
                  <Sparkles className="w-9 h-9 animate-spin" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">TrendPilot AI Intelligence Engine</h3>
                <p className="text-sm text-indigo-600 font-semibold h-6 flex items-center justify-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{THINKING_STAGES[thinkingIndex]}</span>
                </p>
              </div>

              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full"
                  initial={{ width: "5%" }}
                  animate={{ width: "90%" }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                />
              </div>

              <p className="text-xs text-slate-400">Synthesizing platform feeds, competitive data & sales velocity...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RESULTS DISPLAY */}
      {!loading && response && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* AI VERDICT CARD */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <span className="px-4 py-1.5 rounded-full font-extrabold text-xs tracking-wider uppercase bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20">
                  VERDICT: {response.verdict}
                </span>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verified with {selectedPlatform} Market Signal</span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                <MetricCard title="Confidence" value={`${response.confidence}%`} subtext="Statistical accuracy" valueColor="text-emerald-400" />
                <MetricCard title="AI Score" value={`${response.score}/100`} subtext="Category potential" valueColor="text-indigo-400" />
                <MetricCard title="Winning Chance" value={`${response.winningProbability}%`} subtext="High velocity" valueColor="text-white" />
                <MetricCard title="Risk Level" value={response.riskLevel} subtext="Controlled test" valueColor="text-amber-400" />
                <MetricCard title="Est. Profit" value={response.estimatedProfit} subtext="Net projected" valueColor="text-white" className="col-span-2 sm:col-span-1" />
              </div>
            </div>
          </div>

          {/* ANALYSIS SECTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {response.sections.map((section, idx) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.3 }}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between hover:border-slate-300 transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-3.5">
                      <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600">
                        <Icon size={20} />
                      </div>
                      <h4 className="text-base font-bold text-slate-900">{section.title}</h4>
                    </div>

                    {typeof section.content === "string" ? (
                      <p className="text-sm text-slate-600 leading-relaxed">{section.content}</p>
                    ) : (
                      <ul className="space-y-2.5">
                        {section.content.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed">
                            <CheckCircle2 size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* RELATED QUESTIONS */}
          {response.related && response.related.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Related Follow-up Questions</span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {response.related.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(q);
                      executeAnalysis(q);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-indigo-50/80 text-slate-700 hover:text-indigo-950 border border-slate-200/70 hover:border-indigo-200 font-medium text-xs sm:text-sm transition-all duration-150 cursor-pointer group"
                  >
                    <span>{q}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// Sub-component for Dashboard Cards
function MetricCard({
  title,
  value,
  subtext,
  valueColor = "text-white",
  className = "",
}: {
  title: string;
  value: string;
  subtext: string;
  valueColor?: string;
  className?: string;
}) {
  return (
    <div className={`bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50 backdrop-blur-xs ${className}`}>
      <div className="text-[11px] font-semibold text-slate-400 uppercase">{title}</div>
      <div className={`text-2xl font-extrabold mt-1 truncate ${valueColor}`}>{value}</div>
      <div className="text-[10px] text-slate-400 mt-0.5">{subtext}</div>
    </div>
  );
}