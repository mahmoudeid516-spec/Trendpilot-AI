import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { handleDeleteReport, handleGetReport } from "../../../../lib/reports/routeHandlers";

export const dynamic = "force-dynamic";

function parseReportId(id: string): number | NextResponse {
  const reportId = Number(id);

  if (!Number.isInteger(reportId) || reportId <= 0) {
    return NextResponse.json(
      {
        error: "Invalid report id.",
        code: "invalid_report_id",
      },
      { status: 400 },
    );
  }

  return reportId;
}

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const reportId = parseReportId(id);

  if (reportId instanceof NextResponse) {
    return reportId;
  }

  return handleGetReport(req, reportId);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const reportId = parseReportId(id);

  if (reportId instanceof NextResponse) {
    return reportId;
  }

  return handleDeleteReport(req, reportId);
}