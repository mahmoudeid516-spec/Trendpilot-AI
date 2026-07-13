"use client";

type Props = {
  platform: string;
  competition: string;
  minScore: number;

  onPlatformChange: (value: string) => void;
  onCompetitionChange: (value: string) => void;
  onMinScoreChange: (value: number) => void;
};

export default function Filters({
  platform,
  competition,
  minScore,
  onPlatformChange,
  onCompetitionChange,
  onMinScoreChange,
}: Props) {
  return (
    <div className="grid md:grid-cols-3 gap-4 mb-8">

      <select
        value={platform}
        onChange={(e) =>
          onPlatformChange(e.target.value)
        }
        className="border rounded-xl p-3"
      >
        <option value="">All Platforms</option>
        <option>AliExpress</option>
        <option>Amazon</option>
        <option>Shopify</option>
        <option>TikTok Shop</option>
      </select>

      <select
        value={competition}
        onChange={(e) =>
          onCompetitionChange(e.target.value)
        }
        className="border rounded-xl p-3"
      >
        <option value="">All Competition</option>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <select
        value={minScore}
        onChange={(e) =>
          onMinScoreChange(Number(e.target.value))
        }
        className="border rounded-xl p-3"
      >
        <option value={0}>All AI Scores</option>
        <option value={70}>70+</option>
        <option value={80}>80+</option>
        <option value={90}>90+</option>
        <option value={95}>95+</option>
      </select>

    </div>
  );
}