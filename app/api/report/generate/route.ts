import type { NextRequest } from "next/server";
import { handleGenerateReport } from "../../../../lib/reports/routeHandlers";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  return handleGenerateReport(req);
}