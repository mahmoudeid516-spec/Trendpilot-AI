"use client";

import { ReactNode } from "react";
import clsx from "clsx";

type DashboardCardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
};

const paddingClasses = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function DashboardCard({
  children,
  className,
  hover = true,
  padding = "md",
}: DashboardCardProps) {
  return (
    <div
      className={clsx(
        "rounded-3xl border border-slate-200 bg-white",
        "shadow-sm transition-all duration-300",
        hover && "hover:-translate-y-1 hover:shadow-xl",
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}