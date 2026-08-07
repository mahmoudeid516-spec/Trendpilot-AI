type ProductSearchFilters = {
  keyword?: string;
  platform?: string;
  query?: string;
  search?: string;
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