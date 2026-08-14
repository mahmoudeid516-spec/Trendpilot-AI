"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hasSupabaseConfig, supabase } from "../../lib/supabase";
import Sidebar from "../../components/dashboard/Sidebar";
import AICommandCenter from "../../components/dashboard/AICommandCenter";
import Eyebrow from "../../components/ui/Eyebrow";

// Dedicated destination for the sidebar's "AI Analyzer" item, which
// previously pointed to the same href as "Dashboard" (a dead/duplicate
// link -- clicking it just landed back on the Dashboard with nothing
// AI-analyzer-specific in view). This hosts the existing, already-working
// AI Advisor (AICommandCenter: ask a question -> get AI-scored product
// recommendations) as its own focused page, reusing it as-is rather than
// duplicating its logic. The Dashboard keeps its own copy of the same
// component unchanged.
export default function AIAnalyzerPage() {
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      if (!hasSupabaseConfig()) {
        router.replace("/login");
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
      }
    }

    checkUser();
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface-app)] lg:flex-row">
      <Sidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-col gap-1">
            <Eyebrow icon="🧠" label="AI Analyzer" tone="ai" />
            <h1 className="text-2xl font-bold text-[var(--ink-900)]">Ask TrendPilot AI</h1>
            <p className="text-sm text-[var(--ink-500)]">
              Ask questions and get market intelligence &mdash; not a product list.
            </p>
          </div>

          <AICommandCenter />
        </div>
      </main>
    </div>
  );
}
