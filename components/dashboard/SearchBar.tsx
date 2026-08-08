"use client";

type SearchBarProps = {
  search: string;
  setSearch: (value: string) => void;
  platform: string;
  setPlatform: (value: string) => void;
  onSearch: (search: string, platform: string) => void;
  isSearching?: boolean;
};

export default function SearchBar({
  search,
  setSearch,
  platform,
  setPlatform,
  onSearch,
  isSearching = false,
}: SearchBarProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-4">

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={isSearching}
          className="flex-1 border rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
        />

        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          disabled={isSearching}
          className="border rounded-xl px-4 py-3 disabled:bg-gray-100"
        >
          <option value="All">All Platforms</option>
          <option value="Amazon">Amazon</option>
          <option value="AliExpress">AliExpress</option>
        </select>

        <button
  onClick={() => onSearch(search, platform)}
  disabled={isSearching}
  className="bg-purple-600 text-white px-8 py-3 rounded-xl hover:bg-purple-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
>
  {isSearching ? "Searching..." : "🔥 Find Winning Products"}
</button>

      </div>
    </div>
  );
}