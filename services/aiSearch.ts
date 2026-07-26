import { supabase } from "../lib/supabase";

export async function aiSearch(prompt: string) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const response = await fetch("/api/ai-search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
      body: JSON.stringify({
        prompt,
      }),
    });
  
    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(payload?.error || "AI Search Failed");
    }
  
    return await response.json();
  }