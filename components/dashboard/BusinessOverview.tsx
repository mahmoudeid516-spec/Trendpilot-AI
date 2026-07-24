"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  DollarSign, 
  Trophy, 
  BrainCircuit, 
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

type CardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  trend?: string;
  progress?: number;
};

type Props = {
  products: any[];
};

/**
 * Reusable Premium Metric Card
 */
function OverviewCard({ title, value, subtitle, icon, color, trend, progress }: CardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-3xl bg-white/60 p-6 backdrop-blur-xl border border-white/50 shadow-sm transition-all hover:shadow-xl"
    >
      {/* Animated Gradient Border Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-[0.03]`} />
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2.5 rounded-2xl bg-gradient-to-br ${color} bg-opacity-10 text-slate-800`}>
            {icon}
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <ArrowUpRight size={12} />
              {trend}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">
            {title}
          </p>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            {value}
          </h2>
          <p className="text-sm text-slate-400 mt-1 font-medium">{subtitle}</p>
        </div>

        {/* Progress Bar for AI Score specifically */}
        {progress !== undefined && (
          <div className="mt-4 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className={`h-full bg-gradient-to-r ${color}`} 
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function BusinessOverview({ products }: Props) {
  const stats = useMemo(() => {
    const totalRevenue = products.reduce(
      (sum: number, p: any) => sum + Number(p.selling_price || 0),
      0
    );

    const totalProfit = products.reduce(
      (sum: number, p: any) => sum + Number(p.profit || 0),
      0
    );

    const winningProducts = products.filter(
      (p: any) => Number(p.ai_score || 0) >= 90
    ).length;

    const avgAI =
      products.length > 0
        ? Math.round(
            products.reduce(
              (sum: number, p: any) => sum + Number(p.ai_score || 0),
              0
            ) / products.length
          )
        : 0;
        
    return { totalRevenue, totalProfit, winningProducts, avgAI };
  }, [products]);

  return (
    <section className="mb-10">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <OverviewCard
          title="Sales Potential"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          subtitle="Estimated Total Revenue"
          icon={<TrendingUp size={20} />}
          color="from-emerald-500 to-teal-500"
          trend="+12.5%"
        />

        <OverviewCard
          title="Profit Potential"
          value={`$${stats.totalProfit.toLocaleString()}`}
          subtitle="Estimated Net Margin"
          icon={<DollarSign size={20} />}
          color="from-indigo-500 to-purple-500"
          trend="+8.2%"
        />

        <OverviewCard
          title="Winning Products"
          value={stats.winningProducts.toString()}
          subtitle="Products with 90+ Score"
          icon={<Trophy size={20} />}
          color="from-amber-500 to-orange-500"
        />

        <OverviewCard
          title="Average AI Score"
          value={`${stats.avgAI}%`}
          subtitle="Market Confidence Index"
          icon={<BrainCircuit size={20} />}
          color="from-blue-500 to-cyan-500"
          progress={stats.avgAI}
        />
      </div>
    </section>
  );
}