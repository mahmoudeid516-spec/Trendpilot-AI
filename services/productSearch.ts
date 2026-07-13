export async function productSearch(filters: any) {
  const search =
  filters?.keyword ||
  filters?.query ||
  filters?.search ||
  "wireless earbuds";

console.log("SEARCH KEYWORD:", search);

  const response = await fetch(
    `/api/discover?search=${encodeURIComponent(search)}`
  );

  if (!response.ok) {
    throw new Error("Product Search Failed");
  }

  return await response.json();
}