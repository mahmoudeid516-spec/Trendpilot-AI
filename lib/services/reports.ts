"use client";

import { supabase } from "../supabase";
import type {
  GenerateReportResponse,
  ReportDetailResponse,
  ReportHistoryResponse,
  ReportProductInput,
} from "../../types/AIReport";

type ApiErrorPayload = {
  error?: string;
  code?: string;
};

export class ReportRequestError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ReportRequestError";
    this.status = status;
    this.code = code;
  }
}

async function getAccessToken(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.access_token || null;
}

async function authedFetch(input: string, init?: RequestInit): Promise<Response> {
  const token = await getAccessToken();
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(input, {
    ...init,
    headers,
  });
}

async function parseResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  const data = (await response.json().catch(() => null)) as ApiErrorPayload | null;

  if (!response.ok) {
    throw new ReportRequestError(data?.error || fallbackMessage, response.status, data?.code);
  }

  return data as T;
}

function toSafeNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function toSafeString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function normalizeReportHistoryPayload(payload: unknown): ReportHistoryResponse {
  const raw = (payload ?? {}) as Partial<ReportHistoryResponse> & {
    reports?: unknown;
  };

  const reports = Array.isArray(raw.reports)
    ? raw.reports
      .map((item) => {
        const source = (item ?? {}) as Partial<ReportHistoryResponse["reports"][number]>;
        return {
          id: toSafeNumber(source.id),
          product_id: typeof source.product_id === "number" ? source.product_id : null,
          product_name: toSafeString(source.product_name, "Untitled product"),
          marketplace: source.marketplace ? toSafeString(source.marketplace) : null,
          opportunity_score: toSafeNumber(source.opportunity_score),
          confidence_score: toSafeNumber(source.confidence_score),
          created_at: toSafeString(source.created_at),
          updated_at: toSafeString(source.updated_at),
        };
      })
      .filter((item) => item.id > 0)
    : [];

  return {
    reports,
    total: toSafeNumber(raw.total, reports.length),
    page: Math.max(1, toSafeNumber(raw.page, 1)),
    pageSize: Math.max(1, toSafeNumber(raw.pageSize, 10)),
  };
}

export async function generateAIReport(
  product: ReportProductInput,
  options?: { forceRegenerate?: boolean },
): Promise<GenerateReportResponse> {
  const response = await authedFetch("/api/report/generate", {
    method: "POST",
    body: JSON.stringify({
      product,
      forceRegenerate: options?.forceRegenerate ?? false,
    }),
  });

  return parseResponse<GenerateReportResponse>(response, "Failed to generate report.");
}

export async function fetchReportHistory(options?: {
  query?: string;
  page?: number;
  pageSize?: number;
}): Promise<ReportHistoryResponse> {
  const params = new URLSearchParams();

  if (options?.query) {
    params.set("query", options.query);
  }

  if (options?.page) {
    params.set("page", String(options.page));
  }

  if (options?.pageSize) {
    params.set("pageSize", String(options.pageSize));
  }

  const suffix = params.size > 0 ? `?${params.toString()}` : "";
  try {
    const response = await authedFetch(`/api/report${suffix}`);
    const payload = await parseResponse<unknown>(response, "Failed to load report history.");
    return normalizeReportHistoryPayload(payload);
  } catch (error) {
    if (error instanceof ReportRequestError && error.status === 404) {
      const fallbackResponse = await authedFetch(`/api/reports${suffix}`);
      const fallbackPayload = await parseResponse<unknown>(fallbackResponse, "Failed to load report history.");
      return normalizeReportHistoryPayload(fallbackPayload);
    }

    throw error;
  }
}

export async function fetchReportById(reportId: number): Promise<ReportDetailResponse> {
  const response = await authedFetch(`/api/report/${reportId}`);
  return parseResponse<ReportDetailResponse>(response, "Failed to load report.");
}

export async function deleteReport(reportId: number): Promise<void> {
  const response = await authedFetch(`/api/report/${reportId}`, {
    method: "DELETE",
  });

  await parseResponse<{ success: boolean }>(response, "Failed to delete report.");
}