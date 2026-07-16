"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Sidebar from "../../components/dashboard/Sidebar";
import DashboardHero from "../../components/dashboard/DashboardHero";
import StatsCards from "../../components/dashboard/StatsCards";
import BusinessOverview from "../../components/dashboard/BusinessOverview";
import AIInsights from "../../components/dashboard/AIInsights";
import AICommandCenter from "../../components/dashboard/AICommandCenter";
import SearchBar from "../../components/dashboard/SearchBar";
import Filters from "../../components/dashboard/Filters";
import AIAnalyzer from "../../components/dashboard/AIAnalyzer";
import ProductsTable from "../../components/dashboard/ProductsTable";
import ProductDetails from "../../components/dashboard/ProductDetails";
import TrendChart from "../../components/dashboard/TrendChart";
import AISalesForecast from "../../components/dashboard/AISalesForecast";
import MarketingKit from "../../components/dashboard/MarketingKit";
import ProGate from "../../components/dashboard/ProGate";
import { importProducts } from "../../lib/importers/importProducts";
import { searchAliExpress } from "../../services/providers/aliexpress";
import { mapApifyProduct } from "../../services/productMapper";
import { dummyProducts } from "../../lib/importers/dummyProducts";
import AICopilot from "../../components/dashboard/AICopilot";

