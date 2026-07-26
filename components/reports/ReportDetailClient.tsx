"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "../dashboard/Sidebar";
import { deleteReport, fetchReportById } from "../../lib/services/reports";
import type { ReportDetailResponse } from "../../types/AIReport";
import ReportErrorCard from "./ReportErrorCard";
import ReportGenerationLoader from "./ReportGenerationLoader";

const PremiumReport = dynamic(() => import("./PremiumReport"), {
  loading: () => <ReportGenerationLoader progress={72} step="Loading saved report..." etaSeconds={6} />,
});

type Props = {
  reportId: number;
};

export default function ReportDetailClient({ reportId }: Props) {
  const router = useRouter();
  const invalidReportId = !Number.isInteger(reportId) || reportId <= 0;
  const [detail, setDetail] = useState<ReportDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (invalidReportId) {
      return;
    }

    let cancelled = false;

    async function loadDetail() {
      try {
        setLoading(true);
        setError("");
        const response = await fetchReportById(reportId);

        if (!cancelled) {
          setDetail(response);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load report.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadDetail();

    return () => {
      cancelled = true;
    };
  }, [invalidReportId, reportId]);

  async function handleDelete() {
    try {
      setDeleting(true);
      await deleteReport(reportId);
      router.push("/dashboard/history");
    } catch (err) {
      setDeleting(false);
      setError(err instanceof Error ? err.message : "Failed to delete report.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1480px] space-y-6">
            <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(46,16,101,0.92))] p-6 shadow-[0_40px_140px_-60px_rgba(124,58,237,0.95)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-200/75">Report Detail</p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                    {detail?.metadata.product_name || "Saved Report"}
                  </h1>
                  <p className="mt-2 text-sm text-slate-200/75">
                    Stored reports open from Supabase and never regenerate unless you explicitly request regeneration from the product view.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/dashboard/history"
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Back to History
                  </Link>
                  <button
                    type="button"
                    onClick={() => void handleDelete()}
                    disabled={deleting || reportId <= 0}
                    className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deleting ? "Deleting..." : "Delete Report"}
                  </button>
                </div>
              </div>
            </section>

            {loading && !invalidReportId ? <ReportGenerationLoader progress={72} step="Loading saved report..." etaSeconds={6} /> : null}

            {(invalidReportId || (!loading && error)) ? (
              <ReportErrorCard
                title="Unable to load report"
                message={invalidReportId ? "Invalid report id." : error}
                actionLabel="Retry"
                onAction={() => router.refresh()}
              />
            ) : null}

            {!invalidReportId && !loading && !error && detail ? <PremiumReport report={detail.report} /> : null}
          </div>
        </main>
      </div>
    </div>
  );
}