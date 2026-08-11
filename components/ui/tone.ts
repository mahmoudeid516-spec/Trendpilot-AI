// Shared tone system for the design primitives in this folder. Kept to
// exactly the palette described in the design brief: violet = AI, blue =
// product data, emerald = positive/profit, amber/rose reserved for
// warning/risk. "neutral" is the default, non-decorative surface tone.
export type Tone = "ai" | "data" | "positive" | "warning" | "risk" | "neutral";

export const toneText: Record<Tone, string> = {
  ai: "text-[var(--accent-ai)]",
  data: "text-[var(--accent-data)]",
  positive: "text-[var(--accent-positive)]",
  warning: "text-[var(--accent-warning)]",
  risk: "text-[var(--accent-risk)]",
  neutral: "text-[var(--ink-500)]",
};

export const toneSoftBg: Record<Tone, string> = {
  ai: "bg-[var(--accent-ai-soft)]",
  data: "bg-[var(--accent-data-soft)]",
  positive: "bg-[var(--accent-positive-soft)]",
  warning: "bg-[var(--accent-warning-soft)]",
  risk: "bg-[var(--accent-risk-soft)]",
  neutral: "bg-[var(--surface-muted)]",
};

export const toneSolidBg: Record<Tone, string> = {
  ai: "bg-[var(--accent-ai)]",
  data: "bg-[var(--accent-data)]",
  positive: "bg-[var(--accent-positive)]",
  warning: "bg-[var(--accent-warning)]",
  risk: "bg-[var(--accent-risk)]",
  neutral: "bg-[var(--ink-700)]",
};

export const toneBorder: Record<Tone, string> = {
  ai: "border-[var(--accent-ai)]/20",
  data: "border-[var(--accent-data)]/20",
  positive: "border-[var(--accent-positive)]/20",
  warning: "border-[var(--accent-warning)]/25",
  risk: "border-[var(--accent-risk)]/25",
  neutral: "border-[var(--border-subtle)]",
};

/** Score/percentage -> tone, for metrics where higher is better. */
export function toneForScore(value: number | undefined | null): Tone {
  if (typeof value !== "number" || !Number.isFinite(value)) return "neutral";
  if (value >= 75) return "positive";
  if (value >= 45) return "warning";
  return "risk";
}

/** Score/percentage -> tone, for metrics where lower is better (e.g. risk). */
export function toneForInverseScore(value: number | undefined | null): Tone {
  if (typeof value !== "number" || !Number.isFinite(value)) return "neutral";
  if (value <= 30) return "positive";
  if (value <= 65) return "warning";
  return "risk";
}
