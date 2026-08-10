import type { ReactNode } from "react";
import { toneSoftBg, toneText, type Tone } from "./tone";

type Props = {
  children: ReactNode;
  tone?: Tone;
  className?: string;
};

export default function Pill({ children, tone = "neutral", className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${toneSoftBg[tone]} ${toneText[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
