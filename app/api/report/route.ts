import type { NextRequest } from "next/server";
import { handleListReports } from "../../../lib/reports/routeHandlers";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  return handleListReports(req);
}