export default function Features() {
    const features = [
      {
        icon: "🤖",
        title: "AI Product Analysis",
        description:
          "Analyze millions of products and discover the best opportunities before everyone else.",
      },
      {
        icon: "📈",
        title: "Trend Prediction",
        description:
          "Track product trends in real time using AI-powered market analysis.",
      },
      {
        icon: "💰",
        title: "Profit Calculator",
        description:
          "Estimate product profit, margins, and selling potential instantly.",
      },
    ];
  
    return (
      <section className="max-w-7xl mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold">
            Everything You Need
          </h2>
  
          <p className="mt-4 text-gray-500 text-xl">
            Powerful AI tools to help you discover winning products faster.
          </p>
        </div>
  
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition duration-300"
            >
              <div className="text-5xl">
                {feature.icon}
              </div>
  
              <h3 className="text-2xl font-bold mt-6">
                {feature.title}
              </h3>
  
              <p className="text-gray-500 mt-4 leading-7">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }