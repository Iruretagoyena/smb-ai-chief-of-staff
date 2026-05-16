"use client";

import { useState } from "react";

type Msg = { role: "user" | "assistant"; text: string };

const SUGGESTIONS = [
  "What should I do first today?",
  "Who owes me money?",
  "Should I switch tortilla suppliers?",
  "Draft a reply to the 2-star review",
];

export default function CosChat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);

  async function send(text: string) {
    if (!text.trim() || pending) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setPending(true);
    try {
      const r = await fetch("/api/cos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const d = await r.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", text: d.ok ? d.answer : `Error: ${d.error}` },
      ]);
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", text: `Error: ${String(e)}` }]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-xs px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-2 max-h-72 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg text-sm ${
              m.role === "user"
                ? "bg-brand-500/10 border border-brand-500/20 text-white/90"
                : "bg-white/5 border border-white/10 text-white/90"
            }`}
          >
            <div className="text-xs text-white/40 mb-1">
              {m.role === "user" ? "Maria" : "Pop"}
            </div>
            <div className="whitespace-pre-wrap">{m.text}</div>
          </div>
        ))}
        {pending && (
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white/40 animate-pulse">
            Pop is thinking…
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Pop anything…"
          className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:border-brand-500 text-sm"
        />
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 rounded-lg bg-brand-500 text-black font-bold text-sm disabled:opacity-60"
        >
          Ask
        </button>
      </form>
    </div>
  );
}
