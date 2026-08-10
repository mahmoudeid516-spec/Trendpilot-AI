import type { Tone } from "./tone";

type Variant = "solid" | "outline" | "ghost";
type Size = "sm" | "md";

const SOLID_TONE: Record<Tone, string> = {
  ai: "bg-[var(--accent-ai)] text-white hover:bg-[#5b3ce0]",
  data: "bg-[var(--accent-data)] text-white hover:bg-[#1d4fd1]",
  positive: "bg-[var(--accent-positive)] text-white hover:bg-[#047a56]",
  warning: "bg-[var(--accent-warning)] text-white hover:bg-[#b8650a]",
  risk: "bg-[var(--accent-risk)] text-white hover:bg-[#b91c1c]",
  neutral: "bg-[var(--ink-900)] text-white hover:bg-black",
};

const OUTLINE_TONE: Record<Tone, string> = {
  ai: "border border-[var(--accent-ai)]/30 text-[var(--accent-ai)] hover:bg-[var(--accent-ai-soft)]",
  data: "border border-[var(--accent-data)]/30 text-[var(--accent-data)] hover:bg-[var(--accent-data-soft)]",
  positive: "border border-[var(--accent-positive)]/30 text-[var(--accent-positive)] hover:bg-[var(--accent-positive-soft)]",
  warning: "border border-[var(--accent-warning)]/30 text-[var(--accent-warning)] hover:bg-[var(--accent-warning-soft)]",
  risk: "border border-[var(--accent-risk)]/30 text-[var(--accent-risk)] hover:bg-[var(--accent-risk-soft)]",
  neutral: "border border-[var(--border-subtle)] text-[var(--ink-700)] hover:bg-[var(--surface-muted)]",
};

const GHOST_TONE: Record<Tone, string> = {
  ai: "text-[var(--accent-ai)] hover:bg-[var(--accent-ai-soft)]",
  data: "text-[var(--accent-data)] hover:bg-[var(--accent-data-soft)]",
  positive: "text-[var(--accent-positive)] hover:bg-[var(--accent-positive-soft)]",
  warning: "text-[var(--accent-warning)] hover:bg-[var(--accent-warning-soft)]",
  risk: "text-[var(--accent-risk)] hover:bg-[var(--accent-risk-soft)]",
  neutral: "text-[var(--ink-700)] hover:bg-[var(--surface-muted)]",
};

const SIZE: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
};

/** Shared button visual language: one function, three variants, six tones.
 * Returns a className string so it composes with existing <button>/<a>
 * elements without wrapping them in a new component. */
export function buttonClass(opts: { tone?: Tone; variant?: Variant; size?: Size; className?: string } = {}) {
  const { tone = "neutral", variant = "solid", size = "md", className = "" } = opts;
  const byVariant = variant === "solid" ? SOLID_TONE : variant === "outline" ? OUTLINE_TONE : GHOST_TONE;

  return [
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-150",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "tp-focus-ring",
    byVariant[tone],
    SIZE[size],
    className,
  ].join(" ");
}
