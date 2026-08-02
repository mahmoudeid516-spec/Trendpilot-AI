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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#1e1b4b_0%,#0f172a_35%,#020617_100%)] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1400px] space-y-6">
            <section className="rounded-[32px] border border-white/15 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(46,16,101,0.88))] p-6 shadow-[0_40px_140px_-60px_rgba(124,58,237,0.95)] backdrop-blur-xl sm:p-7">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-200/80">Report Detail</p>
                  <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
                    {detail?.metadata.product_name || "Saved Report"}
                  </h1>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-200/80">
                    Stored reports open from Supabase and never regenerate unless you explicitly request regeneration from the product view.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/dashboard/history"
                    className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/20"
                  >
                    Back to History
                  </Link>
                  <button
                    type="button"
                    onClick={() => void handleDelete()}
                    disabled={deleting || reportId <= 0}
                    className="rounded-2xl border border-rose-300/30 bg-rose-500/15 px-4 py-2.5 text-sm font-semibold text-rose-100 transition hover:-translate-y-0.5 hover:bg-rose-500/25 disabled:cursor-not-allowed disabled:opacity-60"
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