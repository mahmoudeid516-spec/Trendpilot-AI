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
    <section className="bg-[var(--surface-card)] py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <ScrollReveal>
            <div className="border-l-2 border-[var(--accent-ai)]/30 pl-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-ai)]">
                Beyond the score
              </p>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-[var(--ink-900)] sm:text-4xl">
                Don&apos;t just find products.
                <br />
                Find your angle.
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-[var(--ink-500)]">
                A good opportunity score is a starting point, not a strategy. TrendPilot&apos;s AI Product Analyzer
                helps you understand who to sell to and how to stand out before you commit to a product.
              </p>

              <ul className="mt-8 space-y-0">
                {ANGLES.map((angle, i) => (
                  <li
                    key={angle.label}
                    className={`flex items-center gap-4 py-3 ${
                      i !== ANGLES.length - 1 ? "border-b border-[var(--border-subtle)]" : ""
                    }`}
                  >
                    <span className="text-xs font-bold tabular-nums text-[var(--ink-400)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <angle.icon size={16} strokeWidth={2} className="shrink-0 text-[var(--accent-ai)]" />
                    <span className="text-sm font-semibold text-[var(--ink-900)]">{angle.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={120}>
            <div className="tp-card-elevated relative overflow-hidden p-7 sm:p-8">
              <div
                className="tp-glow-violet pointer-events-none absolute -right-16 -top-16 h-48 w-48 opacity-60 blur-2xl"
                aria-hidden="true"
              />

              <div className="relative flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-[var(--ink-900)]">AI Product Analysis</p>
                <DataTierBadge tier="ai" />
              </div>

              <div className="relative mt-6 space-y-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--ink-400)]">
                    Target customer
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-[var(--ink-700)]">
                    Content creators and small studio owners who need portable, consistent lighting.
                  </p>
                </div>
                <div className="tp-divider-fade" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--ink-400)]">
                    Differentiation idea
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-[var(--ink-700)]">
                    Bundle with a phone mount and travel case to stand out from single-unit listings.
                  </p>
                </div>
                <div className="tp-divider-fade" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--ink-400)]">
                    Positioning
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-[var(--ink-700)]">
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
