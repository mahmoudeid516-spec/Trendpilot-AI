import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import { buttonClass } from "../ui/button";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[var(--ink-900)] py-20">
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-br from-[var(--accent-ai)]/25 via-transparent to-transparent"
        aria-hidden="true"
      />

      <ScrollReveal>
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Your next winning product could be one search away.
          </h2>
          <p className="mt-5 text-base leading-7 text-white/70">
            Turn product research into a repeatable decision-making process.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register" className={buttonClass({ tone: "ai", className: "px-7 py-3.5 text-base" })}>
              Start Finding Products
            </Link>
          </div>

          <p className="mt-6 text-sm text-white/50">No complicated setup. Start researching immediately.</p>
        </div>
      </ScrollReveal>
    </section>
  );
}
