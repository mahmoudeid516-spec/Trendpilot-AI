export default function HowItWorks() {
    const steps = [
      {
        number: "01",
        title: "Discover Products",
        description:
          "Our AI scans millions of products from multiple marketplaces every day.",
      },
      {
        number: "02",
        title: "Analyze Trends",
        description:
          "We calculate trend score, competition level and profit potential.",
      },
      {
        number: "03",
        title: "Start Selling",
        description:
          "Choose the best product and launch your store with confidence.",
      },
    ];
  
    return (
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold">
              How It Works
            </h2>
  
            <p className="mt-4 text-xl text-gray-500">
              Discover winning products in three simple steps.
            </p>
          </div>
  
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition"
              >
                <div className="text-5xl font-bold text-purple-600">
                  {step.number}
                </div>
  
                <h3 className="text-2xl font-bold mt-6">
                  {step.title}
                </h3>
  
                <p className="mt-4 text-gray-500 leading-7">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }