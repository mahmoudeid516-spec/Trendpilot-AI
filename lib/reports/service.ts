import { revalidateTag, unstable_cache } from "next/cache";
import { ZodError } from "zod";
import { openai } from "../openai";
import { supabaseAdmin } from "../supabaseAdmin";
import {
  buildReportPrompt,
  parseReportResponse,
} from "../ai/reportComposer";

import {
  aiReportSchema,
  reportHistoryQuerySchema,
  reportProductInputSchema,
} from "./schema";

import type {
  GenerateReportResponse,
  ReportDetailResponse,
  ReportHistoryItem,
  ReportHistoryResponse,
  ReportProductInput,
  StoredReportRecord,
} from "../../types/AIReport";

type ReportRow = {
  id: number;
  user_id: string;
  product_id: number | null;
  product_name: string;
  marketplace: string | null;
  report_json: unknown;
  opportunity_score: number;
  confidence_score: number;
  created_at: string;
  updated_at: string;
};

type GenerateReportOptions = {
  forceRegenerate?: boolean;
};

export class ReportServiceError extends Error {
  status: number;
  code: string;
  retryable: boolean;

  constructor(
    message: string,
    status: number,
    code: string,
    retryable = false
  ) {
    super(message);

    this.name = "ReportServiceError";
    this.status = status;
    this.code = code;
    this.retryable = retryable;
  }
}

const REPORT_REQUEST_TIMEOUT_MS = 60000;
const REPORT_MAX_ATTEMPTS = 3;

function historyTag(userId: string) {
  return `reports:${userId}`;
}

function detailTag(userId: string, reportId: number) {
  return `report:${userId}:${reportId}`;
}

function normalizeMarketplace(product: ReportProductInput) {
  return (
    product.marketplace?.trim() ||
    product.platform?.trim() ||
    "Unknown"
  );
}

