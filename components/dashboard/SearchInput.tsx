import { Sparkles } from "lucide-react";
import { buttonClass } from "../ui/button";

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
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">

      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !loading) onSearch();
        }}
        placeholder="Ask about a market, niche, or opportunity..."
        className="min-w-0 flex-1 rounded-xl border border-[var(--border-subtle)] bg-white px-5 py-3.5 text-[var(--ink-900)] outline-none tp-focus-ring placeholder:text-[var(--ink-400)]"
      />

      <button
        onClick={onSearch}
        disabled={loading}
        className={buttonClass({ tone: "ai", size: "md", className: "whitespace-nowrap px-6 py-3.5" })}
      >
        <Sparkles size={16} />
        {loading ? "Thinking..." : "Ask TrendPilot AI"}
      </button>

    </div>
  );
}
