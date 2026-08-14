import { Database, Sparkles, Calculator, LineChart } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const CAPABILITIES = [
  { icon: Database, label: "Real product data", tone: "data" as const },
  { icon: Sparkles, label: "AI-powered analysis", tone: "ai" as const },
  { icon: Calculator, label: "Profit & ROI estimates", tone: "positive" as const },
  { icon: LineChart, label: "Market intelligence", tone: "data" as const },
];

const TONE_TEXT: Record<(typeof CAPABILITIES)[number]["tone"], string> = {
  data: "text-[var(--accent-data)]",
  ai: "text-[var(--accent-ai)]",
  positive: "text-[var(--accent-positive)]",
};

export default function TrustBar() {
  return (
    <section className="relative border-y border-[var(--border-subtle)] bg-[var(--surface-card)]">
      <div className="tp-divider-fade absolute inset-x-0 top-0" aria-hidden="true" />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <ScrollReveal>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-400)]">
            Everything you need to validate a product before you invest
          </p>
        </ScrollReveal>

        <div className="mt-7 flex flex-wrap items-center justify-center divide-x divide-[var(--border-subtle)]">
          {CAPABILITIES.map((item, i) => (
            <ScrollReveal key={item.label} delayMs={i * 60} className="px-6 py-2 first:pl-0 last:pr-0">
              <div className="flex items-center gap-2.5">
                <item.icon size={16} strokeWidth={2.25} className={TONE_TEXT[item.tone]} />
                <span className="whitespace-nowrap text-sm font-semibold text-[var(--ink-900)]">{item.label}</span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
