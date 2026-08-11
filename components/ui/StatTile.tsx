import { toneSoftBg, type Tone } from "./tone";

type Props = {
  title: string;
  value: string | number;
  icon: string;
  tone: Tone;
  subtitle: string;
};

/** Compact metric card used for the stat/overview strips. Deliberately
 * plain (icon tile + number + subtitle) rather than a gradient-blob card,
 * so a row of these doesn't compete visually with the sections below it. */
export default function StatTile({ title, value, icon, tone, subtitle }: Props) {
  return (
    <div className="tp-card tp-card-interactive p-5">
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${toneSoftBg[tone]}`}>
          {icon}
        </div>
        <p className="min-w-0 break-words text-sm font-medium leading-snug text-[var(--ink-500)]">{title}</p>
      </div>

      <h2 className="mt-4 text-3xl font-bold tabular-nums text-[var(--ink-900)]">{value}</h2>
      <p className="mt-1 text-xs text-[var(--ink-400)]">{subtitle}</p>
    </div>
  );
}
