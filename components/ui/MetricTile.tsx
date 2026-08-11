import { toneText, type Tone } from "./tone";

type Props = {
  label: string;
  value: string | number;
  tone?: Tone;
  hint?: string;
  size?: "sm" | "md" | "lg";
};

const VALUE_SIZE: Record<NonNullable<Props["size"]>, string> = {
  sm: "text-xl",
  md: "text-2xl sm:text-3xl",
  lg: "text-3xl sm:text-4xl",
};

/** A single labeled metric -- the smallest unit of the dashboard's number
 * hierarchy. Used in the hero, stat strip, and report headers so every
 * number in the product reads the same way. */
export default function MetricTile({ label, value, tone = "neutral", hint, size = "md" }: Props) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--ink-400)]">{label}</p>
      <p className={`mt-1 font-bold tabular-nums ${VALUE_SIZE[size]} ${toneText[tone]}`}>{value}</p>
      {hint && <p className="mt-0.5 truncate text-xs text-[var(--ink-500)]">{hint}</p>}
    </div>
  );
}
