import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import { buttonClass } from "../ui/button";

export default function FinalCTA() {
  return (
    <section className="tp-landing-ink relative overflow-hidden py-24">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[42rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[var(--accent-ai)]/25 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="tp-dot-grid pointer-events-none absolute inset-0 opacity-[0.06] [mask-image:none]"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)" }}
        aria-hidden="true"
      />

      <ScrollReveal>
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Your next winning product could be one search away.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/70">
            Turn product research into a repeatable decision-making process.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className={buttonClass({
                tone: "ai",
                className:
                  "px-7 py-4 text-base shadow-[0_16px_36px_-8px_rgba(109,74,255,0.65)] transition-transform duration-200 hover:-translate-y-0.5",
              })}
            >
              Start Finding Products
            </Link>
          </div>

          <p className="mt-6 text-sm text-white/50">No complicated setup. Start researching immediately.</p>
        </div>
      </ScrollReveal>
    </section>
  );
}
