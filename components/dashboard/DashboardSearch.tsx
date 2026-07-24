"use client";

type Props = {
  search: string;
  setSearch: (value: string) => void;
  platform: string;
  setPlatform: (value: string) => void;
  onSearch: (search: string, platform: string) => void;
};

const popularSearches = [
  "Smart Camera",
  "Pet Toys",
  "Camping Gear",
  "Kitchen Gadgets",
  "Baby Products",
  "Car Accessories",
];

export default function DashboardSearch({
  search,
  setSearch,
  platform,
  setPlatform,
  onSearch,
}: Props) {
  return (
    <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          🔍 AI Product Search
        </h2>

        <p className="mt-2 text-slate-500">
          Search millions of products and let AI discover the best opportunities.
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search winning products..."
          className="flex-1 rounded-2xl border border-slate-300 px-5 py-4 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
        />

        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="rounded-2xl border border-slate-300 px-5 py-4"
        >
          <option value="All">All Platforms</option>
          <option value="Shopify">Shopify</option>
          <option value="Amazon">Amazon</option>
          <option value="TikTok Shop">TikTok Shop</option>
          <option value="AliExpress">AliExpress</option>
        </select>

        <button
          onClick={() => onSearch(search, platform)}
          className="rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 font-semibold text-white transition hover:scale-105"
        >
          🔥 Find Products
        </button>

      </div>

      <div className="mt-8">

        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
          Popular Searches
        </p>

        <div className="flex flex-wrap gap-3">

          {popularSearches.map((item) => (
            <button
              key={item}
              onClick={() => {
                setSearch(item);
                onSearch(item, platform);
              }}
              className="rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 transition hover:bg-purple-600 hover:text-white"
            >
              {item}
            </button>
          ))}

        </div>

      </div>

    </div>
  );
}