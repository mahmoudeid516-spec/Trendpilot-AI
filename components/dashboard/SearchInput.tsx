type Props = {
  prompt: string;
  loading: boolean;
  setPrompt: (value: string) => void;
  onSearch: () => void;
};

export default function SearchInput({
  prompt,
  loading,
  setPrompt,
  onSearch,
}: Props) {
  return (
    <div className="mt-8 flex flex-col gap-4 sm:flex-row">

      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask about a market, niche, or opportunity..."
        className="min-w-0 flex-1 rounded-xl border px-5 py-4 outline-none focus:ring-2 focus:ring-purple-600"
      />

      <button
        onClick={onSearch}
        disabled={loading}
        className="whitespace-nowrap rounded-xl bg-purple-600 px-8 py-4 text-white transition hover:bg-purple-700 disabled:bg-gray-400"
      >
        {loading ? "Thinking..." : "Ask TrendPilot AI"}
      </button>

    </div>
  );
}