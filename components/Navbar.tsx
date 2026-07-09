export default function Navbar() {
    return (
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-5">
          
          <h1 className="text-3xl font-extrabold tracking-tight">
            <span className="text-purple-600">Trend</span>
            <span className="text-black">Pilot</span>
            <span className="text-purple-600 ml-1">AI</span>
          </h1>
  
          <div className="hidden md:flex items-center gap-10 text-gray-600 font-medium">
            <a href="#" className="hover:text-purple-600 transition">
              Features
            </a>
  
            <a href="#" className="hover:text-purple-600 transition">
              Pricing
            </a>
  
            <a href="#" className="hover:text-purple-600 transition">
              Blog
            </a>
  
            <a href="#" className="hover:text-purple-600 transition">
              Login
            </a>
          </div>
  
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl shadow-lg transition">
            Start Free Trial
          </button>
  
        </div>
      </nav>
    );
  }