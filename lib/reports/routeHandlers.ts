import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { getAuthenticatedUserId } from "./auth";
import {
  deleteStoredReport,
  generateOrReuseReport,
  getStoredReportById,
  ReportServiceError,
  listStoredReports,
} from "./service";
import { generateReportRequestSchema } from "./schema";
import { consumeUsageOrThrow, requirePlanOrThrow, SubscriptionGuardError } from "../billing/subscriptionMiddleware";
import { recordBillingEvent } from "../services/billing";

function toErrorResponse(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Invalid request payload.",
        details: error.flatten(),
      },
      { status: 400 },
    );
  }

  if (error instanceof ReportServiceError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.status },
    );
  }

  if (error instanceof SubscriptionGuardError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.status },
    );
  }

  return NextResponse.json(
    {
      error: "Unexpected report failure.",
      code: "unexpected_report_failure",
    },
    { status: 500 },
  );
}

async function requireUserId(req: NextRequest): Promise<string | NextResponse> {
  const userId = await getAuthenticatedUserId(req);

  if (!userId) {
    return NextResponse.json(
      {
        error: "Authentication required.",
        code: "auth_required",
      },
      { status: 401 },
    );
  }

  return userId;
}

export async function handleGenerateReport(req: NextRequest) {
  try {
    const userId = await requireUserId(req);
    if (userId instanceof NextResponse) {
      return userId;
    }

    const body = await req.json();
    const parsed = generateReportRequestSchema.parse(body);

    await consumeUsageOrThrow(userId, "ai_report", {
      productName: parsed.product.name,
      forceRegenerate: Boolean(parsed.forceRegenerate),
    });

    const response = await generateOrReuseReport(userId, parsed.product, {
      forceRegenerate: parsed.forceRegenerate,
    });

    await recordBillingEvent({
      userId,
      eventType: response.reusedExisting ? "ai_report_reused" : "ai_report_generated",
      payload: {
        reportId: response.reportId,
        productName: parsed.product.name,
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function handleListReports(req: NextRequest) {
  try {
    const userId = await requireUserId(req);
    if (userId instanceof NextResponse) {
      return userId;
    }

    const page = Number(req.nextUrl.searchParams.get("page") ?? "1");
    const pageSize = Number(req.nextUrl.searchParams.get("pageSize") ?? "10");
    const query = req.nextUrl.searchParams.get("query") ?? undefined;
    const response = await listStoredReports(userId, { page, pageSize, query });

    return NextResponse.json(response);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function handleGetReport(req: NextRequest, reportId: number) {
  try {
    const userId = await requireUserId(req);
    if (userId instanceof NextResponse) {
      return userId;
    }

    const response = await getStoredReportById(userId, reportId);
    return NextResponse.json(response);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function handleDeleteReport(req: NextRequest, reportId: number) {
  try {
    const userId = await requireUserId(req);
    if (userId instanceof NextResponse) {
      return userId;
    }

    await deleteStoredReport(userId, reportId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function handleExportReport(req: NextRequest, reportId: number) {
  try {
    const userId = await requireUserId(req);
    if (userId instanceof NextResponse) {
      return userId;
    }

    await requirePlanOrThrow(userId, "Pro");

    await consumeUsageOrThrow(userId, "export", {
      reportId,
    });

    const response = await getStoredReportById(userId, reportId);

    await recordBillingEvent({
      userId,
      eventType: "report_export",
      payload: {
        reportId,
      },
    });

    return NextResponse.json({
      reportId: response.reportId,
      report: response.report,
      metadata: response.metadata,
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}