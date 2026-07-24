"use client";

import { useState } from "react";
import type { Product } from "../../types/Product";

type Props = {
  product: Product;
};

const suggestions = [
  "Should I sell this product?",
  "Generate Facebook Ads",
  "Generate TikTok Ads",
  "Write Product Description",
  "Best Selling Price",
  "Best Countries",
];

export default function AIMarketing({ product }: Props) {
  console.log("PRODUCT RECEIVED:", product);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([
    {
      role: "assistant",
      text:
        "👋 Hi! I'm TrendPilot AI Copilot.\n\nAsk me anything about this product.",
    },
  ]);

  const [question, setQuestion] = useState("");

  async function sendQuestion(text: string) {
    if (!text.trim()) return;
  
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text,
      },
    ]);
  
    setQuestion("");
  
    try {

      console.log("SENDING PRODUCT:", product);

console.log(
  JSON.stringify(
    {
      question: text,
      product,
    },
    null,
    2
  )
);
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: text,
          product,
        }),
      });
      console.log(product);
      const data = await res.json();
  
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.answer,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Something went wrong.",
        },
      ]);
    }
  }

  return (
    <section className="mt-16 rounded-3xl border bg-white shadow-xl p-8">

      <h2 className="text-3xl font-bold">
        🤖 TrendPilot AI Copilot
      </h2>

      <p className="mt-2 text-gray-500">
        Ask AI anything about this product.
      </p>

      <div className="mt-8 h-[420px] overflow-y-auto rounded-2xl bg-gray-50 p-6 space-y-5">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-5 py-4 whitespace-pre-wrap ${
                msg.role === "assistant"
                  ? "bg-purple-600 text-white"
                  : "bg-white border"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

      </div>

      <div className="mt-6 flex flex-wrap gap-3">

        {suggestions.map((item) => (
          <button
            key={item}
            onClick={() => sendQuestion(item)}
            className="rounded-full border px-4 py-2 text-sm hover:bg-purple-50 transition"
          >
            {item}
          </button>
        ))}

      </div>

      <div className="mt-8 flex gap-4">

        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask TrendPilot AI..."
          className="flex-1 rounded-xl border px-5 py-4 outline-none focus:border-purple-500"
        />

        <button
          onClick={() => sendQuestion(question)}
          className="rounded-xl bg-purple-600 px-8 text-white font-bold hover:bg-purple-700 transition"
        >
          Send
        </button>

      </div>

      <div className="mt-8 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">

        <h3 className="font-bold text-xl">
          Current Product
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">

          <div>
            <p className="text-purple-100 text-sm">
              AI Score
            </p>
            <h4 className="text-2xl font-bold">
              {product.ai_score}%
            </h4>
          </div>

          <div>
            <p className="text-purple-100 text-sm">
              Profit
            </p>
            <h4 className="text-2xl font-bold">
              ${product.profit}
            </h4>
          </div>

          <div>
            <p className="text-purple-100 text-sm">
              Platform
            </p>
            <h4 className="text-xl font-bold">
              {product.platform}
            </h4>
          </div>

          <div>
            <p className="text-purple-100 text-sm">
              Trend
            </p>
            <h4 className="text-2xl font-bold">
              {product.trend_score}%
            </h4>
          </div>

        </div>

      </div>

    </section>
  );
}