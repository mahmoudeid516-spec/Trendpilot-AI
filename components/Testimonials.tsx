export default function Testimonials() {
    const reviews = [
      {
        name: "Michael",
        company: "Shopify Seller",
        review:
          "TrendPilot helped me find products before everyone else.",
      },
      {
        name: "Sarah",
        company: "Amazon FBA",
        review:
          "My sales increased after using AI recommendations.",
      },
      {
        name: "David",
        company: "TikTok Shop",
        review:
          "Amazing platform with very accurate trend predictions.",
      },
    ];
  
    return (
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
  
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold">
              What Our Customers Say
            </h2>
  
            <p className="mt-4 text-xl text-gray-500">
              Trusted by thousands of eCommerce sellers.
            </p>
          </div>
  
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div
                key={review.name}
                className="bg-gray-50 rounded-3xl p-8 shadow-lg"
              >
                <p className="text-gray-600 leading-8">
                  "{review.review}"
                </p>
  
                <div className="mt-8">
                  <h3 className="font-bold text-xl">
                    {review.name}
                  </h3>
  
                  <p className="text-gray-500">
                    {review.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
  
        </div>
      </section>
    );
  }