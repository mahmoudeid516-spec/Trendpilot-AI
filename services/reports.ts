import { supabase } from "../lib/supabase";

export async function getReports() {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}
export async function deleteReport(id: number) {
  const { error } = await supabase
    .from("reports")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}