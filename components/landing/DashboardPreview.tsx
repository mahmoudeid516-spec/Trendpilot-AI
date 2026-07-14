export default function DashboardPreview() {
    return (
      <div className="rounded-[36px] bg-white p-8 shadow-[0_30px_80px_rgba(124,58,237,.18)] border border-gray-200">
  
        <div className="flex items-center justify-between mb-8">
  
          <div>
            <p className="text-gray-400 text-sm">AI SCORE</p>
            <h2 className="text-5xl font-bold text-purple-600">
              96%
            </h2>
          </div>
  
          <span className="rounded-full bg-green-100 px-4 py-2 text-green-700 font-bold">
            Strong Buy
          </span>
  
        </div>
  
        <div className="grid grid-cols-2 gap-5 mb-8">
  
          <div className="rounded-2xl bg-purple-50 p-5">
            <p className="text-gray-500">Opportunity</p>
            <h3 className="text-3xl font-bold">91%</h3>
          </div>
  
          <div className="rounded-2xl bg-green-50 p-5">
            <p className="text-gray-500">Profit</p>
            <h3 className="text-3xl font-bold">$42</h3>
          </div>
  
        </div>
  
        <div className="rounded-2xl bg-gray-50 p-6">
  
          <p className="text-gray-500 mb-3">
            Winning Product
          </p>
  
          <h3 className="text-2xl font-bold">
            Smart Watch Pro
          </h3>
  
          <div className="mt-5 h-3 rounded-full bg-gray-200">
  
            <div className="h-3 w-[91%] rounded-full bg-purple-600"></div>
  
          </div>
  
        </div>
  
      </div>
    );
  }