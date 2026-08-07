import type { ReactNode } from "react";

type CollapsibleSectionProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export default function CollapsibleSection({
  title,
  subtitle,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_16px_50px_-34px_rgba(15,23,42,0.36)] sm:p-7"
    >
      <summary className="cursor-pointer list-none">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-base font-semibold text-slate-900">{title}</p>
            {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 group-open:text-slate-700">
            <span className="group-open:hidden">Expand</span>
            <span className="hidden group-open:inline">Collapse</span>
          </span>
        </div>
      </summary>
      <div className="mt-5">{children}</div>
    </details>
  );
}
