import Link from "next/link";

const COLUMNS: Array<{ title: string; links: Array<{ label: string; href: string }> }> = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "AI Analyzer", href: "/ai-analyzer" },
      { label: "Analytics", href: "/analytics" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log In", href: "/login" },
      { label: "Sign Up", href: "/register" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[var(--ink-900)] text-white/70">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-ai)] text-sm font-bold text-white">
                T
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-white">TrendPilot AI</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/50">
              AI-powered product research for modern eCommerce sellers.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title} className="lg:col-span-1">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-white/40">{column.title}</h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-white/70 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 border-t border-white/10 pt-8 sm:flex-row sm:justify-between">
          <p className="text-xs text-white/40">&copy; {new Date().getFullYear()} TrendPilot AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
