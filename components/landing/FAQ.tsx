import { ChevronDown } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const FAQS = [
  {
    question: "What does TrendPilot AI actually do?",
    answer:
      "TrendPilot AI analyzes product data and market signals to score opportunity, demand, competition, and profitability, then adds AI-generated positioning and marketing insights on top.",
  },
  {
    question: "Does it work with Shopify?",
    answer:
      "Yes. Once you connect your Shopify store, you can move products you've researched in TrendPilot toward your store workflow.",
  },
  {
    question: "Is the opportunity score guaranteed to predict sales?",
    answer:
      "No. It's a consistent way to compare products using demand, trend, competition, and profitability signals — it's decision support, not a guarantee of results.",
  },
  {
    question: "Do I need technical setup to get started?",
    answer: "No complicated setup. Create an account and you can start researching products right away.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <ScrollReveal>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-[var(--ink-900)] sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>
      </ScrollReveal>

      <div className="mt-10 space-y-3">
        {FAQS.map((faq, i) => (
          <ScrollReveal key={faq.question} delayMs={i * 50}>
            <details className="group rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] px-5 py-4 open:pb-5">
              <summary className="tp-focus-ring flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg text-sm font-semibold text-[var(--ink-900)]">
                {faq.question}
                <ChevronDown
                  size={18}
                  strokeWidth={2}
                  className="shrink-0 text-[var(--ink-400)] transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 text-sm leading-6 text-[var(--ink-500)]">{faq.answer}</p>
            </details>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
