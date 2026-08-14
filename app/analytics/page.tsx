"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hasSupabaseConfig, supabase } from "../../lib/supabase";
import { ensureUniqueProductIds } from "../../lib/services/productIdentity";
import type { Product } from "../../types/Product";
import Sidebar from "../../components/dashboard/Sidebar";
import Card from "../../components/ui/Card";
import Eyebrow from "../../components/ui/Eyebrow";
import Pill from "../../components/ui/Pill";

type ProductRow = Product & { created_at?: string };

// higher-is-better bucket thresholds copied verbatim from
// components/product-research/ScoreBadge.tsx (>=75 good, <45 bad) so these
// counts agree with the per-product badges shown elsewhere in the app --
// not a new, independently-invented threshold set.
function highLowBucket(value: number | undefined, direction: "higher-is-better" | "lower-is-better") {
  const v = value ?? 0;
  if (direction === "higher-is-better") {
    if (v >= 75) return "High";
    if (v < 45) return "Low";
    return "Medium";
  }
  if (v <= 30) return "Low";
  if (v > 65) return "High";
  return "Medium";
}

const DECISION_ORDER = ["Strong Buy", "Buy", "Test", "Watch", "Avoid"] as const;

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card padding="sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-400)]">{label}</p>
      <p className="mt-1 text-2xl font-extrabold tabular-nums text-[var(--ink-900)]">{value}</p>
      {hint && <p className="mt-1 text-xs text-[var(--ink-400)]">{hint}</p>}
    </Card>
  );
}

function DistributionBars({ counts, total }: { counts: Array<[string, number]>; total: number }) {
  return (
    <div className="space-y-2">
      {counts.map(([label, count]) => {
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <div key={label}>
            <div className="mb-1 flex justify-between text-xs text-[var(--ink-700)]">
              <span>{label}</span>
              <span className="font-semibold">{count} ({pct}%)</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--surface-muted)]">
              <div className="h-full rounded-full bg-[var(--accent-data)]" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AnalyticsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!hasSupabaseConfig()) {
        router.replace("/login");
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      const { data, error: queryError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (queryError) {
        setError(queryError.message);
      } else {
        setProducts(ensureUniqueProductIds((data ?? []) as ProductRow[]));
      }

      setLoading(false);
    }

    void load();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-[var(--surface-app)] lg:flex-row">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-8 lg:p-10">
          <p className="text-sm text-[var(--ink-500)]">Loading analytics...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-[var(--surface-app)] lg:flex-row">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-8 lg:p-10">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            Unable to load analytics: {error}
          </div>
        </main>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-[var(--surface-app)] lg:flex-row">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-7xl">
            <Eyebrow icon="📈" label="Analytics" tone="data" />
            <h1 className="mt-2 text-2xl font-bold text-[var(--ink-900)]">Analytics</h1>
            <div className="mt-6 rounded-2xl border border-dashed border-[var(--border-subtle)] bg-[var(--surface-card)] p-10 text-center">
              <p className="text-3xl">📊</p>
              <p className="mt-3 text-lg font-semibold text-[var(--ink-900)]">No research activity yet</p>
              <p className="mt-1 text-[var(--ink-500)]">
                Search for products from the Dashboard to start building your analytics.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const total = products.length;
  const winningProducts = products.filter((p) => p.decision === "Strong Buy").length;

  const avgOpportunity = Math.round(
    products.reduce((sum, p) => sum + (p.opportunity_score ?? 0), 0) / total
  );

  const totalProfitPotential = products.reduce((sum, p) => sum + Number(p.profit || 0), 0);
  const totalRevenuePotential = products.reduce((sum, p) => sum + Number(p.selling_price || 0), 0);

  const decisionCounts = DECISION_ORDER.map(
    (d) => [d, products.filter((p) => p.decision === d).length] as [string, number]
  ).filter(([, count]) => count > 0);

  const demandCounts = (["High", "Medium", "Low"] as const).map(
    (level) => [level, products.filter((p) => highLowBucket(p.demand_score, "higher-is-better") === level).length] as [string, number]
  );

  const riskCounts = (["Low", "Medium", "High"] as const).map(
    (level) => [level, products.filter((p) => highLowBucket(p.risk_score, "lower-is-better") === level).length] as [string, number]
  );

  const competitionCounts = (["Low", "Medium", "High"] as const).map(
    (level) => [level, products.filter((p) => p.competition === level).length] as [string, number]
  );

  const recent = products.slice(0, 8);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface-app)] lg:flex-row">
      <Sidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <div>
            <Eyebrow icon="📈" label="Analytics" tone="data" />
            <h1 className="mt-2 text-2xl font-bold text-[var(--ink-900)]">Analytics</h1>
            <p className="mt-1 text-sm text-[var(--ink-500)]">
              Computed directly from your {total} saved product{total === 1 ? "" : "s"} &mdash; deterministic, not AI-generated.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Products Researched" value={String(total)} />
            <StatCard label="Winning Products" value={String(winningProducts)} hint="Strong Buy (opportunity score 90+)" />
            <StatCard label="Avg. Opportunity Score" value={String(avgOpportunity)} />
            <StatCard
              label="Profit Potential"
              value={`$${totalProfitPotential.toFixed(2)}`}
              hint="Projection: sum of TrendPilot's per-product profit estimates, not real sales"
            />
          </div>

          <Card>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-bold text-[var(--ink-900)]">Revenue Potential</h2>
              <Pill tone="data">Projection &mdash; not real sales data</Pill>
            </div>
            <p className="mt-2 text-2xl font-extrabold text-[var(--ink-900)]">${totalRevenuePotential.toFixed(2)}</p>
            <p className="mt-1 text-xs text-[var(--ink-400)]">
              Sum of the suggested selling price across your saved products, assuming every unit sold once. Not
              observed revenue.
            </p>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <h2 className="mb-4 text-base font-bold text-[var(--ink-900)]">Decision Distribution</h2>
              <DistributionBars counts={decisionCounts} total={total} />
            </Card>

            <Card>
              <h2 className="mb-4 text-base font-bold text-[var(--ink-900)]">Demand Distribution</h2>
              <DistributionBars counts={demandCounts} total={total} />
            </Card>

            <Card>
              <h2 className="mb-4 text-base font-bold text-[var(--ink-900)]">Risk Distribution</h2>
              <DistributionBars counts={riskCounts} total={total} />
            </Card>

            <Card>
              <h2 className="mb-4 text-base font-bold text-[var(--ink-900)]">Competition Distribution</h2>
              <DistributionBars counts={competitionCounts} total={total} />
            </Card>
          </div>

          <Card padding="none">
            <div className="flex items-center justify-between gap-2 p-6 pb-0">
              <h2 className="text-base font-bold text-[var(--ink-900)]">Recent Research Activity</h2>
            </div>
            <div className="mt-4 divide-y divide-[var(--border-subtle)]">
              {recent.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 px-6 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--ink-900)]">{p.name}</p>
                    <p className="text-xs text-[var(--ink-400)]">
                      {p.platform} &middot; {p.created_at ? new Date(p.created_at).toLocaleDateString() : "Date unavailable"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 text-xs">
                    <span className="font-semibold text-[var(--ink-700)]">Score {p.opportunity_score ?? "N/A"}</span>
                    <span className="rounded-full bg-[var(--surface-muted)] px-2 py-1 font-semibold text-[var(--ink-700)]">
                      {p.decision || "N/A"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-6" />
          </Card>
        </div>
      </main>
    </div>
  );
}
