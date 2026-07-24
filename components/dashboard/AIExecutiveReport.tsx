"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Copy,
  Check,
  AlertTriangle,
  TrendingUp,
  Globe,
  Target,
  DollarSign,
  Zap,
  LayoutDashboard,
  Shield,
  BarChart3,
  ChevronRight,
  TrendingDown,
  Activity,
  Rocket
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import type { Product } from "../../types/Product";

type Props = {
  product: Product;
};

type AIReport = {
  executive_summary: string;
  strengths: string[];
  weaknesses: string[];
  target_audience: string;
  best_countries: string[];
  marketing_strategy: string;
  facebook_ad: string;
  tiktok_hook: string;
  instagram_caption: string;
  shopify_description: string;
  call_to_action: string;
  recommended_budget: string;
  risk_level: string;
  launch_decision: string;
};

// --- Reusable Components ---

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`rounded-3xl border border-white/20 bg-white/60 p-6 shadow-xl backdrop-blur-xl ${className}`}
  >
    {children}
  </motion.div>
);

const MetricCard = ({ title, value, icon: Icon, trend }: { title: string, value: string, icon: any, trend?: string }) => (
  <GlassCard className="flex flex-col gap-2">
    <div className="flex items-center justify-between text-slate-500">
      <Icon size={18} />
      {trend && <span className="text-xs font-bold text-indigo-600">{trend}</span>}
    </div>
    <div className="text-2xl font-bold text-slate-900">{value}</div>
    <div className="text-xs text-slate-500 font-medium">{title}</div>
  </GlassCard>
);

export default function AIExecutiveReport({ product }: Props) {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AIReport | null>(null);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("facebook");

  const chartData = useMemo(() => [
    { name: 'Day 0', value: 0 },
    { name: 'Day 30', value: 2400 },
    { name: 'Day 60', value: 4500 },
    { name: 'Day 90', value: 8900 },
  ], []);

  async function generateReport() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/ai-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });
      if (!res.ok) throw new Error("Failed to generate report");
      const data = await res.json();
      setReport(data);
    } catch (err) {
      setError("Unable to generate AI report. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const shortTitle =
  product.name.length > 60
    ? product.name.substring(0, 60) + "..."
    : product.name;
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 space-y-8 font-sans">
      
      {/* 1. Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        className="relative overflow-hidden rounded-[2rem] bg-slate-900 p-8 md:p-12 text-white shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-2">
          <div>
            <div className="flex gap-2 mb-6">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-bold tracking-wider">AI ANALYTICS</span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold tracking-wider">LIVE DATA</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">{shortTitle}</h1>
            <p className="text-slate-400 text-lg mb-8 max-w-lg">Advanced executive intelligence model trained on market volatility and trend patterns.</p>
            <button 
              onClick={generateReport}
              disabled={loading}
              className="flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl font-bold hover:scale-105 transition-all"
            >
              {loading ? <Activity className="animate-spin" /> : <Rocket />}
              {loading ? "Simulating..." : "Generate Report"}
            </button>
          </div>
          <div className="hidden lg:flex items-center justify-end">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-lg border border-white/10">
                <div className="text-4xl font-bold text-indigo-300">98%</div>
                <div className="text-xs text-slate-400">Confidence</div>
              </div>
              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-lg border border-white/10">
                <div className="text-4xl font-bold text-emerald-300">High</div>
                <div className="text-xs text-slate-400">Verdict</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {report && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          
          {/* Dashboard KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard title="Revenue" value="$29,000" icon={LayoutDashboard} trend="+12%" />
            <MetricCard title="ROI" value="145%" icon={BarChart3} trend="+8%" />
            <MetricCard title="Daily Budget" value={report.recommended_budget} icon={DollarSign} />
            <MetricCard title="Target Markets" value={report.best_countries.length.toString()} icon={Globe} />
          </div>

          {/* AI Recommendation */}
          <GlassCard className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-none">
            <div className="flex items-start gap-4">
              <Sparkles className="text-yellow-300 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">AI Verdict: {report.launch_decision}</h3>
                <p className="text-indigo-100 opacity-90">{report.call_to_action}</p>
              </div>
            </div>
          </GlassCard>

          {/* Main Grid: Intelligence & Risks */}
          <div className="grid lg:grid-cols-3 gap-8">
            <GlassCard className="lg:col-span-2">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Activity /> Market Forecast</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none' }} />
                    <Area type="monotone" dataKey="value" stroke="#4f46e5" fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard className="flex flex-col gap-6">
              <h3 className="font-bold text-lg flex items-center gap-2"><Shield /> Risk Analysis</h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-slate-500">Risk Level</span>
                    <span className="font-bold">{report.risk_level}</span>
                 </div>
                 <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-indigo-500" initial={{width: 0}} animate={{width: "40%"}} />
                 </div>
                 <p className="text-sm text-slate-600">{report.weaknesses[0]}</p>
              </div>
            </GlassCard>
          </div>

          {/* Marketing Studio */}
          <GlassCard>
            <h3 className="font-bold text-lg mb-6">Marketing Studio</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {['facebook', 'tiktok', 'instagram', 'shopify'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeTab === tab ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-slate-50 p-6 rounded-2xl border border-slate-200"
              >
                <div className="flex justify-between items-start">
                  <p className="text-slate-700 leading-relaxed">
                    {activeTab === 'facebook' ? report.facebook_ad : 
                     activeTab === 'tiktok' ? report.tiktok_hook :
                     activeTab === 'instagram' ? report.instagram_caption : report.shopify_description}
                  </p>
                  <button 
                    onClick={() => copyToClipboard("Copied", activeTab)}
                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    {copiedId === activeTab ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </GlassCard>

          {/* Strengths & Weaknesses */}
          <div className="grid md:grid-cols-2 gap-6">
             <GlassCard className="border-emerald-200 bg-emerald-50/50">
                <h4 className="font-bold mb-4 flex items-center gap-2"><Check size={18} className="text-emerald-600"/> Strengths</h4>
                <ul className="space-y-2">
                   {report.strengths.map((s, i) => <li key={i} className="text-sm text-slate-700">• {s}</li>)}
                </ul>
             </GlassCard>
             <GlassCard className="border-rose-200 bg-rose-50/50">
                <h4 className="font-bold mb-4 flex items-center gap-2"><AlertTriangle size={18} className="text-rose-600"/> Weaknesses</h4>
                <ul className="space-y-2">
                   {report.weaknesses.map((w, i) => <li key={i} className="text-sm text-slate-700">• {w}</li>)}
                </ul>
             </GlassCard>
          </div>

        </motion.div>
      )}
    </div>
  );
}