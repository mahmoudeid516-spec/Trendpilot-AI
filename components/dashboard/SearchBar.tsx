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
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-4">

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-purple-500"
        />

        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="border rounded-xl px-4 py-3"
        >
          <option value="All">All Platforms</option>
          <option value="Shopify">Shopify</option>
          <option value="Amazon">Amazon</option>
          <option value="TikTok Shop">TikTok Shop</option>
          <option value="AliExpress">AliExpress</option>
        </select>

        <button
  onClick={() => onSearch(search, platform)}
  className="bg-purple-600 text-white px-8 py-3 rounded-xl hover:bg-purple-700 transition"
>
  🔥 Find Winning Products
</button>

      </div>
    </div>
  );
}