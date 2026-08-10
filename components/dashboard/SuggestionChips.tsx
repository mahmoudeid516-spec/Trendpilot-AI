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
    <div className="flex flex-wrap gap-2">
      {suggestions.map((item) => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className="rounded-full border border-[var(--accent-ai)]/20 bg-[var(--accent-ai-soft)] px-3.5 py-1.5 text-xs font-medium text-[var(--accent-ai)] transition-colors hover:bg-[var(--accent-ai)] hover:text-white"
        >
          {item}
        </button>
      ))}
    </div>
  );
}
