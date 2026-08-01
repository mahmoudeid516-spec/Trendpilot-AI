"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

type BillingEvent = {
  id: string;
  eventType: string;
  createdAt: string;
};

type BillingSummary = {
  plan: "Free" | "Pro" | "Premium";
  subscriptionStatus: string;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  renewalDate: string | null;
  cancelAtPeriodEnd: boolean;
  hasBillingAccount: boolean;
  events: BillingEvent[];
};

function formatDate(value: string | null): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BillingPage() {
  const [summary, setSummary] = useState<BillingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeAction, setActiveAction] = useState<"" | "portal" | "Pro" | "Premium">("");
  const [error, setError] = useState("");

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setSummary(null);
        setError("Authentication required.");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/billing/summary", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = (await response.json().catch(() => null)) as BillingSummary | { error?: string } | null;

      if (!response.ok) {
        throw new Error((data as { error?: string } | null)?.error || "Failed to load billing summary.");
      }

      setSummary(data as BillingSummary);
    } catch (err: unknown) {
      setSummary(null);
      setError(err instanceof Error ? err.message : "Failed to load billing summary.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadSummary();
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [loadSummary]);

  async function openPortal() {
    setActiveAction("portal");
    setError("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("Authentication required.");
      }

      const response = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ returnUrl: `${window.location.origin}/dashboard/billing` }),
      });

      const data = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;

      if (!response.ok || !data?.url) {
        throw new Error(data?.error || "Failed to open billing portal.");
      }

      window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to open billing portal.");
      setActiveAction("");
    }
  }

  async function startCheckout(plan: "Pro" | "Premium") {
    setActiveAction(plan);
    setError("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("Authentication required.");
      }

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ plan }),
      });

      const data = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;

      if (!response.ok || !data?.url) {
        throw new Error(data?.error || `Failed to start ${plan} checkout.`);
      }

      window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to start checkout.");
      setActiveAction("");
    }
  }

  const statusLabel = useMemo(() => {
    if (!summary) {
      return "-";
    }

    return summary.subscriptionStatus.replaceAll("_", " ");
  }, [summary]);

  const renewalDate = summary?.currentPeriodEnd ?? summary?.renewalDate ?? null;

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900">
      <section className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Billing</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Subscription & Billing</h1>
        <p className="mt-3 text-sm text-slate-600">
          Manage your subscription, payment method, and billing history.
        </p>

        {error ? (
          <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
        ) : null}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Current Plan</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{loading ? "..." : summary?.plan ?? "-"}</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Status</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{loading ? "..." : statusLabel}</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Renewal Date</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{loading ? "..." : formatDate(renewalDate)}</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Cancel at Period End</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{loading ? "..." : summary?.cancelAtPeriodEnd ? "Yes" : "No"}</p>
          </article>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {summary?.plan === "Free" ? (
            <>
              <button
                type="button"
                onClick={() => void startCheckout("Pro")}
                disabled={loading || activeAction !== ""}
                className="inline-flex items-center rounded-xl border border-indigo-300 bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {activeAction === "Pro" ? "Opening..." : "Upgrade to Pro"}
              </button>

              <button
                type="button"
                onClick={() => void startCheckout("Premium")}
                disabled={loading || activeAction !== ""}
                className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {activeAction === "Premium" ? "Opening..." : "Upgrade to Premium"}
              </button>
            </>
          ) : null}

          {summary?.plan === "Pro" ? (
            <>
              <button
                type="button"
                onClick={() => void startCheckout("Premium")}
                disabled={loading || activeAction !== ""}
                className="inline-flex items-center rounded-xl border border-indigo-300 bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {activeAction === "Premium" ? "Opening..." : "Upgrade to Premium"}
              </button>

              <button
                type="button"
                disabled
                className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Downgrade (Use Manage Billing)
              </button>
            </>
          ) : null}

          {summary?.plan === "Premium" ? (
            <>
              <button
                type="button"
                onClick={() => void startCheckout("Pro")}
                disabled={loading || activeAction !== ""}
                className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {activeAction === "Pro" ? "Opening..." : "Downgrade to Pro"}
              </button>

            </>
          ) : null}

          <button
            type="button"
            onClick={() => void openPortal()}
            disabled={loading || activeAction !== ""}
            className="inline-flex items-center rounded-xl border border-indigo-300 bg-indigo-50 px-5 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {activeAction === "portal" ? "Opening Billing Portal..." : "Manage Billing"}
          </button>

          <button
            type="button"
            disabled
            className="inline-flex items-center rounded-xl border border-rose-300 bg-rose-50 px-5 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel Subscription (Use Manage Billing)
          </button>

          <button
            type="button"
            onClick={() => void loadSummary()}
            disabled={loading || activeAction !== ""}
            className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Refresh
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-slate-900">Billing History</h2>
          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {(summary?.events ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-4 py-6 text-center text-slate-500">
                      No billing events yet.
                    </td>
                  </tr>
                ) : (
                  (summary?.events ?? []).map((event) => (
                    <tr key={event.id}>
                      <td className="px-4 py-3 text-slate-700">{event.eventType}</td>
                      <td className="px-4 py-3 text-slate-500">{formatDate(event.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
