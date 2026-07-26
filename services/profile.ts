import { supabase } from "../lib/supabase";

export type ProfileRecord = {
  id: string;
  email: string | null;
  full_name: string | null;
  plan: "Free" | "Pro" | "Premium" | null;
  subscription_status: string | null;
};

function deriveFallbackName(email: string | null | undefined): string {
  if (!email) {
    return "";
  }

  return email.trim();
}

export async function ensureProfileForUser(user: {
  id: string;
  email?: string | null;
  user_metadata?: {
    full_name?: unknown;
  };
}): Promise<ProfileRecord | null> {
  const { data: existing, error: existingError } = await supabase
    .from("profiles")
    .select("id, email, full_name, plan, subscription_status")
    .eq("id", user.id)
    .maybeSingle<ProfileRecord>();

  if (existingError) {
    return null;
  }

  if (existing) {
    return existing;
  }

  const metadataName = typeof user.user_metadata?.full_name === "string"
    ? user.user_metadata.full_name.trim()
    : "";
  const fullName = metadataName || deriveFallbackName(user.email);

  const { error: upsertError } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      email: user.email ?? null,
      full_name: fullName,
      plan: "Free",
      subscription_status: "inactive",
    }, { onConflict: "id" });

  if (upsertError) {
    return null;
  }

  const { data: created, error: createdReadError } = await supabase
    .from("profiles")
    .select("id, email, full_name, plan, subscription_status")
    .eq("id", user.id)
    .maybeSingle<ProfileRecord>();

  if (createdReadError) {
    return null;
  }

  return created;
}

export async function getProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return ensureProfileForUser({
    id: user.id,
    email: user.email,
    user_metadata: user.user_metadata,
  });
}
