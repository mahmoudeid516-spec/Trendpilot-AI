import {
  Search,
  Sparkles,
  Target,
  Calculator,
  LineChart,
  Megaphone,
  ShoppingBag,
  BarChart3,
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import DataTierBadge from "../ui/DataTierBadge";

const FEATURES = [
  {
    icon: Search,
    title: "Product Discovery",
    description: "Find products with strong demand and measurable opportunity.",
    span: "lg:col-span-2",
    big: true,
  },
  {
    icon: Sparkles,
    title: "AI Product Analysis",
    description: "Get AI-powered insights into risks, positioning, target customers, and differentiation.",
    span: "lg:col-span-2",
    big: true,
  },
  {
    icon: Target,
    title: "Opportunity Scoring",
    description: "Compare products using a consistent opportunity score.",
    span: "",
  },
  {
    icon: Calculator,
    title: "Profit & ROI Analysis",
    description: "Understand estimated margins and return potential before investing.",
    span: "",
  },
  {
    icon: LineChart,
    title: "Sales Forecasting",
    description: "Explore projected orders, revenue, and profit scenarios.",
    span: "",
  },
  {
    icon: Megaphone,
    title: "AI Marketing",
    description: "Generate marketing copy, social captions, SEO content, and campaign ideas.",
    span: "",
  },
  {
    icon: ShoppingBag,
    title: "Shopify Integration",
    description: "Move promising products toward your store workflow.",
    span: "lg:col-span-2",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Track your research and product opportunities in one place.",
    span: "lg:col-span-2",
  },
];

function FeatureVisual({ title }: { title: string }) {
  if (title === "Product Discovery") {
    return (
      <div className="mt-5 flex items-center gap-2">
        {[91, 78, 63].map((score) => (
          <div
            key={score}
            className="flex h-14 flex-1 flex-col items-center justify-center rounded-xl bg-[var(--surface-muted)]"
          >
            <span className="text-sm font-extrabold tabular-nums text-[var(--ink-900)]">{score}</span>
            <span className="text-[9px] font-semibold uppercase tracking-wide text-[var(--ink-400)]">Score</span>
          </div>
        ))}
      </div>
    );
  }

  if (title === "AI Product Analysis") {
    return (
      <div className="mt-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-3.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--ink-400)]">
            Positioning idea
          </span>
          <DataTierBadge tier="ai" />
        </div>
        <p className="mt-1.5 text-xs leading-5 text-[var(--ink-700)]">
          &ldquo;Lead with portability, not brightness &mdash; differentiate from single-unit listings.&rdquo;
        </p>
      </div>
    );
  }

  return null;
}

export default function Features() {
  return (
    <section id="features" className="bg-[var(--surface-card)] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-ai)]">Capabilities</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--ink-900)] sm:text-4xl">
              Everything you need to research products
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-[var(--ink-500)]">
              A complete workflow from discovery to decision.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-flow-row-dense lg:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <ScrollReveal key={feature.title} delayMs={(i % 4) * 70} className={feature.span}>
              <div
                className={`tp-card-elevated tp-card-elevated-interactive flex h-full flex-col ${
                  feature.big ? "p-7" : "p-6"
                }`}
              >
                <span
                  className={`flex items-center justify-center rounded-xl bg-[var(--accent-ai-soft)] text-[var(--accent-ai)] ${
                    feature.big ? "h-12 w-12" : "h-10 w-10"
                  }`}
                >
                  <feature.icon size={feature.big ? 22 : 18} strokeWidth={2} />
                </span>
                <h3 className={`mt-4 font-bold text-[var(--ink-900)] ${feature.big ? "text-xl" : "text-base"}`}>
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--ink-500)]">{feature.description}</p>

                <FeatureVisual title={feature.title} />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
