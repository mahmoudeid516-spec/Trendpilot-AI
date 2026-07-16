export default function Hero() {
  return (
    <section className="relative pt-20 pb-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block py-1 px-3 mb-6 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-full">
            🚀 Powered by Advanced AI
          </span>
          <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-8 tracking-tight">
            Discover Winning Products <span className="text-indigo-600">Before They Go Viral</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            Leverage real-time e-commerce intelligence to spot trends, analyze profit margins, and scale your business with data-driven insights.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="/signup" 
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 transition-all text-lg"
            >
              Start Free Trial
            </a>
            <a 
              href="#pricing" 
              className="px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-2xl border border-gray-200 transition-all text-lg"
            >
              View Pricing
            </a>
          </div>
        </div>
      </div>
      
      {/* Aesthetic Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse animation-delay-2000"></div>
      </div>
    </section>
  );
}