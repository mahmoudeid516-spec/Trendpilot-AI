import { supabase } from "../supabase";

export async function generateMarketing(product: Record<string, unknown>) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const response = await fetch("/api/generate_marketing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
      body: JSON.stringify({ product }),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.error || "Failed to generate marketing.");
    }
  
    return data.marketing;
  }