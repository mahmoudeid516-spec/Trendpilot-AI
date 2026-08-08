import { NextResponse } from "next/server";

export type ApiSuccess<T> = {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
};

export type ApiErrorBody = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};

export function apiSuccess<T>(
  data: T,
  options?: { meta?: Record<string, unknown>; status?: number }
) {
  const body: ApiSuccess<T> = options?.meta
    ? { success: true, data, meta: options.meta }
    : { success: true, data };

  return NextResponse.json(body, { status: options?.status ?? 200 });
}

export function apiError(code: string, message: string, status: number) {
  const body: ApiErrorBody = { success: false, error: { code, message } };
  return NextResponse.json(body, { status });
}
