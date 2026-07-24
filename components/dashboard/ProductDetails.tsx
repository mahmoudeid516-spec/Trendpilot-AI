"use client";
import CompetitorAI from "./CompetitorAI";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  Zap,
  Target,
  BarChart3,
  RefreshCw,
  Copy,
  Check,
  Megaphone,
  Image,
  Video,
  Search,
  Hash,
  MessageSquareText,
} from "lucide-react";

// --- Services/Types ---
import { analyzeProduct } from "../../services/decisionEngine";
import { calculateAIScore } from "../../services/aiScore";
import { generateMarketing } from "../../lib/services/generateMarketing";
import { analyzeMarket } from "../../services/marketAnalyzer";
import SimilarProducts from "./SimilarProducts";
import { calculateROI } from "../../services/roiCalculator";
import type { Product } from "../../types/Product";
import { generateBusinessPlan } from "../../services/businessCoach";

// --- Types ---
interface MarketingResult {
  executive_summary: string;
  target_audience: string;
  usp: string;

  facebook_ad: string;
  instagram_caption: string;
  tiktok_hook: string;

  shopify_description: string;
  email_campaign: string;

  seo_title: string;
  seo_description: string;
  keywords: string;
  hashtags: string;

  pricing_strategy: string;
  launch_strategy: string;
  marketing_funnel: string;
}

// --- Components ---

