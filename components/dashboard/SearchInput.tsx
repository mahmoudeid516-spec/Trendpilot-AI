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
    <div className="flex gap-4 mt-8">

      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Find products under $20..."
        className="flex-1 border rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-purple-600"
      />

      <button
        onClick={onSearch}
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-8 rounded-xl transition"
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

    </div>
  );
}