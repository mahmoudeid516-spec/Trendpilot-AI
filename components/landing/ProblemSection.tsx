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
    <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <ScrollReveal>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-[var(--ink-900)] sm:text-4xl">
            Stop guessing what to sell.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--ink-500)]">
            Traditional product research is slow, noisy, and easy to get wrong.
          </p>
        </div>
      </ScrollReveal>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {PROBLEMS.map((problem, i) => (
          <ScrollReveal key={problem.text} delayMs={i * 50}>
            <div className="flex items-center gap-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] px-5 py-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-risk-soft)] text-[var(--accent-risk)]">
                <problem.icon size={18} strokeWidth={2} />
              </span>
              <p className="text-sm font-medium text-[var(--ink-700)]">{problem.text}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delayMs={250}>
        <p className="mt-10 text-center text-lg font-semibold text-[var(--ink-900)]">
          TrendPilot AI turns product research into signal, not guesswork.
        </p>
      </ScrollReveal>
    </section>
  );
}
