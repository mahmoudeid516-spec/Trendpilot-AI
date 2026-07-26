"use client";

import { startTransition, useDeferredValue, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Trash2 } from "lucide-react";
import type { ReportHistoryItem } from "../../types/AIReport";
import { deleteReport, fetchReportHistory, ReportRequestError } from "../../lib/services/reports";

type Props = {
  refreshSignal?: number;
};

function formatDateTime(value: string): string {
  if (!value) {
    return "Unknown date";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ReportHistoryPanel({ refreshSignal = 0 }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [history, setHistory] = useState<ReportHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      try {
        setLoading(true);
        setError("");
        const response = await fetchReportHistory({
          query: deferredQuery,
          page: 1,
          pageSize: 6,
        });

        if (!cancelled) {
          setHistory(response.reports);
        }
      } catch (err) {
        if (!cancelled) {
          if (err instanceof ReportRequestError && err.status < 500) {
            setHistory([]);
            setError("");
          } else {
            setHistory([]);
            setError(err instanceof Error ? err.message : "Failed to load report history.");
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadHistory();

    return () => {
      cancelled = true;
    };
  }, [deferredQuery, refreshSignal]);

  async function handleDelete(reportId: number) {
    try {
      await deleteReport(reportId);
      startTransition(() => {
        setHistory((current) => current.filter((item) => item.id !== reportId));
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete report.");
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">History</p>
          <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Saved AI Reports</h3>
        </div>

        <Link
          href="/dashboard/history"
          className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700"
        >
          View All History
        </Link>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
        <Search size={14} className="text-slate-500" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search reports"
          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>

      {loading ? (
        <div className="mt-4 space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-20 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : null}

      {!loading && error ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
      ) : null}

      {!loading && !error && history.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
          No saved reports yet. Generate one from a product and it will appear here automatically.
        </div>
      ) : null}

      {!loading && !error && history.length > 0 ? (
        <div className="mt-4 space-y-3">
          {history.map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-indigo-300 hover:bg-white">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.product_name}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.marketplace || "Unknown marketplace"} • {formatDateTime(item.created_at)} • Opportunity {item.opportunity_score} • Confidence {item.confidence_score}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => router.push(`/dashboard/report/${item.id}`)}
                    className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                  >
                    Open Report
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(item.id)}
                    className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}