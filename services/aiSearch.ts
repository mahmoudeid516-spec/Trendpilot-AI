export async function aiSearch(prompt: string) {

    const response = await fetch("/api/ai-search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data?.success) {
      throw new Error(data?.error?.message || "AI Search Failed");
    }

    return data.data;
  }
