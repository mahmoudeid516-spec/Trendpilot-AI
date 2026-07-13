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
  ai_reason?: string;
};

type Props = {
  product: Product;
};

export default function ProductDetails({ product }: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 mt-10">

      <div className="grid lg:grid-cols-2 gap-10">

        <img
          src={product.image}
          alt={product.name}
          className="w-full rounded-3xl object-cover"
        />

        <div>

          <h1 className="text-4xl font-bold">
            {product.name}
          </h1>

          <p className="text-gray-500 mt-3">
            {product.description || "No description available."}
          </p>

          <div className="grid grid-cols-2 gap-4 mt-8">

            <div className="bg-gray-100 rounded-xl p-4">
              <p>AI Score</p>
              <h2 className="text-3xl font-bold text-green-600">
                {product.ai_score}
              </h2>
            </div>

            <div className="bg-gray-100 rounded-xl p-4">
              <p>Trend Score</p>
              <h2 className="text-3xl font-bold text-purple-600">
                {product.trend_score}
              </h2>
            </div>

            <div className="bg-gray-100 rounded-xl p-4">
              <p>Buy Price</p>
              <h2 className="text-3xl font-bold">
                ${product.buy_price}
              </h2>
            </div>

            <div className="bg-gray-100 rounded-xl p-4">
              <p>Selling Price</p>
              <h2 className="text-3xl font-bold">
                ${product.selling_price}
              </h2>
            </div>

            <div className="bg-gray-100 rounded-xl p-4">
              <p>Profit</p>
              <h2 className="text-3xl font-bold text-green-600">
                ${product.profit}
              </h2>
            </div>

            <div className="bg-gray-100 rounded-xl p-4">
              <p>Competition</p>
              <h2 className="text-2xl font-bold">
                {product.competition}
              </h2>
            </div>

          </div>

          <div className="mt-8 bg-purple-50 rounded-2xl p-6">

            <h3 className="text-xl font-bold mb-3">
              🤖 AI Recommendation
            </h3>

            <p className="text-gray-700">
              {product.ai_reason ||
                "This product has high demand, strong profit margin, and excellent viral potential."}
            </p>

          </div>

          <button
            className="w-full mt-8 bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl text-xl font-bold"
          >
            🚀 Launch Product
          </button>

        </div>

      </div>

    </div>
  );
}