export default function DashboardPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false); // حالة التحديث الفوري (Fresh)
  
  // حفظ نوع اشتراك المستخدم الحالي: 'free' | 'pro' | 'premium'
  const [subscriptionRole, setSubscriptionRole] = useState<string>("free"); 
  const [userId, setUserId] = useState<string | null>(null);

  const totalProducts = searchResults.length;

  const winningProducts = searchResults.filter(
    (p) => Number(p.aiScore || 0) >= 90
  ).length;

  const averageAIScore =
    totalProducts > 0
      ? Math.round(
          searchResults.reduce(
            (sum, p) => sum + Number(p.aiScore || 0),
            0
          ) / totalProducts
        )
      : 0;

  // 1. التأكد من المستخدم وجلب اشتراكه من قاعدة البيانات فوراً
  useEffect(() => {
    async function checkUserAndSubscription() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      setUserId(session.user.id);

      // جلب رتبة الاشتراك من جدول المستخدمين (افترضنا أن اسم الجدول profiles أو users ولديه حقل subscription)
      const { data, error } = await supabase
        .from("profiles") // تأكد من اسم الجدول الخاص بالمستخدمين في Supabase عندك
        .select("subscription")
        .eq("id", session.user.id)
        .single();

      if (data && !error) {
        setSubscriptionRole(data.subscription || "free");
      }
    }

    checkUserAndSubscription();
  }, [router]);

  // 2. دالة البحث والقيود الذكية حسب نوع الاشتراك
  async function handleSearch(
    searchText: string,
    selectedPlatform: string
  ) {
    console.log("Search:", searchText);
    console.log("Platform:", selectedPlatform);

    if (!searchText.trim()) {
      alert("Please enter a product name.");
      return;
    }

    // جلب المنتجات من AliExpress
    const products = await searchAliExpress(searchText);
    
    console.log("RAW PRODUCTS", products);
    
    let mappedProducts = products;

    // تطبيق منطق قيود الاشتراكات الثلاثة على النتائج:
    if (subscriptionRole === "free") {
      // الخطة المجانية: تظهر فقط أول 3 منتجات رابحة للعميل كعينة لتشجيعه على الترقية
      mappedProducts = products.slice(0, 3);
      alert("Free Account Limit: Showing 3 products only. Upgrade to see more!");
    } else if (subscriptionRole === "pro") {
      // الخطة المتقدمة: تظهر لغاية 15 منتجاً
      mappedProducts = products.slice(0, 15);
    } else if (subscriptionRole === "premium") {
      // الخطة الاحترافية الشاملة: تظهر كل المنتجات بلا قيود
      mappedProducts = products;
    }

    setSearchResults(mappedProducts);

    // الحفظ التلقائي في قاعدة البيانات بالخلفية للخطط المدفوعة فقط لتوفير الموارد
    if (subscriptionRole !== "free") {
      await importProducts(mappedProducts);
    }

    setSearch(searchText);
    setPlatform(selectedPlatform);
    setRefreshKey((prev) => prev + 1);
  }

  // 3. ميزة الـ Fresh الفورية (متاحة فقط للـ Premium)
  async function handleManualFresh() {
    if (subscriptionRole !== "premium") {
      alert("This Instant Fresh feature is only available for Premium Elite users!");
      return;
    }

    if (!search.trim()) {
      alert("Please search for a product category first to refresh active data.");
      return;
    }

    setIsRefreshing(true);
    try {
      // إعادة استعلام مباشر من الـ API للحصول على أحدث أرقام الأرباح اليومية والإحصائيات
      const freshProducts = await searchAliExpress(search);
      setSearchResults(freshProducts);
      await importProducts(freshProducts);
      setRefreshKey((prev) => prev + 1);
      alert("⚡ Data Refreshed Successfully! Showing real-time today's winning metrics.");
    } catch (err) {
      console.error(err);
      alert("Failed to refresh data. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  }

  async function loadDummyProducts() {
    const success = await importProducts(dummyProducts);

    if (success) {
      setRefreshKey((prev) => prev + 1);
      alert("Products Imported Successfully!");
    } else {
      alert("Import Failed");
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-10">
        <div className="max-w-7xl mx-auto">
          
          {/* جزء الترحيب والتحكم الفوري */}
          <div className="flex justify-between items-center mb-6">
            <DashboardHero
              totalProducts={searchResults.length}
              winningProducts={
                searchResults.filter(
                  (p) => Number(p.ai_Score || 0) >= 90
                ).length
              }
            />
            
            {/* زر التحديث الاحترافي الفوري - يظهر للجميع ولكن لا يعمل إلا للبريميوم */}
            <button
              onClick={handleManualFresh}
              disabled={isRefreshing}
              className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                subscriptionRole === "premium"
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/20"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isRefreshing ? "🔄 Refreshing..." : "🔥 Instant Fresh (Today's Profit)"}
            </button>
          </div>

          <StatsCards refreshKey={refreshKey} />

          <BusinessOverview />

          <AIInsights />

          <AICommandCenter />

          <SearchBar 
            search={search}
            setSearch={setSearch}
            platform={platform}
            setPlatform={setPlatform}
            onSearch={handleSearch}
          />

          <div className="mb-6 flex gap-4">
            <button
              onClick={loadDummyProducts}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl"
            >
              🚀 Import Demo Products
            </button>
          </div>

          {/* البوابات الذكية لحماية مميزات الذكاء الاصطناعي والمستودع */}
          <div className="my-8">
            {subscriptionRole === "free" ? (
              // إذا كان المستخدم مجاني تظهر له بوابة الترقية لحجب المحلل المتقدم
              <div className="p-8 bg-white rounded-3xl border border-gray-200 text-center shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-2">📊 AI Professional Analyzer</h3>
                <p className="text-gray-500 mb-4">Upgrade your account to Pro or Premium to unlock real-time store tracking and automated marketing setups!</p>
                <button 
                  onClick={() => router.push("/pricing")} // تأكد من وجود مسار الدفع أو الأسعار
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-semibold"
                >
                  🚀 Upgrade to Pro
                </button>
              </div>
            ) : (
              <AIAnalyzer
                onProductSaved={() => {
                  setRefreshKey((prev) => prev + 1);
                }}
              />
            )}
          </div>

          <ProductsTable
            products={searchResults}
            refreshKey={refreshKey}
            search={search}
            platform={platform}
            onSelectProduct={(product) => {
              setSelectedProduct(product);
              setShowProductModal(true);
            }}
          />

          {showProductModal && selectedProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
              <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white">
                <button
                  onClick={() => setShowProductModal(false)}
                  className="absolute right-6 top-6 text-4xl font-bold text-gray-500 hover:text-black"
                >
                  ×
                </button>

                <ProductDetails product={selectedProduct} />

                {/* حماية التوقعات والخطط التسويقية حسب الاشتراك */}
                {subscriptionRole !== "free" ? (
                  <>
                    <AISalesForecast product={selectedProduct} />
                    <MarketingKit productName={selectedProduct.name} />
                  </>
                ) : (
                  <div className="p-6 text-center border-t border-gray-100 bg-gray-50 rounded-b-3xl">
                    <p className="text-gray-600 font-semibold mb-2">🔒 Sales Forecast & Marketing Kit are locked</p>
                    <button 
                      onClick={() => router.push("/pricing")}
                      className="text-indigo-600 hover:underline font-bold"
                    >
                      Unlock with Pro/Premium subscription &rarr;
                    </button>
                  </div>
                )}
                
                <AICopilot />
              </div>
            </div>
          )}

          <TrendChart />
        </div>
      </main>
    </div>
  );
}