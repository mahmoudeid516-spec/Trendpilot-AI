"use client";

import { useState } from "react";

export default function AICopilot() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function askAI() {
    if (!question.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
        }),
      });

      const data = await res.json();

      setAnswer(data.answer);
    } catch {
      setAnswer("Something went wrong.");
    }

    setLoading(false);
  }

  return (
    <div className="mt-10 rounded-3xl bg-white p-8 shadow-xl">

      <h2 className="text-3xl font-bold mb-6">
        🤖 TrendPilot AI Copilot
      </h2>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask anything..."
        className="w-full rounded-xl border p-4 h-36"
      />

      <button
        onClick={askAI}
        disabled={loading}
        className="mt-5 rounded-xl bg-purple-600 px-6 py-3 text-white hover:bg-purple-700"
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {answer && (
        <div className="mt-8 rounded-2xl bg-gray-50 p-6">
          <h3 className="font-bold mb-3">Answer</h3>
          <p className="whitespace-pre-wrap">{answer}</p>
        </div>
      )}
    </div>
  );
}