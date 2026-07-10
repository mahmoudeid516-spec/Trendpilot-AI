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
  
    if (!response.ok) {
      throw new Error(data.error || "Analyze failed.");
    }
  
    return data.result;
  }