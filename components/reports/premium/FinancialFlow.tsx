import { ArrowDown } from "lucide-react";
import type { AIReport } from "../../../types/AIReport";
import MetricCard from "./MetricCard";

function formatCurrency(value: number): string {
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

type FinancialFlowProps = {
  report: AIReport;
};

export default function FinancialFlow({ report }: FinancialFlowProps) {
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          icon={<span>$</span>}
          label="COGS"
          value={formatCurrency(report.profit_estimation.estimated_cogs)}
          helper="Estimated cost"
          accent="amber"
        />
        <MetricCard
          icon={<span>$</span>}
          label="Selling Price"
          value={formatCurrency(report.profit_estimation.suggested_selling_price)}
          helper="Suggested price"
          accent="indigo"
        />
        <MetricCard
          icon={<span>$</span>}
          label="Profit"
          value={formatCurrency(report.profit_estimation.gross_profit_per_unit)}
          helper="Per unit"
          accent="emerald"
        />
        <MetricCard
          icon={<span>%</span>}
          label="Margin"
          value={`${report.profit_estimation.gross_margin_percent}%`}
          helper="Gross margin"
          accent="cyan"
        />
        <MetricCard
          icon={<span>#</span>}
          label="Break-even"
          value={String(report.profit_estimation.break_even_units)}
          helper="Units"
          accent="violet"
        />
      </div>

      <div className="mt-3 hidden items-center justify-between px-2 text-slate-300 lg:flex">
        <ArrowDown size={14} className="rotate-[-90deg]" />
        <ArrowDown size={14} className="rotate-[-90deg]" />
        <ArrowDown size={14} className="rotate-[-90deg]" />
        <ArrowDown size={14} className="rotate-[-90deg]" />
      </div>

      <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">90-Day Profit Outlook</p>
        <p className="mt-2 text-sm leading-7 text-emerald-900">{report.profit_estimation.first_90_day_profit_potential}</p>
      </div>
    </div>
  );
}
