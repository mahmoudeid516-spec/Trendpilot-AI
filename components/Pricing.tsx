export default function Pricing() {
    const plans = [
      {
        name: "Starter",
        price: "$19",
        features: [
          "50 Products / Day",
          "Basic AI Analysis",
          "Email Support",
        ],
      },
      {
        name: "Pro",
        price: "$49",
        features: [
          "Unlimited Products",
          "Advanced AI Analysis",
          "Priority Support",
        ],
      },
      {
        name: "Enterprise",
        price: "$99",
        features: [
          "Unlimited Everything",
          "Private API",
          "Dedicated Manager",
        ],
      },
    ];
  
    return (
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold">
              Pricing Plans
            </h2>
  
            <p className="mt-4 text-xl text-gray-500">
              Choose the perfect plan for your business.
            </p>
          </div>
  
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="bg-white rounded-3xl shadow-xl p-8"
              >
                <h3 className="text-2xl font-bold">
                  {plan.name}
                </h3>
  
                <p className="text-5xl font-bold text-purple-600 mt-6">
                  {plan.price}
                  <span className="text-lg text-gray-400">
                    /month
                  </span>
                </p>
  
                <ul className="mt-8 space-y-4">
                  {plan.features.map((item) => (
                    <li key={item}>
                      ✅ {item}
                    </li>
                  ))}
                </ul>
  
                <button className="mt-8 w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700">
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }