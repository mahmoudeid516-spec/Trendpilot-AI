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

const FEATURES = [
  {
    icon: Search,
    title: "Product Discovery",
    description: "Find products with strong demand and measurable opportunity.",
  },
  {
    icon: Sparkles,
    title: "AI Product Analysis",
    description: "Get AI-powered insights into risks, positioning, target customers, and differentiation.",
  },
  {
    icon: Target,
    title: "Opportunity Scoring",
    description: "Compare products using a consistent opportunity score.",
  },
  {
    icon: Calculator,
    title: "Profit & ROI Analysis",
    description: "Understand estimated margins and return potential before investing.",
  },
  {
    icon: LineChart,
    title: "Sales Forecasting",
    description: "Explore projected orders, revenue, and profit scenarios.",
  },
  {
    icon: Megaphone,
    title: "AI Marketing",
    description: "Generate marketing copy, social captions, SEO content, and campaign ideas.",
  },
  {
    icon: ShoppingBag,
    title: "Shopify Integration",
    description: "Move promising products toward your store workflow.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Track your research and product opportunities in one place.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-[var(--surface-card)] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-[var(--ink-900)] sm:text-4xl">
              Everything you need to research products
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-[var(--ink-500)]">
              A complete workflow from discovery to decision.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <ScrollReveal key={feature.title} delayMs={(i % 4) * 70}>
              <div className="tp-card tp-card-interactive h-full p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-ai-soft)] text-[var(--accent-ai)]">
                  <feature.icon size={18} strokeWidth={2} />
                </span>
                <h3 className="mt-4 text-base font-bold text-[var(--ink-900)]">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--ink-500)]">{feature.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
