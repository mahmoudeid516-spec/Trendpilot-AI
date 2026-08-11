import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
};

const PADDING: Record<NonNullable<Props["padding"]>, string> = {
  none: "",
  sm: "p-5",
  md: "p-6 sm:p-7",
  lg: "p-6 sm:p-8",
};

/** Base surface for every panel/card in the dashboard, so radius, border,
 * and shadow stay identical everywhere instead of drifting per-component. */
export default function Card({ children, className = "", interactive = false, padding = "lg" }: Props) {
  return (
    <div className={`tp-card ${interactive ? "tp-card-interactive" : ""} ${PADDING[padding]} ${className}`}>
      {children}
    </div>
  );
}
