"use client";

import { useState } from "react";

export default function WeeklyBrief() {
  const [brief, setBrief] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch("/api/brief");
      const d = await r.json();
      if (d.ok) setBrief(d.brief);
      else setErr(d.error ?? "Failed");
    } catch (e) {
      setErr(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 rounded-2xl bg-white/5 border border-white/10 p-6">
      {!brief && (
        <button
          onClick={generate}
          disabled={loading}
          className="px-5 py-3 rounded-xl bg-white text-black font-bold disabled:opacity-60"
        >
          {loading ? "Drafting Monday brief…" : "Generate Monday brief"}
        </button>
      )}
      {err && <p className="mt-3 text-red-400 text-sm">Error: {err}</p>}
      {brief && (
        <pre className="whitespace-pre-wrap font-mono text-sm text-white/90 leading-relaxed">
          {brief}
        </pre>
      )}
    </div>
  );
}
