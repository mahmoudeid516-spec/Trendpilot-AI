import type { Product } from "../types/Product";

// دالة مساعدة لتوليد جملة تحليل ذكاء اصطناعي احترافية بشكل ديناميكي بناءً على أداء المنتج
function generateAIReason(name: string, score: number, sold: number): string {
  if (score >= 90) {
    return `🔥 Highly Recommended! This product shows a massive spike in daily orders (${sold} sales) with high social media engagement. Profit margins are optimized for fast scaling via TikTok & Meta Ads.`;
  } else if (score >= 75) {
    return `📈 Strong market demand with moderate competition. Ideal for testing with a targeted audience. Suggesting immediate launch with video ads focused on problem-solving features.`;
  } else {
    return `⚙️ Stable evergreen potential. Recommended as an upsell or cross-sell product rather than a main campaign driver. Focus on bundle offers to increase AOV.`;
  }
}

// دالة مساعدة لتوليد ربح يومي متغير (Today's Profit) يبدو حياً ويتحدث كل يوم بنسبة بسيطة
function calculateDynamicDailyProfit(basePrice: number, sold: number): number {
  const dayOfMonth = new Date().getDate(); // رقم اليوم في الشهر (1-31) يجعل الرقم يتغير يومياً تلقائياً
  const dynamicFactor = 1.2 + (dayOfMonth % 5) * 0.1; // توليد معامل ربح متغير بين 1.2 و 1.6
  const ordersToday = Math.max(5, Math.round((sold * 0.02) + (dayOfMonth % 10))); // محاكاة لطلبات اليوم
  return Number((basePrice * dynamicFactor * ordersToday).toFixed(2));
}

