export async function searchProduct(product: string) {
    const response = await fetch("/api/search-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product,
      }),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.error || "Search failed.");
    }
  
    return data;
  }