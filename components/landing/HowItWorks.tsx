import { Search, LineChart, Rocket } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const STEPS = [
  {
    number: "01",
    title: "Discover",
    description: "Find products using real market and product data.",
    icon: Search,
  },
  {
    number: "02",
    title: "Analyze",
    description: "Evaluate demand, competition, profitability, risk, and opportunity.",
    icon: LineChart,
  },
  {
    number: "03",
    title: "Act",
    description: "Generate marketing, forecast potential sales, and move the product toward your store.",
    icon: Rocket,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <ScrollReveal>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-[var(--ink-900)] sm:text-4xl">How it works</h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-[var(--ink-500)]">
            From discovery to action, in one connected workflow.
          </p>
        </div>
      </ScrollReveal>

      <div className="relative mt-14 grid gap-8 md:grid-cols-3">
        <div
          className="absolute left-0 right-0 top-11 hidden h-px bg-[var(--border-subtle)] md:block"
          aria-hidden="true"
        />

        {STEPS.map((step, i) => (
          <ScrollReveal key={step.number} delayMs={i * 100}>
            <div className="relative flex flex-col items-start rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-ai-soft)] text-[var(--accent-ai)]">
                  <step.icon size={20} strokeWidth={2} />
                </span>
                <span className="text-sm font-bold text-[var(--ink-400)]">{step.number}</span>
              </div>

              <h3 className="mt-5 text-lg font-bold text-[var(--ink-900)]">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--ink-500)]">{step.description}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
