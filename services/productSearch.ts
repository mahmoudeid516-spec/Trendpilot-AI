import type { Product } from "../types/Product";

type ProductSearchFilters = {
  keyword?: string;
  platform?: string;
  query?: string;
  search?: string;
};

// Carries the API envelope's error code through to the UI so it can show a
// specific, actionable state (credentials missing, provider auth failed,
// provider timed out, malformed response, generic failure) instead of one
// message that reads the same as "no products found."
export type ProductSearchErrorCode =
  | "PRODUCT_PROVIDER_ERROR"
  | "PRODUCT_PROVIDER_AUTH_FAILED"
  | "PRODUCT_PROVIDER_TIMEOUT"
  | "PRODUCT_PROVIDER_MALFORMED_RESPONSE"
  | "PRODUCT_SEARCH_FAILED"
  | "UNKNOWN";

export class ProductSearchError extends Error {
  status?: number;
  code: ProductSearchErrorCode;

  constructor(message: string, status?: number, code?: ProductSearchErrorCode) {
    super(message);
    this.name = "ProductSearchError";
    this.status = status;
    this.code = code ?? "UNKNOWN";
  }
}

export async function productSearch(
  filters: ProductSearchFilters
): Promise<Product[]> {
  const search =
  filters?.keyword ||
  filters?.query ||
  filters?.search ||
  "wireless earbuds";

  const response = await fetch(
    "/api/product-search",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        keyword: search,
        platform: filters?.platform,
      }),
    }
  );

  const body = await response.json().catch(() => null);

  if (!response.ok || !body?.success) {
    const message =
      body?.error?.message ??
      (typeof body?.error === "string" ? body.error : null) ??
      "Product search failed.";

    const code: ProductSearchErrorCode = body?.error?.code ?? "UNKNOWN";

    throw new ProductSearchError(message, response.status, code);
  }

  return (body.data ?? []) as Product[];
}
