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
  
    if (!response.ok) {
      throw new Error("AI Search Failed");
    }
  
    return await response.json();
  }