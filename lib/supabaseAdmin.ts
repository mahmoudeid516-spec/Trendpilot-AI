import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

console.log("URL =", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log(
  "SERVICE KEY =",
  process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 20)
);