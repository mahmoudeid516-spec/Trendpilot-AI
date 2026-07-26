type Props = {
  onSelect: (value: string) => void;
};

const suggestions = [
  "Find winning Shopify products",
  "Products with AI score above 90",
  "Low competition gadgets",
  "Trending TikTok products",
  "High profit beauty products",
  "Best Amazon opportunities",
];

export default function SuggestionChips({ onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      {suggestions.map((item) => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className="rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          {item}
        </button>
      ))}
    </div>
  );
}