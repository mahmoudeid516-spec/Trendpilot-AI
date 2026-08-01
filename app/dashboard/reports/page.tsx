"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getReports, deleteReport } from "@/services/reports";
import { toast } from "sonner";
import SkeletonCard from "@/components/ui/SkeletonCard";
import EmptyState from "@/components/ui/EmptyState";

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const filteredReports = useMemo(() => {
    const filtered = reports.filter((report) => {
      const term = search.toLowerCase();

      return (
        report.product_name?.toLowerCase().includes(term) ||
        report.marketplace?.toLowerCase().includes(term)
      );
    });

    switch (sortBy) {
      case "opportunity":
        filtered.sort(
          (a, b) => b.opportunity_score - a.opportunity_score
        );
        break;

      case "confidence":
        filtered.sort(
          (a, b) => b.confidence_score - a.confidence_score
        );
        break;

      default:
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );
    }

    return filtered;
  }, [reports, search, sortBy]);

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this report?"
    );

    if (!confirmed) return;

    try {
      await deleteReport(id);

toast.success("Report deleted successfully.");

setReports((prev) =>
  prev.filter((report) => report.id !== id)
);

      setReports((prev) =>
        prev.filter((report) => report.id !== id)
      );
    } catch (err) {
      console.error(err);
     toast.error("Failed to delete report.");
    }
  }

  useEffect(() => {
    async function loadReports() {
      try {
        const data = await getReports();
        setReports(data ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, []);

  if (loading) {
  return (
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-bold">
        Reports History
      </h1>

      <div className="grid gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}

  return (
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-bold">
        Reports History
      </h1>

      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <input
          type="text"
          placeholder="Search reports..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white"
        />

        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value)
          }
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white"
        >
          <option value="newest">
            Newest
          </option>

          <option value="opportunity">
            Highest Opportunity
          </option>

          <option value="confidence">
            Highest Confidence
          </option>
        </select>
      </div>

      {filteredReports.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="rounded-xl border p-5 shadow-sm"
            >
              <h2 className="text-xl font-semibold">
                {report.product_name}
              </h2>

              <p className="text-sm text-gray-500">
                {report.marketplace}
              </p>

              <div className="mt-3 flex gap-6">
                <span>
                  Opportunity:{" "}
                  <strong>
                    {report.opportunity_score}
                  </strong>
                </span>

                <span>
                  Confidence:{" "}
                  <strong>
                    {report.confidence_score}
                  </strong>
                </span>
              </div>

              <div className="mt-4 flex gap-4">
                <Link
                  href={`/dashboard/report/${report.id}`}
                  className="text-indigo-600 hover:underline"
                >
                  View Report →
                </Link>

                <button
                  onClick={() =>
                    handleDelete(report.id)
                  }
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}