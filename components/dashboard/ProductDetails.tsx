import AIReport from "./AIReport";
type Product = {
  image: string;
  name: string;
  platform: string;
  ai_score: number;
  trend_score: number;
  profit: number;
  buy_price: number;
  selling_price: number;
  supplier: string;
  supplier_url: string;
  product_url: string;
  competition: string;
  country: string;
  category: string;
  description?: string;

  recommendation?: string;
  pros?: string[];
  cons?: string[];
};

type ProductDetailsProps = {
  product: Product;
};

export default function ProductDetails({
  product,
}: ProductDetailsProps) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 mt-10">

      <div className="grid lg:grid-cols-2 gap-10">

        {/* Product Image */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-3xl object-cover"
          />
        </div>

        {/* Product Info */}
        <div>

          <h1 className="text-4xl font-bold">
            {product.name}
          </h1>

          <p className="text-gray-500 mt-3">
            {product.description ||
              "AI analyzed this product and found high selling potential."}
          </p>

          <div className="grid grid-cols-2 gap-4 mt-8">

            <div className="bg-gray-100 rounded-xl p-4">
              <p className="text-gray-500">AI Score</p>
              <h2 className="text-3xl font-bold text-green-600">
                {product.ai_score}%
              </h2>
            </div>

            <div className="bg-gray-100 rounded-xl p-4">
              <p className="text-gray-500">Trend Score</p>
              <h2 className="text-3xl font-bold text-purple-600">
                {product.trend_score}%
              </h2>
            </div>

            <div className="bg-gray-100 rounded-xl p-4">
              <p className="text-gray-500">Buy Price</p>
              <h2 className="text-2xl font-bold">
                ${product.buy_price}
              </h2>
            </div>

            <div className="bg-gray-100 rounded-xl p-4">
              <p className="text-gray-500">Selling Price</p>
              <h2 className="text-2xl font-bold">
                ${product.selling_price}
              </h2>
            </div>

            <div className="bg-gray-100 rounded-xl p-4">
              <p className="text-gray-500">Expected Profit</p>
              <h2 className="text-2xl font-bold text-green-600">
                ${product.profit}
              </h2>
            </div>

            <div className="bg-gray-100 rounded-xl p-4">
              <p className="text-gray-500">Competition</p>
              <h2 className="text-2xl font-bold">
                {product.competition}
              </h2>
            </div>

          </div>

          {/* AI Recommendation */}

          <div className="mt-8 bg-purple-50 rounded-2xl p-6">

            <h3 className="text-xl font-bold mb-3">
              🤖 AI Recommendation
            </h3>

            <p className="text-gray-700">
              {product.recommendation ||
                "This product has strong demand, healthy profit margins and excellent viral potential."}
            </p>

          </div>

          {/* Pros & Cons */}

          <div className="grid md:grid-cols-2 gap-6 mt-6">

            <div className="bg-green-50 rounded-2xl p-5">

              <h3 className="font-bold text-green-700 mb-3">
                ✅ Pros
              </h3>

              <ul className="space-y-2">
                {(product.pros ?? [
                  "High demand",
                  "Easy to sell",
                  "Good profit margin",
                ]).map((item, index) => (
                  <li key={index}>
                    • {item}
                  </li>
                ))}
              </ul>

            </div>

            <div className="bg-red-50 rounded-2xl p-5">

              <h3 className="font-bold text-red-700 mb-3">
                ❌ Cons
              </h3>

              <ul className="space-y-2">
                {(product.cons ?? [
                  "Competitive niche",
                  "Requires video marketing",
                ]).map((item, index) => (
                  <li key={index}>
                    • {item}
                  </li>
                ))}
              </ul>

            </div>

          </div>

          {/* Extra Info */}

          <div className="grid grid-cols-2 gap-4 mt-6">

            <div className="bg-gray-100 rounded-xl p-4">
              <p className="text-gray-500">Platform</p>
              <h2 className="font-bold">
                {product.platform}
              </h2>
            </div>

            <div className="bg-gray-100 rounded-xl p-4">
              <p className="text-gray-500">Category</p>
              <h2 className="font-bold">
                {product.category}
              </h2>
            </div>

            <div className="bg-gray-100 rounded-xl p-4">
              <p className="text-gray-500">Country</p>
              <h2 className="font-bold">
                {product.country}
              </h2>
            </div>

            <div className="bg-gray-100 rounded-xl p-4">
              <p className="text-gray-500">Supplier</p>
              <h2 className="font-bold">
                {product.supplier}
              </h2>
            </div>

          </div>

          {/* Buttons */}

          <div className="mt-8 grid grid-cols-2 gap-4">

            <a
              href={product.supplier_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white text-center py-4 rounded-xl hover:bg-gray-800 transition"
            >
              View Supplier
            </a>

            <a
              href={product.product_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-600 hover:bg-purple-700 text-white text-center py-4 rounded-xl transition"
            >
              🚀 View Product
            </a>

          </div>

        </div>

      </div>

      <AIReport
  aiScore={product.ai_score}
  trendScore={product.trend_score}
  competition={product.competition}
  recommendation={
    product.recommendation ||
    "This product has strong demand and excellent profit potential."
  }
/>

    </div>
  );
}