"use client";

type FiltersProps = {
  platform: string;
  platforms: string[];
  onPlatformChange: (value: string) => void;

  competition: string;
  onCompetitionChange: (value: string) => void;

  category: string;
  categories: string[];
  onCategoryChange: (value: string) => void;

  country: string;
  countries: string[];
  onCountryChange: (value: string) => void;

  minScore: number;
  onMinScoreChange: (value: number) => void;
};

// Every option here is either a real value pulled from the user's own
// products (platform/category/country) or a value from the fixed
// competition enum stored on every product row -- never an invented
// taxonomy. Options only render when there's real data behind them.
export default function Filters({
  platform,
  platforms,
  onPlatformChange,
  competition,
  onCompetitionChange,
  category,
  categories,
  onCategoryChange,
  country,
  countries,
  onCountryChange,
  minScore,
  onMinScoreChange,
}: FiltersProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

        <select
          value={platform}
          onChange={(e) => onPlatformChange(e.target.value)}
          className="border rounded-xl px-4 py-3"
        >
          <option value="">All Platforms</option>
          {platforms.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>

        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="border rounded-xl px-4 py-3"
        >
          <option value="">All Categories</option>
          {categories.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>

        <select
          value={competition}
          onChange={(e) => onCompetitionChange(e.target.value)}
          className="border rounded-xl px-4 py-3"
        >
          <option value="">Any Competition</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          className="border rounded-xl px-4 py-3"
        >
          <option value="">All Countries</option>
          {countries.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>

        <label className="flex flex-col justify-center border rounded-xl px-4 py-2 text-sm text-gray-600">
          Min AI Score (Est.): {minScore}
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={minScore}
            onChange={(e) => onMinScoreChange(Number(e.target.value))}
            className="mt-1"
          />
        </label>

      </div>
    </div>
  );
}
