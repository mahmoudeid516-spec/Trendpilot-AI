export async function analyzeProduct(product: string) {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data?.success) {
    const message = data?.error?.message ?? "Product analysis failed.";
    throw new Error(message);
  }

  return data.data;
}
