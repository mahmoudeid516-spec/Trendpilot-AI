"use client";

type FiltersProps = {
  platform: string;
  setPlatform: (value: string) => void;
};

export default function Filters({
  platform,
  setPlatform,
}: FiltersProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

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

        <select className="border rounded-xl px-4 py-3">
          <option>Category</option>
          <option>Beauty</option>
          <option>Fitness</option>
          <option>Pets</option>
          <option>Home</option>
        </select>

        <select className="border rounded-xl px-4 py-3">
          <option>Competition</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <select className="border rounded-xl px-4 py-3">
          <option>Country</option>
          <option>United States</option>
          <option>United Kingdom</option>
          <option>Germany</option>
          <option>France</option>
        </select>

      </div>
    </div>
  );
}