"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    let active = true;

    async function signOut() {
      await supabase.auth.signOut();
      if (active) {
        router.replace("/login?logout=success");
      }
    }

    void signOut();

    return () => {
      active = false;
    };
  }, [router]);

  return null;
}
