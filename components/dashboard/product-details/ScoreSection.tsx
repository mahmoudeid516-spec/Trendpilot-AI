"use client";

type Props = {
  aiScore: number;
  profit: number;
  winning: number;
  demand: string;
  risk: string;
};

function ScoreBar({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex justify-between mb-2">
        <span className="font-medium">{title}</span>
        <span className="font-bold">{value}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`${color} h-3 rounded-full transition-all duration-700`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function ScoreSection({
  aiScore,
  profit,
  winning,
  demand,
  risk,
}: Props) {
  return (
    <div>
      <ScoreBar
        title={`Demand (${demand})`}
        value={Math.min(100, aiScore)}
        color="bg-pink-500"
      />

      <ScoreBar
        title="Profit Score"
        value={profit}
        color="bg-green-500"
      />

      <ScoreBar
        title={`Risk (${risk})`}
        value={
          risk === "Low"
            ? 20
            : risk === "Medium"
            ? 55
            : 90
        }
        color="bg-red-500"
      />

      <ScoreBar
        title="Winning Probability"
        value={winning}
        color="bg-purple-600"
      />
    </div>
  );
}