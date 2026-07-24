import { supabase } from "../supabase";

export async function analyzeProduct(product: string) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("User not logged in.");
  }

  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product,
      userId: session.user.id,
    }),
  });

  const data = await response.json();

  console.log("ANALYZE RESPONSE:");
  console.log(data);

  if (!response.ok) {
    throw new Error(data.error);
  }

  return data.result;
}