export default function Footer() {
  return (
    <footer className="bg-[#09090B] text-white border-t border-gray-800">

      <div className="max-w-7xl mx-auto px-8 py-20">

        <div className="grid lg:grid-cols-5 gap-12">

          {/* Logo */}

          <div className="lg:col-span-2">

            <h2 className="text-4xl font-extrabold text-purple-500">
              TrendPilot AI
            </h2>

            <p className="mt-6 text-gray-400 leading-8 max-w-md">

              The AI Operating System for Ecommerce.

              Discover winning products, analyze trends,
              generate marketing campaigns and launch faster
              using artificial intelligence.

            </p>

            <div className="flex gap-4 mt-8">

              <a
                href="#"
                className="w-11 h-11 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center transition"
              >
                𝕏
              </a>

              <a
                href="#"
                className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition"
              >
                in
              </a>

              <a
                href="#"
                className="w-11 h-11 rounded-full bg-pink-600 hover:bg-pink-700 flex items-center justify-center transition"
              >
                IG
              </a>

              <a
                href="#"
                className="w-11 h-11 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition"
              >
                ▶
              </a>

            </div>

          </div>

          {/* Product */}

          <div>

            <h3 className="font-bold text-xl mb-6">
              Product
            </h3>

            <ul className="space-y-4 text-gray-400">

              <li>
                <a href="#">Features</a>
              </li>

              <li>
                <a href="#">Pricing</a>
              </li>

              <li>
                <a href="#">Dashboard</a>
              </li>

              <li>
                <a href="#">API</a>
              </li>

            </ul>

          </div>

          {/* Company */}

          <div>

            <h3 className="font-bold text-xl mb-6">
              Company
            </h3>

            <ul className="space-y-4 text-gray-400">

              <li>
                <a href="#">About</a>
              </li>

              <li>
                <a href="#">Blog</a>
              </li>

              <li>
                <a href="#">Careers</a>
              </li>

              <li>
                <a href="#">Contact</a>
              </li>

            </ul>

          </div>

          {/* Newsletter */}

          <div>

            <h3 className="font-bold text-xl mb-6">
              Stay Updated
            </h3>

            <p className="text-gray-400 mb-5">

              Join our newsletter and receive AI ecommerce
              tips every week.

            </p>

            <input
              type="email"
              placeholder="Email address"
              className="w-full rounded-xl bg-gray-900 border border-gray-700 px-4 py-3 outline-none focus:border-purple-500"
            />

            <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 transition rounded-xl py-3 font-bold">

              Subscribe

            </button>

          </div>

        </div>

        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">

          <p className="text-gray-500">

            © 2026 TrendPilot AI. All rights reserved.

          </p>

          <div className="flex gap-6 mt-6 md:mt-0 text-gray-500">

            <a href="#">
              Privacy Policy
            </a>

            <a href="#">
              Terms of Service
            </a>

            <a href="#">
              Cookies
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
}