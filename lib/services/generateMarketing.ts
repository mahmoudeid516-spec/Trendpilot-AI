export async function generateMarketing(product: unknown) {
  const response = await fetch("/api/generate_marketing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product }),
    });

    const data = await response.json();

    if (!response.ok || !data?.success) {
      throw new Error(data?.error?.message || "Failed to generate marketing.");
    }

    return data.data.marketing;
  }
