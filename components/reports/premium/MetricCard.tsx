import type { ReactNode } from "react";

type MetricCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  helper?: string;
  accent: "indigo" | "emerald" | "amber" | "rose" | "cyan" | "violet";
};

const ACCENT_STYLES: Record<MetricCardProps["accent"], { ring: string; bg: string; text: string }> = {
  indigo: {
    ring: "ring-indigo-200",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
  },
  emerald: {
    ring: "ring-emerald-200",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  amber: {
    ring: "ring-amber-200",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  rose: {
    ring: "ring-rose-200",
    bg: "bg-rose-50",
    text: "text-rose-700",
  },
  cyan: {
    ring: "ring-cyan-200",
    bg: "bg-cyan-50",
    text: "text-cyan-700",
  },
  violet: {
    ring: "ring-violet-200",
    bg: "bg-violet-50",
    text: "text-violet-700",
  },
};

export default function MetricCard({ icon, label, value, helper, accent }: MetricCardProps) {
  const style = ACCENT_STYLES[accent];

  return (
    <article className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ${style.ring}`}>
      <p className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] ${style.text}`}>
        <span className={`inline-flex h-5 w-5 items-center justify-center rounded-md ${style.bg}`}>{icon}</span>
        {label}
      </p>
      <p className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">{value}</p>
      {helper ? <p className="mt-1 text-xs text-slate-500">{helper}</p> : null}
    </article>
  );
}
