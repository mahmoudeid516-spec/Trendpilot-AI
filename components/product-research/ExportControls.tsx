"use client";

import type { ProductAnalysisResponse } from "../../types/analysis";
import { toJson, toCsv, downloadFile } from "../../lib/export/exportReport";

type Props = {
  result: ProductAnalysisResponse;
  requestedCount: number;
};

function safeFilenamePart(keyword: string): string {
  return keyword.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "report";
}

export default function ExportControls({ result, requestedCount }: Props) {
  function handleExportJson() {
    const filename = `trendpilot-${safeFilenamePart(result.keyword)}.json`;
    downloadFile(filename, toJson(result, requestedCount), "application/json");
  }

  function handleExportCsv() {
    const filename = `trendpilot-${safeFilenamePart(result.keyword)}-products.csv`;
    downloadFile(filename, toCsv(result, requestedCount), "text/csv");
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExportJson}
        className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
      >
        Export JSON
      </button>
      <button
        onClick={handleExportCsv}
        className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
      >
        Export CSV
      </button>
    </div>
  );
}
