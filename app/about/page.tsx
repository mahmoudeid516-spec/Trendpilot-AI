export default function AboutPage() {
    return (
      <main className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-12">
  
          <h1 className="text-5xl font-bold text-purple-700">
            About TrendPilot AI
          </h1>
  
          <p className="mt-8 text-lg text-gray-700 leading-8">
            TrendPilot AI is an AI-powered product research platform built to help
            ecommerce sellers discover winning products before they become
            saturated.
          </p>
  
          <p className="mt-6 text-lg text-gray-700 leading-8">
            Our platform combines artificial intelligence, market analysis,
            profitability calculations, marketing generation and business insights
            into one powerful dashboard.
          </p>
  
          <div className="mt-12 grid md:grid-cols-3 gap-6">
  
            <div className="bg-purple-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold">AI Research</h3>
              <p className="mt-3 text-gray-600">
                Discover high-potential products using AI.
              </p>
            </div>
  
            <div className="bg-purple-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold">Marketing</h3>
              <p className="mt-3 text-gray-600">
                Generate marketing campaigns in seconds.
              </p>
            </div>
  
            <div className="bg-purple-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold">Business Growth</h3>
              <p className="mt-3 text-gray-600">
                Make better ecommerce decisions with AI.
              </p>
            </div>
  
          </div>
  
        </div>
      </main>
    );
  }