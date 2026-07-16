"use client";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      popular: false,
      features: [
        "50 Products / Day",
        "Basic AI Analysis",
        "Email Support",
      ],
    },
    {
      name: "Pro",
      price: "$49",
      popular: true,
      features: [
        "Unlimited Products",
        "Advanced AI Analysis",
        "Priority Support",
      ],
    },
    {
      name: "Enterprise",
      price: "$99",
      popular: false,
      features: [
        "Unlimited Everything",
        "Private API",
        "Dedicated Manager",
      ],
    },
  ];

  return (
    <section className="py-28 bg-gradient-to-b from-gray-50 to-white">

      <div className="max-w-7xl mx-auto px-8">

        {/* Header */}

        <div className="text-center mb-20">

          <span className="inline-flex rounded-full bg-purple-100 px-5 py-2 text-sm font-semibold text-purple-700">
            Pricing
          </span>

          <h2 className="mt-6 text-5xl font-extrabold text-gray-900">
            Choose Your Plan
          </h2>

          <p className="mt-5 text-xl text-gray-500 max-w-2xl mx-auto">
            Flexible pricing for startups, growing brands and enterprise businesses.
          </p>

        </div>

        {/* Cards */}

        <div className="grid gap-8 md:grid-cols-3">

          {plans.map((plan) => (

            <div
              key={plan.name}
              className={`relative rounded-3xl border bg-white p-10 shadow-xl transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl ${
                plan.popular
                  ? "scale-105 border-purple-500 ring-4 ring-purple-100"
                  : "border-gray-200"
              }`}
            >

              {/* Most Popular */}

              {plan.popular && (

                <div className="absolute -top-5 left-1/2 -translate-x-1/2">

                  <span className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2 text-xs font-bold tracking-wider text-white shadow-lg">
                    ⭐ MOST POPULAR
                  </span>

                </div>

              )}

              <h3 className="text-3xl font-bold text-gray-900">
                {plan.name}
              </h3>

              <div className="mt-8 flex items-end">

                <span className="text-6xl font-black text-purple-600">
                  {plan.price}
                </span>

                <span className="ml-2 mb-2 text-lg text-gray-400">
                  /month
                </span>

              </div>

              <ul className="mt-10 space-y-5">

                {plan.features.map((feature) => (

                  <li
                    key={feature}
                    className="flex items-center gap-3 text-gray-700"
                  >

                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-green-600 font-bold">
                      ✓
                    </span>

                    {feature}

                  </li>

                ))}

              </ul>

              <button
                onClick={async () => {
                  try {
                    const res = await fetch("/api/stripe/checkout", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        plan: plan.name,
                      }),
                    });

                    const data = await res.json();

                    if (!res.ok) {
                      alert(data.error || "Checkout failed");
                      return;
                    }

                    window.location.href = data.url;

                  } catch (error: any) {

                    console.error(error);

                    if (error instanceof Error) {
                      alert(error.message);
                    } else {
                      alert("Unknown error");
                    }

                  }
                }}
                className={`mt-10 w-full rounded-2xl py-4 font-bold text-lg transition-all duration-300 ${
                  plan.popular
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-xl hover:scale-105"
                    : "bg-gray-900 text-white hover:bg-black"
                }`}
              >
                Get Started →
              </button>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}