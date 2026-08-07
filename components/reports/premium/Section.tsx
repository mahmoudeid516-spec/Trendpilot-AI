import type { ReactNode } from "react";

type SectionProps = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function Section({ title, subtitle, icon, children, className = "" }: SectionProps) {
  return (
    <section className={`rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_16px_50px_-34px_rgba(15,23,42,0.36)] sm:p-7 ${className}`}>
      <header className="mb-5">
        <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          {icon}
          {title}
        </p>
        {subtitle ? <p className="mt-2 text-sm leading-7 text-slate-600">{subtitle}</p> : null}
      </header>
      {children}
    </section>
  );
}
