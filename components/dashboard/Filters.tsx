"use client";

type FiltersProps = {
  platform: string;
  setPlatform: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  competition: string;
  setCompetition: (value: string) => void;
  minScore: number;
  setMinScore: (value: number) => void;
  categoryOptions: string[];
};

export default function Filters({
  platform,
  setPlatform,
  category,
  setCategory,
  competition,
  setCompetition,
  minScore,
  setMinScore,
  categoryOptions,
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
          <option value="AliExpress">AliExpress</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-xl px-4 py-3"
        >
          <option value="All">All Categories</option>
          {categoryOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select
          value={competition}
          onChange={(e) => setCompetition(e.target.value)}
          className="border rounded-xl px-4 py-3"
        >
          <option value="All">All Competition</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select
          value={minScore}
          onChange={(e) => setMinScore(Number(e.target.value))}
          className="border rounded-xl px-4 py-3"
        >
          <option value={0}>All AI Scores</option>
          <option value={70}>70+</option>
          <option value={80}>80+</option>
          <option value={90}>90+</option>
          <option value={95}>95+</option>
        </select>

      </div>
    </div>
  );
}
