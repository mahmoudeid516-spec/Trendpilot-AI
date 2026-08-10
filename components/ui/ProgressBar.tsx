import { toneSolidBg, toneSoftBg, type Tone } from "./tone";

type Props = {
  value: number;
  tone?: Tone;
  className?: string;
};

/** Simple bounded (0-100) progress indicator. Pure presentation -- callers
 * remain responsible for clamping/deriving the value from real data. */
export default function ProgressBar({ value, tone = "data", className = "" }: Props) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={`h-2 w-full overflow-hidden rounded-full ${toneSoftBg[tone]} ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ${toneSolidBg[tone]}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
