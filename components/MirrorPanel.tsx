"use client";

import { useEffect, useState } from "react";
import reviewsData from "@/data/reviews.json";

type MirrorResponse = {
  ok: boolean;
  competitor?: { name: string; tagline: string; stats: Record<string, string | number> };
  output?: {
    review_replies: { review_id: string; reply: string }[];
    instagram_posts: { day: string; caption: string; hashtags: string[] }[];
    invoice_chasers: { client: string; message: string }[];
    weekly_summary: string;
  };
  error?: string;
};

const reviewsById = Object.fromEntries(reviewsData.reviews.map((r) => [r.id, r]));

export default function MirrorPanel() {
  const [data, setData] = useState<MirrorResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/mirror", { method: "POST" })
      .then((r) => r.json())
      .then((d) => (d.ok ? setData(d) : setErr(d.error ?? "Mirror failed")))
      .catch((e) => setErr(String(e)));
  }, []);

  if (err) return <p className="text-red-400 mt-8">Error: {err}</p>;
  if (!data || !data.output) {
    return (
      <div className="mt-12 p-8 rounded-2xl bg-white/5 border border-white/10 animate-pulse">
        <div className="text-white/50">Spinning up TacoBot Cantina…</div>
        <div className="mt-3 text-sm text-white/30">
          Replying to reviews · Drafting posts · Chasing invoices ·
        </div>
      </div>
    );
  }

  const o = data.output;
  const c = data.competitor;

  const scoreboard = [
    { metric: "Review response rate", lupita: "0%", bot: "100%" },
    { metric: "Avg response time", lupita: "—", bot: "7 min" },
    { metric: "Instagram posts this week", lupita: "0", bot: "3" },
    { metric: "Overdue invoices chased", lupita: "0 of 2", bot: "2 of 2" },
    { metric: "Hours owner spent on this", lupita: "0", bot: "0" },
  ];

  return (
    <section className="mt-16 space-y-12">
      <div className="rounded-2xl bg-gradient-to-br from-red-950/80 to-black border border-red-900/40 p-8">
        <p className="uppercase tracking-[0.2em] text-xs text-red-400 font-bold mb-3">
          The new competitor
        </p>
        <h2 className="font-display font-black text-4xl md:text-5xl tracking-tight">
          {c?.name}
        </h2>
        <p className="text-white/60 mt-1">{c?.tagline}</p>

        <div className="mt-8 rounded-xl bg-black/40 overflow-hidden border border-white/10">
          <div className="grid grid-cols-3 text-xs uppercase tracking-wider text-white/40 px-4 py-3 border-b border-white/10">
            <div></div>
            <div>Lupita&apos;s</div>
            <div className="text-red-400">TacoBot</div>
          </div>
          {scoreboard.map((row) => (
            <div key={row.metric} className="grid grid-cols-3 px-4 py-3 border-b border-white/5 last:border-0">
              <div className="text-sm text-white/70">{row.metric}</div>
              <div className="font-mono font-bold text-white/80">{row.lupita}</div>
              <div className="font-mono font-bold text-red-400">{row.bot}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display font-black text-2xl mb-4">📬 Replied to every review</h3>
        <div className="grid gap-3">
          {o.review_replies.map((r) => {
            const orig = reviewsById[r.review_id];
            return (
              <div key={r.review_id} className="rounded-xl bg-white/5 border border-white/10 p-4">
                {orig && (
                  <div className="text-xs text-white/40 mb-2">
                    {orig.source} · {orig.author}
                    {orig.rating ? ` · ${"⭐".repeat(orig.rating)}` : ""} ·{" "}
                    <span className="italic">&quot;{orig.text}&quot;</span>
                  </div>
                )}
                <div className="text-white/90">{r.reply}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="font-display font-black text-2xl mb-4">📸 Posted 3 times this week</h3>
        <div className="grid md:grid-cols-3 gap-3">
          {o.instagram_posts.map((p, i) => (
            <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-4">
              <div className="text-xs text-brand-500 font-bold mb-2">{p.day}</div>
              <div className="text-white/90 whitespace-pre-wrap">{p.caption}</div>
              {p.hashtags?.length > 0 && (
                <div className="text-xs text-white/50 mt-2">{p.hashtags.join(" ")}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display font-black text-2xl mb-4">💸 Chased every overdue invoice</h3>
        <div className="grid gap-3">
          {o.invoice_chasers.map((c, i) => (
            <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-4">
              <div className="text-xs text-white/40 mb-2">To: {c.client}</div>
              <div className="text-white/90 whitespace-pre-wrap">{c.message}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-brand-500/10 border border-brand-500/30 p-6">
        <p className="text-brand-500 font-bold uppercase tracking-wider text-xs mb-2">
          Weekly summary
        </p>
        <p className="text-xl text-white/90">{o.weekly_summary}</p>
      </div>
    </section>
  );
}
