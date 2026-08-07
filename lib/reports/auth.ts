import type { NextRequest } from "next/server";
import { supabaseAdmin } from "../supabaseAdmin";

function getBearerToken(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice("Bearer ".length).trim();
}

export async function getAuthenticatedUserId(
  req: NextRequest
): Promise<string | null> {
  const token = getBearerToken(req);

  if (!token) {
    console.log("NO TOKEN");
    return null;
  }

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token);

  console.log("AUTH TOKEN EXISTS:", !!token);
  console.log("AUTH USER:", user);
  console.log("AUTH ERROR:", error);

  if (error || !user) {
    return null;
  }

  return user.id;
}