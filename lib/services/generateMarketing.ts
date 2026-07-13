export async function generateMarketing(product: any) {
    const response = await fetch("/api/generate-marketing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product }),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.error || "Failed to generate marketing.");
    }
  
    return data.marketing;
  }