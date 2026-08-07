export async function searchProduct(product: string) {
  const response = await fetch("/api/product-search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ keyword: product }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      JSON.stringify(data, null, 2)
    );
  }

  return data;
}