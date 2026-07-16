"use client";

export default function Testimonials() {
  const reviews = [
    {
      name: "Michael",
      company: "Shopify Seller",
      review:
        "TrendPilot helped me discover winning products before competitors. The AI recommendations saved me hours of research every week.",
    },
    {
      name: "Sarah",
      company: "Amazon FBA",
      review:
        "The AI analysis is incredibly accurate. I launched two products using TrendPilot and both performed better than expected.",
    },
    {
      name: "David",
      company: "TikTok Shop",
      review:
        "Amazing platform. The market insights and profit calculations gave me confidence before investing in inventory.",
    },
  ];

  return (
    <section
      id="testimonials"
      className="py-28 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-7xl mx-auto px-8">

        {/* Header */}

        <div className="text-center mb-20">

          <span className="inline-flex rounded-full bg-purple-100 px-5 py-2 text-sm font-semibold text-purple-700">
            Testimonials
          </span>

          <h2 className="mt-6 text-5xl font-extrabold">
            Loved by Ecommerce Sellers
          </h2>

          <p className="mt-5 text-xl text-gray-500 max-w-2xl mx-auto">
            Thousands of ecommerce entrepreneurs trust TrendPilot AI every day.
          </p>

        </div>

        {/* Cards */}

        <div className="grid md:grid-cols-3 gap-8">

          {reviews.map((review) => (

            <div
              key={review.name}
              className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl"
            >

              <div className="text-5xl text-purple-300 mb-5">
                “
              </div>

              <p className="leading-8 text-gray-600 min-h-[170px]">
                {review.review}
              </p>

              <div className="mt-6 text-yellow-500 text-xl">
                ★★★★★
              </div>

              <div className="mt-8 flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-xl font-bold text-white">
                  {review.name.charAt(0)}
                </div>

                <div>

                  <h3 className="font-bold text-lg">
                    {review.name}
                  </h3>

                  <p className="text-gray-500">
                    {review.company}
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}