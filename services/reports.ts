import { supabase } from "../lib/supabase";
import type { ReportHistoryItem } from "../types/AIReport";

export async function getReports(): Promise<ReportHistoryItem[]> {
  const { data, error } = await supabase
    .from("reports")
    .select(`
      id,
      product_id,
      product_name,
      marketplace,
      opportunity_score,
      confidence_score,
      created_at,
      updated_at
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as ReportHistoryItem[];
}

export async function deleteReport(id: number): Promise<void> {
  const { error } = await supabase
    .from("reports")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}