"use client";

import { Download } from "lucide-react";
import type { ProductAnalysisResponse } from "../../types/analysis";
import { toJson, toCsv, downloadFile } from "../../lib/export/exportReport";
import { buttonClass } from "../ui/button";

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
      <button onClick={handleExportJson} className={buttonClass({ variant: "outline", size: "sm" })}>
        <Download size={14} />
        JSON
      </button>
      <button onClick={handleExportCsv} className={buttonClass({ variant: "outline", size: "sm" })}>
        <Download size={14} />
        CSV
      </button>
    </div>
  );
}
