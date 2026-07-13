export async function searchProduct(product: string) {
  const response = await fetch("/api/search-product", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ product }),
  });

  const data = await response.json();

  console.log("SEARCH RESPONSE:", data);

  if (!response.ok) {
    throw new Error(
      JSON.stringify(data, null, 2)
    );
  }

  return data;
}