function sanitizeSearchTerm(query: string) {
  return query.replace(/[,%'"()]/g, " ").trim();
}

function asStoredReportRecord(
  row: ReportRow
): StoredReportRecord {
  return {
    id: row.id,
    user_id: row.user_id,
    product_id: row.product_id,
    product_name: row.product_name,
    marketplace: row.marketplace,
    report_json: aiReportSchema.parse(row.report_json),
    opportunity_score: row.opportunity_score,
    confidence_score: row.confidence_score,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function asReportHistoryItem(
  row: ReportRow
): ReportHistoryItem {
  return {
    id: row.id,
    product_id: row.product_id,
    product_name: row.product_name,
    marketplace: row.marketplace,
    opportunity_score: row.opportunity_score,
    confidence_score: row.confidence_score,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function delay(ms: number) {
  return new Promise<void>((resolve) =>
    setTimeout(resolve, ms)
  );
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  let timeoutId: NodeJS.Timeout | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(
            new ReportServiceError(
              "OpenAI request timed out.",
              504,
              "openai_timeout",
              true
            )
          );
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

function mapOpenAIError(error: unknown): ReportServiceError {
  if (error instanceof ReportServiceError) {
    return error;
  }

  if (error instanceof ZodError) {
    console.error(error.issues);

    return new ReportServiceError(
      "Invalid JSON returned by OpenAI.",
      502,
      "invalid_json"
    );
  }

  const message =
    error instanceof Error
      ? error.message
      : "AI report generation failed.";

  const lowered = message.toLowerCase();

  if (
    lowered.includes("invalid json") ||
    lowered.includes("invalid report structure")
  ) {
    return new ReportServiceError(
      "Invalid report JSON.",
      502,
      "invalid_json",
      true
    );
  }

  if (
    lowered.includes("rate limit") ||
    lowered.includes("429")
  ) {
    return new ReportServiceError(
      "Rate limited.",
      429,
      "rate_limited",
      true
    );
  }

  if (
    lowered.includes("timeout") ||
    lowered.includes("timed out")
  ) {
    return new ReportServiceError(
      "OpenAI timeout.",
      504,
      "openai_timeout",
      true
    );
  }

  return new ReportServiceError(
    message,
    502,
    "openai_failure"
  );
}

async function requestAIReport(
  product: ReportProductInput
) {
  let lastError: ReportServiceError | null = null;

  for (
    let attempt = 1;
    attempt <= REPORT_MAX_ATTEMPTS;
    attempt++
  ) {
    try {
      const completion = await withTimeout(
        openai.chat.completions.create({
          model: "gpt-4.1-mini",
          messages: [
            {
              role: "user",
              content: buildReportPrompt(product),
            },
          ],
          response_format: {
            type: "json_object",
          },
        }),
        REPORT_REQUEST_TIMEOUT_MS
      );

      const content =
        completion.choices?.[0]?.message?.content;

        console.log("=========== OPENAI RAW RESPONSE ===========");
console.log(content);
console.log("===========================================");

      if (!content?.trim()) {
        throw new ReportServiceError(
          "OpenAI returned empty response.",
          502,
          "empty_response",
          true
        );
      }

      try {
  return parseReportResponse(content, product);
} catch (e) {
  console.log("RAW CONTENT:");
  console.log(content);

  throw e;
}
    } catch (error) {
      const mapped = mapOpenAIError(error);

      lastError = mapped;

      if (
        !mapped.retryable ||
        attempt === REPORT_MAX_ATTEMPTS
      ) {
        throw mapped;
      }

      await delay(400 * attempt);
    }
  }

  throw lastError!;
}

async function findExistingReport(
  userId: string,
  product: ReportProductInput
): Promise<StoredReportRecord | null> {
  let query = supabaseAdmin
    .from("reports")
    .select(
      "id,user_id,product_id,product_name,marketplace,report_json,opportunity_score,confidence_score,created_at,updated_at"
    )
    .eq("user_id", userId)
    .eq("product_name", product.name)
    .eq("marketplace", normalizeMarketplace(product))
    .order("created_at", {
      ascending: false,
    })
    .limit(1);

  if (product.id) {
    query = query.eq("product_id", product.id);
  }

  const { data, error } = await query;

  if (error) throw error;

  if (!data?.length) {
    return null;
  }

  return asStoredReportRecord(data[0]);
}

async function insertReport(
  userId: string,
  product: ReportProductInput,
  report: GenerateReportResponse["report"]
): Promise<StoredReportRecord> {
  const { data, error } = await supabaseAdmin
  .from("reports")
  .insert({
    user_id: userId,
    product_id: product.id ?? null,

    product_name: report.product_name,

    platform: report.marketplace,
    marketplace: report.marketplace,

    report: report,
    report_json: report,

    opportunity_score: report.opportunity_score,
    confidence_score: report.confidence_score,
    ai_score: report.ai_score ?? 0,
  })
    .select(
      "id,user_id,product_id,product_name,marketplace,report_json,opportunity_score,confidence_score,created_at,updated_at"
    )
    .single<ReportRow>();

  console.log("INSERT DATA:", data);
  console.log("INSERT ERROR:", error);

  if (error || !data) {
    throw new ReportServiceError(
      error?.message ?? "Failed to insert report.",
      500,
      "supabase_insert"
    );
  }

  return asStoredReportRecord(data);
}

async function updateReport(
  existingId: number,
  userId: string,
  report: GenerateReportResponse["report"]
): Promise<StoredReportRecord> {
  const { data, error } = await supabaseAdmin
    .from("reports")
    .update({
  report: report,
  report_json: report,

  product_name: report.product_name,

  platform: report.marketplace,
  marketplace: report.marketplace,

  opportunity_score: report.opportunity_score,
  confidence_score: report.confidence_score,
  ai_score: report.ai_score ?? 0,

  updated_at: new Date().toISOString(),
})
    .eq("id", existingId)
    .eq("user_id", userId)
    .select(
      "id,user_id,product_id,product_name,marketplace,report_json,opportunity_score,confidence_score,created_at,updated_at"
    )
    .single<ReportRow>();

  console.log("UPDATE DATA:", data);
  console.log("UPDATE ERROR:", error);

  if (error || !data) {
    throw new ReportServiceError(
      error?.message ?? "Failed to update report.",
      500,
      "supabase_update"
    );
  }

  return asStoredReportRecord(data);
}

export async function generateOrReuseReport(
  userId: string,
  input: ReportProductInput,
  options: GenerateReportOptions = {}
): Promise<GenerateReportResponse> {
  console.log("=== generateOrReuseReport CALLED ===");
  const product = reportProductInputSchema.parse(input);

  const existing = await findExistingReport(userId, product);

  console.log("EXISTING REPORT:", existing);
  console.log("FORCE REGENERATE:", options.forceRegenerate);

  if (existing && !options.forceRegenerate) {
    console.log("Returning existing report.");

    return {
      reportId: existing.id,
      report: existing.report_json,
      reusedExisting: true,
    };
  }

  const report = await requestAIReport(product);

  const stored =
    existing && options.forceRegenerate
      ? await updateReport(existing.id, userId, report)
      : await insertReport(userId, product, report);

  console.log("STORED REPORT:", stored);

  revalidateTag(historyTag(userId), "max");
  revalidateTag(detailTag(userId, stored.id), "max");

  return {
    reportId: stored.id,
    report: stored.report_json,
    reusedExisting: false,
  };
}

export async function listStoredReports(
  userId: string,
  input: {
    query?: string;
    page?: number;
    pageSize?: number;
  }
): Promise<ReportHistoryResponse> {
  const parsed = reportHistoryQuerySchema.parse({
    query: input.query,
    page: input.page,
    pageSize: input.pageSize,
  });

  const from = (parsed.page - 1) * parsed.pageSize;
  const to = from + parsed.pageSize - 1;

  let query = supabaseAdmin
    .from("reports")
    .select(
      "id,user_id,product_id,product_name,marketplace,report_json,opportunity_score,confidence_score,created_at,updated_at",
      { count: "exact" }
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (parsed.query) {
    const term = sanitizeSearchTerm(parsed.query);

    if (term) {
      query = query.or(
        `product_name.ilike.%${term}%,marketplace.ilike.%${term}%`
      );
    }
  }

  const { data, count, error } = await query;

  if (error) {
    throw new ReportServiceError(
      error.message,
      500,
      "supabase_history"
    );
  }

  return {
    reports: (data ?? []).map((row) =>
      asReportHistoryItem(row as ReportRow)
    ),
    total: count ?? 0,
    page: parsed.page,
    pageSize: parsed.pageSize,
  };
}

export async function getStoredReportById(
  userId: string,
  reportId: number
): Promise<ReportDetailResponse> {
  const loadReport = unstable_cache(
    async () => {
      const { data, error } = await supabaseAdmin
        .from("reports")
        .select(
          "id,user_id,product_id,product_name,marketplace,report_json,opportunity_score,confidence_score,created_at,updated_at"
        )
        .eq("id", reportId)
        .eq("user_id", userId)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        return null;
      }

      return asStoredReportRecord(data as ReportRow);
    },
    ["report-detail", userId, String(reportId)],
    {
      revalidate: 300,
      tags: [
        detailTag(userId, reportId),
        historyTag(userId),
      ],
    }
  );

  const stored = await loadReport();

  if (!stored) {
    throw new ReportServiceError(
      "Report not found.",
      404,
      "report_not_found"
    );
  }

  return {
    reportId: stored.id,
    report: stored.report_json,
    metadata: {
      id: stored.id,
      product_id: stored.product_id,
      product_name: stored.product_name,
      marketplace: stored.marketplace,
      opportunity_score: stored.opportunity_score,
      confidence_score: stored.confidence_score,
      created_at: stored.created_at,
      updated_at: stored.updated_at,
    },
  };
}

export async function deleteStoredReport(
  userId: string,
  reportId: number
): Promise<void> {
  const { error } = await supabaseAdmin
    .from("reports")
    .delete()
    .eq("id", reportId)
    .eq("user_id", userId);

  if (error) {
    throw new ReportServiceError(
      error.message,
      500,
      "supabase_delete"
    );
  }

  revalidateTag(historyTag(userId), "max");
  revalidateTag(detailTag(userId, reportId), "max");
}
