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

  console.log("ANALYZE RESPONSE:");
  console.log(data);

  if (!response.ok) {
    throw new Error(JSON.stringify(data, null, 2));
  }

  return data.result;
}