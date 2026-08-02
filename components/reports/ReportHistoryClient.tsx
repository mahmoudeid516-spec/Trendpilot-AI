"use client";

import { startTransition, useDeferredValue, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Trash2 } from "lucide-react";
import Sidebar from "../dashboard/Sidebar";
import type { ReportHistoryItem } from "../../types/AIReport";
import { deleteReport, fetchReportHistory, ReportRequestError } from "../../lib/services/reports";
import ReportErrorCard from "./ReportErrorCard";

const PAGE_SIZE = 12;

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

export default function ReportHistoryClient() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [reports, setReports] = useState<ReportHistoryItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadReports() {
      try {
        setLoading(true);
        setError("");
        const response = await fetchReportHistory({
          query: deferredQuery,
          page,
          pageSize: PAGE_SIZE,
        });

        if (!cancelled) {
          setReports(response.reports);
          setTotal(response.total);
        }
      } catch (err) {
        if (!cancelled) {
          if (err instanceof ReportRequestError && err.status < 500) {
            setReports([]);
            setTotal(0);
            setError("");
          } else {
            setReports([]);
            setTotal(0);
            setError(err instanceof Error ? err.message : "Failed to load report history.");
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadReports();

    return () => {
      cancelled = true;
    };
  }, [deferredQuery, page]);

  async function handleDelete(reportId: number) {
    try {
      await deleteReport(reportId);
      startTransition(() => {
        setReports((current) => current.filter((item) => item.id !== reportId));
        setTotal((current) => Math.max(0, current - 1));
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete report.");
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1400px] space-y-6">
            <section className="rounded-[32px] border border-white/70 bg-white/88 p-6 shadow-[0_24px_65px_-45px_rgba(15,23,42,0.35)] backdrop-blur-xl">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">History</p>
                  <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">AI Report History</h1>
                  <p className="mt-2 text-sm leading-7 text-slate-600">Search, reopen, and delete previously generated premium reports. Results are shown newest first.</p>
                </div>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-700"
                >
                  Back to Dashboard
                </Link>
              </div>

              <div className="mt-5 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <Search size={14} className="text-slate-500" />
                <input
                  aria-label="Search report history"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by product or marketplace"
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
            </section>

            {loading ? (
              <div className="space-y-3 rounded-3xl border border-slate-200 bg-white/88 p-6 shadow-[0_20px_48px_-34px_rgba(15,23,42,0.28)]">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-24 animate-pulse rounded-2xl bg-slate-100" />
                ))}
              </div>
            ) : null}

            {!loading && error ? (
              <ReportErrorCard
                title="Unable to load history"
                message={error}
                actionLabel="Retry"
                onAction={() => router.refresh()}
              />
            ) : null}

            {!loading && !error && reports.length === 0 ? (
              <section className="rounded-3xl border border-dashed border-slate-300 bg-white/88 p-10 text-center shadow-[0_20px_48px_-34px_rgba(15,23,42,0.28)]">
                <p className="text-lg font-semibold text-slate-900">No reports found</p>
                <p className="mt-2 text-sm text-slate-600">Generate a premium report from any product and it will appear here automatically.</p>
              </section>
            ) : null}

            {!loading && !error && reports.length > 0 ? (
              <section className="rounded-3xl border border-slate-200 bg-white/88 p-6 shadow-[0_20px_48px_-34px_rgba(15,23,42,0.28)]">
                <div className="space-y-3">
                  {reports.map((report) => (
                    <article key={report.id} className="rounded-2xl border border-slate-200 bg-slate-50/85 p-4 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-white">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <p className="text-lg font-semibold text-slate-900">{report.product_name}</p>
                          <p className="mt-1 text-sm text-slate-500">
                            {report.marketplace || "Unknown marketplace"} • Opportunity {report.opportunity_score} • Confidence {report.confidence_score}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            Created {formatDateTime(report.created_at)} • Updated {formatDateTime(report.updated_at)}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => router.push(`/dashboard/report/${report.id}`)}
                            className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                          >
                            Open Report
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDelete(report.id)}
                            className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                      disabled={page === 1}
                      className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                      disabled={page === totalPages}
                      className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </section>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}