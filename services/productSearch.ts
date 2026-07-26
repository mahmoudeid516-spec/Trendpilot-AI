type ProductSearchFilters = {
  keyword?: string;
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
    `/api/discover?search=${encodeURIComponent(search)}`
  );

  if (!response.ok) {
    throw new Error("Product Search Failed");
  }

  return await response.json();
}