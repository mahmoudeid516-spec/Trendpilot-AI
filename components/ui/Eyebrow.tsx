import type { ReactNode } from "react";
import { toneSoftBg, toneText, type Tone } from "./tone";

type Props = {
  icon: ReactNode;
  label: string;
  tone: Tone;
  className?: string;
};

/** Small icon + uppercase label used to mark a section's identity at a
 * glance (e.g. "AI ADVISOR" vs "PRODUCT SEARCH ENGINE"). Deliberately
 * restrained -- a soft tint, not a gradient banner. */
export default function Eyebrow({ icon, label, tone, className = "" }: Props) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-lg text-sm ${toneSoftBg[tone]} ${toneText[tone]}`}
      >
        {icon}
      </span>
      <span className={`text-xs font-semibold uppercase tracking-wide ${toneText[tone]}`}>{label}</span>
    </div>
  );
}
