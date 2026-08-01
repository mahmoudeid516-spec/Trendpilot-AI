import { supabase } from "../lib/supabase";

export type ProfileRecord = {
  id: string;
  email: string | null;
  full_name: string | null;
  plan: "Free" | "Pro" | "Premium" | null;
  subscription_status: string | null;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  current_period_start?: string | null;
  current_period_end?: string | null;
  cancel_at_period_end?: boolean | null;
  renewal_date?: string | null;
  updated_at?: string | null;
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
    .select("*")
    .eq("id", user.id)
    .maybeSingle<ProfileRecord>();

  if (existingError) {
    return null;
  }

  if (existing) {
    return existing;
  }

  const metadataName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name.trim()
      : "";

  const fullName = metadataName || deriveFallbackName(user.email);

  const { error: upsertError } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        email: user.email ?? null,
        full_name: fullName,
        plan: "Free",
        subscription_status: "inactive",
      },
      {
        onConflict: "id",
      }
    );

  if (upsertError) {
    return null;
  }

  const { data: created } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<ProfileRecord>();

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

export async function updateProfile(fullName: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found");

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
    })
    .eq("id", user.id);

  if (error) {
    throw error;
  }

  return true;
}