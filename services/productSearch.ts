type ProductSearchFilters = {
  keyword?: string;
  platform?: string;
  query?: string;
  search?: string;
  /** Requested product count (10/20/30/50/100). Optional -- server defaults to 20. */
  count?: number;
};

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
        count: filters?.count,
      }),
    }
  );

  if (!response.ok) {
    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const body = await response.json().catch(() => null);
      throw new Error(
        (typeof body?.error === "string" && body.error) || `Product search failed (HTTP ${response.status}).`
      );
    }

    const text = await response.text().catch(() => "");
    throw new Error(text || `Product search failed (HTTP ${response.status}).`);
  }

  return await response.json();
}