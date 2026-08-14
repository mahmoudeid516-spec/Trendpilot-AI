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

const TONE_BG: Record<(typeof CAPABILITIES)[number]["tone"], string> = {
  data: "bg-[var(--accent-data-soft)]",
  ai: "bg-[var(--accent-ai-soft)]",
  positive: "bg-[var(--accent-positive-soft)]",
};

export default function TrustBar() {
  return (
    <section className="border-y border-[var(--border-subtle)] bg-[var(--surface-card)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ScrollReveal>
          <p className="text-center text-sm font-semibold text-[var(--ink-500)]">
            Everything you need to validate a product before you invest.
          </p>
        </ScrollReveal>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {CAPABILITIES.map((item, i) => (
            <ScrollReveal key={item.label} delayMs={i * 60}>
              <div className="flex flex-col items-center gap-3 rounded-2xl px-4 py-5 text-center">
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${TONE_BG[item.tone]}`}>
                  <item.icon size={20} strokeWidth={2} className={TONE_TEXT[item.tone]} />
                </span>
                <span className="text-sm font-semibold text-[var(--ink-900)]">{item.label}</span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
