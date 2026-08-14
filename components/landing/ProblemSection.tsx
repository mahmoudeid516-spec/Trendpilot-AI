import { Clock, TrendingDown, Swords, Gauge, EyeOff } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const PROBLEMS = [
  { icon: Clock, text: "Finding products manually takes too long." },
  { icon: TrendingDown, text: "High demand does not always mean profitability." },
  { icon: Swords, text: "Competition can destroy margins." },
  { icon: Gauge, text: "Trends change quickly." },
  { icon: EyeOff, text: "Too many products look promising at first glance." },
];

export default function ProblemSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--surface-muted)] py-24">
      <div
        className="pointer-events-none absolute right-[-10%] top-0 h-80 w-80 rounded-full bg-[var(--accent-risk)]/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-[-10%] h-72 w-72 rounded-full bg-[var(--accent-warning)]/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-risk)]">
              The old way
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--ink-900)] sm:text-4xl">
              Stop guessing what to sell.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--ink-500)]">
              Traditional product research is slow, noisy, and easy to get wrong.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-3 sm:grid-cols-2">
          {PROBLEMS.map((problem, i) => (
            <ScrollReveal key={problem.text} delayMs={i * 50} className={i === 4 ? "sm:col-span-2" : ""}>
              <div className="flex items-center gap-4 rounded-xl border-l-2 border-[var(--accent-risk)]/50 bg-[var(--surface-card)] px-5 py-4 shadow-[0_1px_2px_rgba(15,18,34,0.04)]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-risk-soft)] text-[var(--accent-risk)]">
                  <problem.icon size={18} strokeWidth={2} />
                </span>
                <p className="text-sm font-medium text-[var(--ink-700)]">{problem.text}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delayMs={250}>
          <div className="mt-12 rounded-2xl border border-[var(--border-subtle)] bg-[var(--ink-900)] px-8 py-7 text-center">
            <p className="text-lg font-semibold text-white">
              TrendPilot AI turns product research into signal, not guesswork.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