const Card = ({ children, className = "", noPadding = false }: { children: React.ReactNode, className?: string, noPadding?: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)] rounded-3xl ${noPadding ? "" : "p-6"} ${className}`}
  >
    {children}
  </motion.div>
);

const StatItem = ({ label, value, trend, icon: Icon }: any) => (
  <div className="flex flex-col">
    <div className="flex items-center gap-2 mb-1">
      <Icon className="w-4 h-4 text-indigo-500" />
      <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{label}</span>
    </div>
    <div className="flex items-baseline gap-2">
      <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
      {trend && <span className="text-emerald-500 text-xs font-medium bg-emerald-50 px-2 py-0.5 rounded-full">{trend}</span>}
    </div>
  </div>
);

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-900">
      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
    </button>
  );
};

const MarketingField = ({ label, icon: Icon, value }: { label: string, icon: any, value: string }) => (
  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-2 text-indigo-600 font-bold">
        <Icon className="w-4 h-4" />
        <span className="text-sm uppercase tracking-wider">{label}</span>
      </div>
      <CopyButton text={value} />
    </div>
    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{value}</p>
  </div>
);

// --- Main Component ---

type Props = {
  product: Product;
  allProducts?: Product[];
};

export default function ProductDetails({ product, allProducts = [] }: Props) {
  if (!product) return null;

  const [marketing, setMarketing] = useState<MarketingResult | null>(null);
  const copyAllMarketing = () => {

    const exportPDF = () => {
      if (!marketing) return;
    
      const doc = new jsPDF();
    
      doc.setFontSize(22);
      doc.text("TrendPilot AI", 14, 20);
    
      doc.setFontSize(12);
      doc.text(`Product: ${product.name}`, 14, 30);
    
      autoTable(doc, {
        startY: 40,
        head: [["Section", "Content"]],
        body: [
          ["Executive Summary", marketing.executive_summary],
          ["Target Audience", marketing.target_audience],
          ["USP", marketing.usp],
          ["Facebook Ad", marketing.facebook_ad],
          ["Instagram", marketing.instagram_caption],
          ["TikTok", marketing.tiktok_hook],
          ["Shopify", marketing.shopify_description],
          ["Email Campaign", marketing.email_campaign],
          ["SEO Title", marketing.seo_title],
          ["SEO Description", marketing.seo_description],
          ["Keywords", marketing.keywords],
          ["Hashtags", marketing.hashtags],
          ["Pricing Strategy", marketing.pricing_strategy],
          ["Launch Strategy", marketing.launch_strategy],
          ["Marketing Funnel", marketing.marketing_funnel],
        ],
      });
    
      doc.save(`${product.name}-Marketing-Report.pdf`);
    };

    if (!marketing) return;
  
    const report = `
  📊 EXECUTIVE SUMMARY
  ${marketing.executive_summary}
  
  🎯 TARGET AUDIENCE
  ${marketing.target_audience}
  
  💎 UNIQUE SELLING PROPOSITION
  ${marketing.usp}
  
  📢 FACEBOOK AD
  ${marketing.facebook_ad}
  
  📸 INSTAGRAM CAPTION
  ${marketing.instagram_caption}
  
  🎬 TIKTOK HOOK
  ${marketing.tiktok_hook}
  
  🛒 SHOPIFY DESCRIPTION
  ${marketing.shopify_description}
  
  📧 EMAIL CAMPAIGN
  ${marketing.email_campaign}
  
  🔍 SEO TITLE
  ${marketing.seo_title}
  
  📝 SEO DESCRIPTION
  ${marketing.seo_description}
  
  🔑 SEO KEYWORDS
  ${marketing.keywords}
  
  #️⃣ HASHTAGS
  ${marketing.hashtags}
  
  💰 PRICING STRATEGY
  ${marketing.pricing_strategy}
  
  🚀 LAUNCH STRATEGY
  ${marketing.launch_strategy}
  
  📈 MARKETING FUNNEL
  ${marketing.marketing_funnel}
  `;
  
    navigator.clipboard.writeText(report);
    alert("Marketing report copied successfully!");
  };

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("strategy");

  const data = useMemo(() => {
    const decision = analyzeProduct(product);
    const market = analyzeMarket(product);
    const plan = generateBusinessPlan(product);
    const roi = calculateROI(Number(product.buy_price), Number(product.selling_price), 200, 50);
    const aiScore = calculateAIScore(product);
    
    const forecast = [
      { day: "Day 0", revenue: 0 },
      { day: "Day 30", revenue: roi.revenue * 0.4 },
      { day: "Day 60", revenue: roi.revenue * 0.7 },
      { day: "Day 90", revenue: roi.revenue },
    ];

    return {
      decision,
      market,
      plan,
      roi,
      forecast,
      aiScore,
    };
  }, [product]);

  const handleGenerateMarketing = async () => {
    setLoading(true);
    try {
      const result = await generateMarketing(product);
      setMarketing(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    if (!marketing) return;
  
    const doc = new jsPDF();
  
    doc.setFontSize(22);
    doc.text("TrendPilot AI", 14, 20);
  
    doc.setFontSize(12);
    doc.text(`Product: ${product.name}`, 14, 30);
  
    autoTable(doc, {
      startY: 40,
      head: [["Section", "Content"]],
      body: [
        ["Executive Summary", marketing.executive_summary],
        ["Target Audience", marketing.target_audience],
        ["USP", marketing.usp],
        ["Facebook Ad", marketing.facebook_ad],
        ["Instagram", marketing.instagram_caption],
        ["TikTok", marketing.tiktok_hook],
        ["Shopify Description", marketing.shopify_description],
        ["Email Campaign", marketing.email_campaign],
        ["SEO Title", marketing.seo_title],
        ["SEO Description", marketing.seo_description],
        ["Keywords", marketing.keywords],
        ["Hashtags", marketing.hashtags],
        ["Pricing Strategy", marketing.pricing_strategy],
        ["Launch Strategy", marketing.launch_strategy],
        ["Marketing Funnel", marketing.marketing_funnel],
      ],
    });
  
    doc.save(`${product.name}-Marketing-Report.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 space-y-8 font-sans text-slate-900 selection:bg-indigo-100">
      
      <section className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 flex flex-col md:flex-row gap-8 items-center bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-none shadow-2xl">
          <div className="relative w-full md:w-64 h-64 shrink-0">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-3xl" />
            <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-3xl border border-white/10 shadow-xl" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-100 text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
              {data.decision.verdict}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{product.name}</h1>
            <p className="text-indigo-200 text-lg">{product.category} • {product.platform}</p>
          </div>
        </Card>

        <Card className="flex flex-col justify-between h-full bg-indigo-50 border-indigo-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-600 rounded-lg text-white"><Zap className="w-5 h-5" /></div>
            <h2 className="font-bold text-indigo-900">Executive Summary</h2>
          </div>
          <p className="text-indigo-900/70 text-sm leading-relaxed mb-6">
            Our AI analysis indicates a {data.decision.verdict.toLowerCase()} opportunity for {product.name}. 
            With a winning probability of {data.decision.winningProbability}%, the model suggests prioritizing {data.plan.bestPlatform}.
          </p>
          <div className="mt-auto">
            <div className="text-xs font-bold text-indigo-900/50 uppercase mb-2">Market Sentiment</div>
            <div className="h-2 bg-indigo-200 rounded-full overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: `${data.decision.confidence}%` }} className="h-full bg-indigo-600" />
            </div>
          </div>
        </Card>
      </section>

      <Card className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm uppercase tracking-wider opacity-80">
        AI Product Score
      </p>

      <h2 className="text-5xl font-extrabold mt-2">
        {data.aiScore.overall}/100
      </h2>

      <p className="mt-3 text-indigo-100">
        {data.aiScore.recommendation}
      </p>
    </div>

    <div className="text-7xl">
      ⭐
    </div>
  </div>

  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">

    <div>
      <p className="text-indigo-200 text-sm">🔥 Trend</p>
      <h3 className="text-2xl font-bold">
        {data.aiScore.trend}
      </h3>
    </div>

    <div>
      <p className="text-indigo-200 text-sm">💰 Profit</p>
      <h3 className="text-2xl font-bold">
        {data.aiScore.profit}
      </h3>
    </div>

    <div>
      <p className="text-indigo-200 text-sm">📈 Demand</p>
      <h3 className="text-2xl font-bold">
        {data.aiScore.demand}
      </h3>
    </div>

    <div>
      <p className="text-indigo-200 text-sm">⚔ Competition</p>
      <h3 className="text-2xl font-bold">
        {data.aiScore.competition}
      </h3>
    </div>

    <div>
      <p className="text-indigo-200 text-sm">📦 Saturation</p>
      <h3 className="text-2xl font-bold">
        {data.aiScore.saturation}
      </h3>
    </div>

    <div>
      <p className="text-indigo-200 text-sm">🚀 Scalability</p>
      <h3 className="text-2xl font-bold">
        {data.aiScore.scalability}
      </h3>
    </div>

  </div>
