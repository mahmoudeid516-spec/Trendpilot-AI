"use client";

import { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import clsx from "clsx";

type MetricCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export default function MetricCard({
  title,
  value,
  subtitle,
  change,
  trend = "neutral",
  icon,
  footer,
  className,
}: MetricCardProps) {
  return (
    <div
      className={clsx(
        "group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-xl",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>

          {subtitle && (
            <p className="mt-2 text-sm text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        {icon && (
          <div className="rounded-2xl bg-slate-100 p-3 transition group-hover:scale-110">
            {icon}
          </div>
        )}
      </div>

      {(change || footer) && (
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
          {change ? (
            <div
              className={clsx(
                "flex items-center gap-1 text-sm font-semibold",
                trend === "up" && "text-emerald-600",
                trend === "down" && "text-red-500",
                trend === "neutral" && "text-slate-500"
              )}
            >
              {trend === "up" && <ArrowUpRight size={16} />}
              {trend === "down" && <ArrowDownRight size={16} />}
              {change}
            </div>
          ) : (
            <div />
          )}

          {footer}
        </div>
      )}
    </div>
  );
}