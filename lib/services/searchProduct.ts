type SearchProductResult = {
  name: string;
  image?: string;
  source?: string;
  link?: string;
};

export async function searchProduct(
  product: string
): Promise<SearchProductResult> {
  const response = await fetch("/api/product-search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ keyword: product }),
  });

  const data = await response.json();

  if (!response.ok || !data?.success) {
    const message =
      data?.error?.message ?? "Product search failed.";

    throw new Error(message);
  }

  const results = Array.isArray(data.data) ? data.data : [];
  const best = results[0];

  if (!best) {
    throw new Error(`No product found matching "${product}".`);
  }

  return {
    name: best.name,
    image: best.image,
    source: best.source ?? best.platform,
    link: best.product_url,
  };
}