</Card>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><StatItem label="Revenue" value={`$${data.roi.revenue.toFixed(0)}`} icon={DollarSign} trend="+12%" /></Card>
        <Card><StatItem label="Profit" value={`$${data.roi.profit.toFixed(0)}`} icon={TrendingUp} trend="+8%" /></Card>
        <Card><StatItem label="ROI" value={`${data.roi.roi.toFixed(1)}%`} icon={BarChart3} trend="High" /></Card>
        <Card><StatItem label="Daily Budget" value={`$${data.plan.dailyBudget}`} icon={Target} /></Card>
      </section>

      <section className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
            <h3 className="font-bold text-xl mb-6">Market Intelligence</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.forecast}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#4f46e5" fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
        </Card>

        <Card>
            <h3 className="font-bold text-xl mb-6">Action Plan</h3>
            <div className="space-y-4">
              {data.plan.strategy.map((step: string, i: number) => (
                <motion.div key={i} whileHover={{ x: 5 }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">{i+1}</div>
                  <p className="text-sm font-medium text-slate-700">{step}</p>
                </motion.div>
              ))}
            </div>
        </Card>
      </section>

      <section>
        <div className="flex gap-2 mb-6 border-b border-slate-200">
          {['Strategy', 'Ads', 'Content'].map((t) => (
            <button key={t} onClick={() => setActiveTab(t.toLowerCase())} className={`pb-4 px-4 font-bold text-sm ${activeTab === t.toLowerCase() ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-400'}`}>
              {t}
            </button>
          ))}
        </div>
        
        <Card>
        <div className="flex items-center gap-3">

{marketing && (
  <button
    onClick={copyAllMarketing}
    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
  >
    📋 Copy All
  </button>
)}

{marketing && (
  <button
    onClick={exportPDF}
    className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition"
  >
    📄 Export PDF
  </button>
)}

<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  onClick={handleGenerateMarketing}
  disabled={loading}
  className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition"
>
  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
  Generate
</motion.button>


</div>
          
          <AnimatePresence>
            {marketing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 grid md:grid-cols-2 gap-4"
              >
                <MarketingField label="Facebook Ad" icon={Megaphone} value={marketing.facebook_ad} />
                <MarketingField label="Instagram Caption" icon={Image} value={marketing.instagram_caption} />
                <MarketingField label="TikTok Hook" icon={Video} value={marketing.tiktok_hook} />
                <MarketingField label="SEO Title" icon={Search} value={marketing.seo_title} />
                <MarketingField label="SEO Description" icon={MessageSquareText} value={marketing.seo_description} />
                <MarketingField label="Hashtags" icon={Hash} value={marketing.hashtags} />

                <MarketingField
  label="Executive Summary"
  icon={BarChart3}
  value={marketing.executive_summary}
/>

<MarketingField
  label="Target Audience"
  icon={Target}
  value={marketing.target_audience}
/>

<MarketingField
  label="Unique Selling Proposition"
  icon={Zap}
  value={marketing.usp}
/>

<MarketingField
  label="Shopify Description"
  icon={MessageSquareText}
  value={marketing.shopify_description}
/>

<MarketingField
  label="Email Campaign"
  icon={MessageSquareText}
  value={marketing.email_campaign}
/>

<MarketingField
  label="SEO Keywords"
  icon={Search}
  value={marketing.keywords}
/>

<MarketingField
  label="Pricing Strategy"
  icon={DollarSign}
  value={marketing.pricing_strategy}
/>

<MarketingField
  label="Launch Strategy"
  icon={TrendingUp}
  value={marketing.launch_strategy}
/>

<MarketingField
  label="Marketing Funnel"
  icon={Target}
  value={marketing.marketing_funnel}
/>

              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </section>

      <section>
  <h3 className="font-bold text-xl mb-6">Recommended Alternatives</h3>
  <SimilarProducts current={product} products={allProducts} />
</section>

<CompetitorAI product={product} />

</div>
);
}