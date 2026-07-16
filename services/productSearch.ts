import { supabase } from "../lib/supabase";
import { searchAliExpress } from "./providers/aliexpress";
import { calculateProductsMetrics } from "./BusinessMetrics";
import { scoreProducts } from "./businessAdvisor";

export async function searchProducts(
  keyword: string,
  platform = "All"
) {
  // 1️⃣ ابحث في قاعدة البيانات أولاً
  let query = supabase.from("products").select("*");

  if (keyword.trim()) {
    query = query.ilike("name", `%${keyword}%`);
  }

  if (platform !== "All") {
    query = query.eq("platform", platform);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
  }

  // إذا وجدنا نتائج في قاعدة البيانات نرجعها فورًا
  if (data && data.length > 0) {
    console.log("Loaded from Supabase");
    return data;
  }

  console.log("Nothing found in Supabase...");
  console.log("Searching AliExpress...");

  // 2️⃣ جلب منتجات حقيقية
  const products = await searchAliExpress(keyword);

  // 3️⃣ حساب الربح والـ ROI
  const metrics = calculateProductsMetrics(products);

  // 4️⃣ حساب الـ Opportunity Score
  const ranked = scoreProducts(metrics);

  // 5️⃣ حفظ النتائج في Supabase
  if (ranked.length) {
    await supabase
      .from("products")
      .upsert(ranked, {
        onConflict: "id",
      });
  }

  return ranked;
}