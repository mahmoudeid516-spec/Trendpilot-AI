export default function Footer() {
    return (
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center">
  
          <div>
            <h2 className="text-3xl font-bold text-purple-500">
              TrendPilot AI
            </h2>
  
            <p className="mt-3 text-gray-400">
              AI Product Research Platform
            </p>
          </div>
  
          <div className="flex gap-8 mt-8 md:mt-0">
            <a href="#">Features</a>
            <a href="#">Pricing</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
          </div>
  
        </div>
      </footer>
    );
  }