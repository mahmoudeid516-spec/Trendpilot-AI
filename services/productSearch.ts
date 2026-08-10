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
    const responseBody = contentType.includes("application/json")
      ? JSON.stringify(await response.json())
      : await response.text();

    throw new Error(responseBody || "Product Search Failed");
  }

  return await response.json();
}