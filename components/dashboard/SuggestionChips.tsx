type Props = {
  onSelect: (value: string) => void;
};

const suggestions = [
  "What products are trending in the fitness market?",
  "Is smart watch a good niche to enter?",
  "What product categories have low competition?",
  "Analyze the opportunity for smart watches.",
];

export default function SuggestionChips({ onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      {suggestions.map((item) => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className="rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-600 hover:text-white transition"
        >
          {item}
        </button>
      ))}
    </div>
  );
}