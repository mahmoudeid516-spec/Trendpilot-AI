type ProductSearchFilters = {
  keyword?: string;
  platform?: string;
  query?: string;
  search?: string;
};

// Distinguishes "the provider/config is unavailable" (e.g. missing
// DataForSEO credentials, 503) from other failures, so the UI can show
// "Product search is temporarily unavailable" instead of a raw error for
// that specific case.
export class ProductSearchError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ProductSearchError";
    this.status = status;
  }
}

export async function productSearch(filters: ProductSearchFilters) {
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

  if (!response.ok) {
    const contentType = response.headers.get("content-type") ?? "";

    let message = "Product search failed.";

    if (contentType.includes("application/json")) {
      const body = await response.json().catch(() => null);
      if (body && typeof body.error === "string") {
        message = body.error;
      }
    } else {
      const text = await response.text().catch(() => "");
      if (text) {
        message = text;
      }
    }

    throw new ProductSearchError(message, response.status);
  }

  return await response.json();
}
