export default function Stats() {
    const stats = [
      {
        number: "1.2M+",
        title: "Products Analyzed",
      },
      {
        number: "25K+",
        title: "Active Users",
      },
      {
        number: "97%",
        title: "Prediction Accuracy",
      },
      {
        number: "150+",
        title: "Countries",
      },
    ];
  
    return (
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl shadow-lg p-8 text-center hover:shadow-2xl transition"
              >
                <h2 className="text-5xl font-bold text-purple-600">
                  {stat.number}
                </h2>
  
                <p className="mt-4 text-gray-500">
                  {stat.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }