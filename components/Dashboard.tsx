"use client";

export default function Dashboard() {
  return (
    <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl border p-6">

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">TrendPilot AI</h3>

        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
          Live
        </span>
      </div>

      <div className="space-y-4">

        <div className="rounded-xl border p-4">
          <div className="flex justify-between">
            <span>Wireless Car Charger</span>
            <span className="font-bold text-green-600">98%</span>
          </div>

          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full w-[98%] bg-green-500 rounded-full"></div>
          </div>
        </div>

        <div className="rounded-xl border p-4">
          <div className="flex justify-between">
            <span>Pet Hair Remover</span>
            <span className="font-bold text-blue-600">94%</span>
          </div>

          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full w-[94%] bg-blue-500 rounded-full"></div>
          </div>
        </div>

        <div className="rounded-xl border p-4">
          <div className="flex justify-between">
            <span>Smart Watch</span>
            <span className="font-bold text-purple-600">92%</span>
          </div>

          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full w-[92%] bg-purple-500 rounded-full"></div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-3 gap-4 mt-8">

        <div className="rounded-xl bg-gray-100 p-4 text-center">
          <div className="text-2xl font-bold">12K+</div>
          <div className="text-gray-500 text-sm">Products</div>
        </div>

        <div className="rounded-xl bg-gray-100 p-4 text-center">
          <div className="text-2xl font-bold">98%</div>
          <div className="text-gray-500 text-sm">Accuracy</div>
        </div>

        <div className="rounded-xl bg-gray-100 p-4 text-center">
          <div className="text-2xl font-bold">24/7</div>
          <div className="text-gray-500 text-sm">AI</div>
        </div>

      </div>

    </div>
  );
}