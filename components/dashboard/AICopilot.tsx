"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Send, 
  Bot, 
  Sparkles, 
  Loader2,
  Copy,
  Check,
  RotateCcw
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

import type { Product } from "../../types/Product";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type Props = {
  product: Product;
};

const SUGGESTIONS = [
  "Is this product worth selling?",
  "Which country should I target?",
  "Estimate my ROI.",
  "Create a TikTok strategy.",
];

export default function AICopilot({ product }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text, product }),
      });

      if (!res.ok) throw new Error("API request failed");

      const data = await res.json();
      
      const aiMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        role: "assistant", 
        content: data.answer || "No response received." 
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [
        ...prev, 
        { 
          id: Date.now().toString(), 
          role: "assistant", 
          content: "❌ Something went wrong while analyzing the product. Please try again." 
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [product, loading]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex h-[700px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
            <Bot size={22} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              TrendPilot Copilot
            </h2>
            <p className="text-xs text-slate-500 truncate max-w-[250px] sm:max-w-xs">
              Analyzing: <span className="font-semibold text-slate-700">{product.name}</span>
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
          >
            <RotateCcw size={14} />
            Reset Chat
          </button>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 scroll-smooth bg-slate-50/30" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-6 text-center px-4">
            <div className="rounded-2xl bg-indigo-50 p-5 text-indigo-600 shadow-inner">
              <Sparkles className="h-10 w-10" />
            </div>
            <div className="max-w-sm space-y-2">
              <h3 className="text-xl font-bold text-slate-900">How can I assist your strategy?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ask anything about competitor pricing, target audience, marketing scripts, or ROI estimates.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-md mt-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-xs font-semibold text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600 transition shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                    <Bot size={16} />
                  </div>
                )}

                <div className={`group relative max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed shadow-sm ${
                  msg.role === "user" 
                    ? "bg-indigo-600 text-white rounded-br-xs font-medium" 
                    : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs"
                }`}>
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={vscDarkPlus as any}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-lg my-2 text-[11px] !bg-slate-900"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className="bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded text-[11px] font-mono" {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>

                  {msg.role === "assistant" && (
                    <button 
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600 transition p-1 bg-white/80 rounded-md"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}

            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
                  <Bot size={16} />
                </div>
                <div className="rounded-2xl rounded-bl-xs bg-white border border-slate-200 p-4 shadow-sm flex items-center gap-2 text-xs font-medium text-slate-500">
                  <Loader2 className="animate-spin text-indigo-600" size={16} />
                  <span>Analyzing market metrics...</span>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-100 p-4 bg-white">
        <div className="relative flex items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
            placeholder={`Ask Copilot about ${product.name}...`}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-3.5 pl-4 pr-12 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="absolute right-2 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-sm"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}