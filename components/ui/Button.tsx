"use client";

import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Variant =
  | "primary"
  | "secondary"
  | "success"
  | "danger";

interface Props
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variants = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700",

  secondary:
    "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50",

  success:
    "bg-emerald-600 text-white hover:bg-emerald-700",

  danger:
    "bg-red-600 text-white hover:bg-red-700",
};

export default function Button({
  variant = "primary",
  className,
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={clsx(
        "rounded-full px-6 py-3 font-semibold transition-all duration-300",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className
      )}
    />
  );
}