import { searchAliExpress } from "../providers/aliexpress";
import { scoreProducts } from "../businessAdvisor";
import { analyzeProduct } from "../AIAdvisor";
import { calculateBusinessMetrics } from "../BusinessMetrics";

export async function runProductEngine(
  keyword: string,
  platform = "AliExpress"
) {
  // جلب المنتجات الحقيقية
  const products = await searchAliExpress(keyword);

  // ترتيب المنتجات
  const rankedProducts = scoreProducts(products);

  // تحليل AI
  const analyzedProducts = rankedProducts.map(analyzeProduct);

  // حساب الربح والـ ROI وسعر البيع
  const finalProducts = analyzedProducts.map(calculateBusinessMetrics);

  return finalProducts;
}