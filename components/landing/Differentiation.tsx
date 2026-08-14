import { Users, Compass, Layers, DollarSign, Rocket } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import DataTierBadge from "../ui/DataTierBadge";

const ANGLES = [
  { icon: Users, label: "Target customers" },
  { icon: Compass, label: "Positioning opportunities" },
  { icon: Layers, label: "Differentiation ideas" },
  { icon: DollarSign, label: "Pricing insights" },
  { icon: Rocket, label: "Go-to-market strategies" },
];

export default function Differentiation() {
  return (
    <section className="bg-[var(--surface-card)] py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <ScrollReveal>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-[var(--ink-900)] sm:text-4xl">
                Don&apos;t just find products. Find your angle.
              </h2>
              <p className="mt-5 text-base leading-7 text-[var(--ink-500)]">
                A good opportunity score is a starting point, not a strategy. TrendPilot&apos;s AI Product Analyzer
                helps you understand who to sell to and how to stand out before you commit to a product.
              </p>

              <ul className="mt-7 space-y-3">
                {ANGLES.map((angle) => (
                  <li key={angle.label} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-ai-soft)] text-[var(--accent-ai)]">
                      <angle.icon size={16} strokeWidth={2} />
                    </span>
                    <span className="text-sm font-medium text-[var(--ink-700)]">{angle.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={120}>
            <div className="rounded-[28px] border border-[var(--border-subtle)] bg-[var(--surface-app)] p-7">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-[var(--ink-900)]">AI Product Analysis</p>
                <DataTierBadge tier="ai" />
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--ink-400)]">
                    Target customer
                  </p>
                  <p className="mt-1 text-sm text-[var(--ink-700)]">
                    Content creators and small studio owners who need portable, consistent lighting.
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--ink-400)]">
                    Differentiation idea
                  </p>
                  <p className="mt-1 text-sm text-[var(--ink-700)]">
                    Bundle with a phone mount and travel case to stand out from single-unit listings.
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--ink-400)]">
                    Positioning
                  </p>
                  <p className="mt-1 text-sm text-[var(--ink-700)]">
                    Lead with portability and beginner-friendly setup rather than competing on brightness alone.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
