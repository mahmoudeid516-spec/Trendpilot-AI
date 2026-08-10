import { toneText, type Tone } from "./tone";

type Props = {
  value: number;
  max?: number;
  size?: number;
  tone: Tone;
  label?: string;
};

const TONE_STROKE: Record<Tone, string> = {
  ai: "var(--accent-ai)",
  data: "var(--accent-data)",
  positive: "var(--accent-positive)",
  warning: "var(--accent-warning)",
  risk: "var(--accent-risk)",
  neutral: "var(--ink-500)",
};

/** Circular progress gauge for the single most important number on a
 * report (overall opportunity score, AI confidence). Pure SVG, no new
 * dependency, degrades gracefully at any size. */
export default function ScoreRing({ value, max = 100, size = 96, tone, label }: Props) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, value / max));
  const offset = circumference * (1 - pct);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--surface-muted)" strokeWidth={8} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={TONE_STROKE[tone]}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 600ms ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-extrabold tabular-nums ${toneText[tone]}`}>{Math.round(value)}</span>
        {label && <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--ink-400)]">{label}</span>}
      </div>
    </div>
  );
}
