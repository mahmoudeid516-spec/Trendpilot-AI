export default function Sidebar() {
    const menu = [
      "Dashboard",
      "Products",
      "AI Search",
      "Analytics",
      "Saved",
      "Settings",
    ];
  
    return (
      <aside className="w-64 min-h-screen bg-white shadow-xl border-r p-6">
  
        <h1 className="text-3xl font-bold text-purple-600 mb-10">
          TrendPilot AI
        </h1>
  
        <nav className="space-y-3">
          {menu.map((item, index) => (
            <button
              key={index}
              className={`w-full text-left px-4 py-3 rounded-xl transition ${
                index === 0
                  ? "bg-purple-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
  
      </aside>
    );
  }