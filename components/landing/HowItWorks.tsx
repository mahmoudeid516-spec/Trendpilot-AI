import { Search, LineChart, Rocket, ArrowRight } from "lucide-react";
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
    <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <ScrollReveal>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-ai)]">The workflow</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--ink-900)] sm:text-4xl">
            How it works
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-[var(--ink-500)]">
            From discovery to action, in one connected workflow.
          </p>
        </div>
      </ScrollReveal>

      <div className="mt-16 flex flex-col md:flex-row md:items-stretch">
        {STEPS.map((step, i) => (
          <div key={step.number} className="flex flex-1 flex-col md:flex-row md:items-stretch">
            <ScrollReveal delayMs={i * 120} className="flex-1">
              <div className="tp-card-elevated tp-card-elevated-interactive relative h-full p-7">
                <div className="absolute right-6 top-6 text-4xl font-black text-[var(--surface-muted)]">
                  {step.number}
                </div>

                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent-ai-soft)] to-[var(--accent-data-soft)] text-[var(--accent-ai)]">
                  <step.icon size={22} strokeWidth={2} />
                </span>

                <h3 className="mt-6 text-lg font-bold text-[var(--ink-900)]">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--ink-500)]">{step.description}</p>
              </div>
            </ScrollReveal>

            {i < STEPS.length - 1 && (
              <div className="flex shrink-0 items-center justify-center py-3 md:w-10 md:py-0 lg:w-14">
                <ArrowRight size={18} className="rotate-90 text-[var(--ink-400)] md:rotate-0" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
