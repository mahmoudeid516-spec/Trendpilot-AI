"use client";

type SearchBarProps = {
  search: string;
  setSearch: (value: string) => void;
  platform: string;
  setPlatform: (value: string) => void;
  onSearch: (search: string, platform: string) => void;
};

export default function SearchBar({
  search,
  setSearch,
  platform,
  setPlatform,
  onSearch,
}: SearchBarProps) {
  const popularSearches = [
    "Smart Camera",
    "Pet Toys",
    "Camping Gear",
    "Kitchen Gadgets",
    "Baby Products",
  ];

  return (
    <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">

      <div className="flex flex-col gap-4 md:flex-row">

        <input
          type="text"
          placeholder="🔍 Search AI winning products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-xl border px-5 py-3 outline-none transition focus:ring-2 focus:ring-purple-500"
        />

        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="rounded-xl border px-4 py-3"
        >
          <option value="All">All Platforms</option>
          <option value="Shopify">Shopify</option>
          <option value="Amazon">Amazon</option>
          <option value="TikTok Shop">TikTok Shop</option>
          <option value="AliExpress">AliExpress</option>
        </select>

        <button
          onClick={() => onSearch(search, platform)}
          className="rounded-xl bg-purple-600 px-8 py-3 font-semibold text-white transition hover:bg-purple-700"
        >
          🔥 Find Winning Products
        </button>

      </div>

      <div className="mt-6 border-t pt-5">

        <p className="mb-3 text-sm font-semibold text-gray-500">
          🔥 Popular Searches
        </p>

        <div className="flex flex-wrap gap-3">

          {popularSearches.map((item) => (
            <button
              key={item}
              onClick={() => {
                setSearch(item);
                onSearch(item, platform);
              }}
              className="rounded-full bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 transition hover:bg-purple-600 hover:text-white"
            >
              {item}
            </button>
          ))}

        </div>

      </div>

    </div>
  );
}