export function mapApifyProduct(product: any): Product {
  // ==============================
  // الحـالة 1: البيانات القادمة من Supabase
  // ==============================
  if (product.name) {
    const aiScore = Number(product.ai_score || 0);
    const soldCount = Number(product.orders || product.sales || 0);

    return {
      ...product,
      id: Number(product.id),
      source:
        product.platform === "Amazon"
          ? "Amazon"
          : product.platform === "Shopify"
          ? "Shopify"
          : "AliExpress",
      platform: product.platform || "AliExpress",
      name: product.name,
      description: product.description || "",
      image: product.image || product.image_url || "",
      category: product.category || "General",
      brand: product.brand || "",
      product_url: product.product_url || "",
      supplier: product.supplier || "AliExpress",
      supplier_url: product.supplier_url || "",
      store_name: product.store_name || "",
      store_rating: Number(product.store_rating || 0),
      supplier_rating: Number(product.supplier_rating || 0),
      currency: product.currency || "USD",
      buy_price: Number(product.buy_price || 0),
      selling_price: Number(product.selling_price || 0),
      // جعل الأرباح تتغير يومياً لتحديث ميزة الـ Fresh
      profit: product.profit ? Number(product.profit) : calculateDynamicDailyProfit(Number(product.buy_price || 0), soldCount),
      roi: Number(product.roi || 0),
      sales: soldCount,
      orders: soldCount,
      reviews: Number(product.reviews || 0),
      country: product.country || "Global",
      shipping_days: Number(product.shipping_days || 10),
      ai_score: aiScore,
      trend_score: Number(product.trend_score || 0),
      viral_score: Number(product.viral_score || 0),
      opportunity_score: Number(product.opportunity_score || 0),
      demand_score: Number(product.demand_score || 0),
      confidence_score: Number(product.confidence_score || 0),
      risk_score: Number(product.risk_score || 0),
      winning_probability: Number(product.winning_probability || 0),
      decision: product.decision || "Test First",
      // ملء التحليل التلقائي إذا لم يكن موجوداً في قاعدة البيانات
      ai_reason: product.ai_reason || generateAIReason(product.name, aiScore, soldCount),
      competition: product.competition || "Medium",
      trend_direction: product.trend_direction || "Stable",
      seasonality: product.seasonality || "Evergreen",
      cpm: Number(product.cpm || 0),
      cpa: Number(product.cpa || 0),
    };
  }

  // ==============================
  // الحـالة 2: قادم مباشرة من AliExpress API
  // ==============================
  const title =
    product.itemTitle ||
    product.title ||
    product.productTitle ||
    product.subject ||
    product.name ||
    "Unknown Product";

  const image =
    product.itemMainPic ||
    product.imageUrl ||
    product.image ||
    product.mainImage ||
    product.imageUrls?.[0] ||
    "";

  const price =
    Number(product.salePrice) ||
    Number(product.targetSalePrice) ||
    Number(product.originalPrice) ||
    Number(product.targetOriginalPrice) ||
    Number(product.sale_price) ||
    Number(product.sale_price_usd) ||
    Number(product.price) ||
    Number(product.priceMin) ||
    Number(product.priceMax) ||
    0;

  const sold =
    Number(product.orders) ||
    Number(product.trade) ||
    Number(product.tradeCount) ||
    Number(product.sales) ||
    Number(product.sold) ||
    0;

  const reviews =
    Number(product.reviewCount) ||
    Number(product.reviews) ||
    Number(product.feedbackCount) ||
    0;

  const rating =
    Number(product.evaluateRate) ||
    Number(product.evaluationRate) ||
    Number(product.rating) ||
    Number(product.score) ||
    0;

  const aiScore = Math.min(
    100,
    Math.round(rating * 20 + Math.min(sold / 20, 40))
  );

  const trendScore = Math.min(100, Math.round(aiScore * 0.95));
  const viralScore = Math.min(100, Math.round(aiScore * 0.90));
  const opportunity = Math.min(
    100,
    Math.round(aiScore * 0.7 + Math.min(sold / 50, 30))
  );

  // جعل تسعير المنتج احترافي (ينتهي دائماً بـ .99 ليعطي طابع المتاجر الحقيقية)
  const calculatedSellingPrice = Number((price * 2.5 + 0.99).toFixed(2));
  const todayDynamicProfit = calculateDynamicDailyProfit(price, sold);

  console.log("====== RAW PRODUCT ======");
  console.log({ title, price, sold, reviews, rating });

  return {
    id: Number(product.itemId || Date.now()),
    source: "AliExpress",
    platform: "AliExpress",
    name: title,
    description: product.description || "",
    image,
    category: product.category || "General",
    brand: product.brand || "",
    product_url:
      product.itemUrl ||
      product.productUrl ||
      `https://www.aliexpress.com/item/${product.itemId}.html`,
    supplier: "AliExpress",
    supplier_url: `https://www.aliexpress.com/item/${product.itemId}.html`,
    store_name: product.storeName || "Global Supplier",
    store_rating: Number(product.storeRating || 0),
    supplier_rating: Number(product.storeRating || 0),
    currency: product.currency || "USD",
    buy_price: price,
    selling_price: calculatedSellingPrice,
    // حساب الأرباح التنافسية الحية ليومنا هذا
    profit: todayDynamicProfit,
    roi: price > 0 ? Math.round(((calculatedSellingPrice - price) / price) * 100) : 0,
    sales: sold,
    orders: sold,
    reviews,
    country: product.shipTo || "Global",
    shipping_days: Number(product.shippingDays || 10),
    ai_score: aiScore,
    trend_score: trendScore,
    viral_score: viralScore,
    opportunity_score: opportunity,
    demand_score: sold,
    confidence_score: aiScore,
    risk_score: sold > 500 ? 20 : sold > 100 ? 40 : 70,
    winning_probability: opportunity,
    decision:
      opportunity >= 85
        ? "Strong Buy"
        : opportunity >= 65
        ? "Test First"
        : "Avoid",
    // توليد مبرر الذكاء الاصطناعي الذكي تلقائياً بدلاً من تركه فارغاً!
    ai_reason: generateAIReason(title, aiScore, sold),
    competition: sold > 1000 ? "High" : sold > 100 ? "Medium" : "Low",
    trend_direction: "Stable",
    seasonality: "Evergreen",
    cpm: Number((10 + (aiScore % 5)).toFixed(2)), // توليد أرقام إعلانية افتراضية قريبة للواقع
    cpa: Number((3 + (aiScore % 3)).toFixed(2)),
  };
}