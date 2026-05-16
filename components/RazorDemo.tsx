"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Phase =
  | "threat"
  | "flip"
  | "relief"
  | "asking"
  | "answering"
  | "invoice"
  | "closer";

const GOLDEN_QUESTION = "Pop, what do I need to do today?";
const GOLDEN_ANSWER =
  "Three things, Maria. First: Jose needs your e-signature on the Q1 sales tax — link is at the top of your inbox. Second: the health inspector is here tomorrow at ten, I made a checklist. And by the way — I just sent the friendly nudge to the Mission Cultural Center. Eighteen hundred and fifty dollars. It will land Friday.";

function speak(text: string, opts: { rate?: number; onEnd?: () => void } = {}) {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    opts.onEnd?.();
    return;
  }
  const u = new SpeechSynthesisUtterance(text);
  u.rate = opts.rate ?? 1.0;
  u.pitch = 1.0;
  const voices = window.speechSynthesis.getVoices();
  const preferred =
    voices.find((v) => /Samantha|Joanna|Google US English/i.test(v.name)) ??
    voices[0];
  if (preferred) u.voice = preferred;
  if (opts.onEnd) u.onend = () => opts.onEnd?.();
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

export default function RazorDemo() {
  const [phase, setPhase] = useState<Phase>("threat");
  const [bot, setBot] = useState({
    reviews: 0,
    responseMin: 0,
    posts: 0,
    chased: 0,
  });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (phase !== "threat") return;
    let i = 0;
    timerRef.current = setInterval(() => {
      i += 1;
      setBot({
        reviews: Math.min(100, i * 8),
        responseMin: Math.max(7, 60 - i * 4),
        posts: Math.min(4, Math.floor(i / 3)),
        chased: Math.min(2270, i * 200),
      });
      if (i >= 14 && timerRef.current) clearInterval(timerRef.current);
    }, 90);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  const advance = useCallback(() => {
    setPhase((p) => {
      if (p === "threat") return "flip";
      if (p === "flip") return "relief";
      if (p === "relief") return "asking";
      if (p === "asking") return "answering";
      if (p === "answering") return "invoice";
      if (p === "invoice") return "closer";
      return p;
    });
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === " " || e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        advance();
      }
      if (e.key === "ArrowLeft") {
        setPhase((p) => {
          if (p === "closer") return "invoice";
          if (p === "invoice") return "answering";
          if (p === "answering") return "asking";
          if (p === "asking") return "relief";
          if (p === "relief") return "flip";
          if (p === "flip") return "threat";
          return p;
        });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance]);

  useEffect(() => {
    if (phase === "flip") {
      const t = setTimeout(() => setPhase("relief"), 1100);
      return () => clearTimeout(t);
    }
    if (phase === "asking") {
      speak(GOLDEN_QUESTION, {
        rate: 1.0,
        onEnd: () => setTimeout(() => setPhase("answering"), 350),
      });
    }
    if (phase === "answering") {
      speak(GOLDEN_ANSWER, {
        rate: 1.0,
        onEnd: () => setTimeout(() => setPhase("invoice"), 400),
      });
    }
    if (phase === "invoice") {
      const t = setTimeout(() => setPhase("closer"), 4500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const flipped = phase === "flip" || phase === "relief" || phase === "asking" || phase === "answering" || phase === "invoice" || phase === "closer";

  return (
    <div
      className="min-h-screen w-full overflow-hidden relative"
      style={{ perspective: "1800px" }}
      onClick={advance}
    >
      <div
        className="absolute inset-0 transition-transform duration-1000 ease-[cubic-bezier(0.65,0,0.35,1)]"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT — THREAT */}
        <div
          className="absolute inset-0 flex flex-col justify-between p-12 md:p-20 bg-gradient-to-br from-red-950 via-black to-black"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex items-center justify-between">
            <div className="uppercase tracking-[0.3em] text-xs text-red-400 font-bold">
              Mission District · Tuesday morning
            </div>
            <div className="text-xs text-white/30 font-mono">
              press space to continue →
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-5xl">
            <p className="uppercase tracking-[0.3em] text-xs text-red-400 font-bold mb-6">
              A new sign goes up next door
            </p>
            <h1 className="font-display font-black text-6xl md:text-8xl leading-[0.9] tracking-tight">
              An AI-native<br />taqueria<br />
              <span className="text-red-500">just opened.</span>
            </h1>
            <p className="mt-10 max-w-2xl text-white/70 text-xl leading-relaxed">
              Same neighborhood. Same menu. Different operations. It replies to
              every review in 7 minutes. Posts on Instagram 4 times a week.
              Chases every late invoice. <br />
              <span className="text-white font-semibold">It never sleeps.</span>
            </p>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl">
              <Stat label="Review responses" value={`${bot.reviews}%`} />
              <Stat label="Avg response" value={`${bot.responseMin} min`} />
              <Stat label="IG posts / week" value={`${bot.posts}`} />
              <Stat label="Receivables collected" value={`$${bot.chased.toLocaleString()}`} />
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-white/40">Lupita&apos;s Taqueria · this week</div>
              <div className="text-3xl md:text-5xl font-display font-black mt-2 text-white/70">
                0 replies · 0 posts · $0 chased
              </div>
            </div>
            <div className="text-xs text-white/30 hidden md:block">
              36.2M small businesses in the US. 8.8% use AI in production.
            </div>
          </div>
        </div>

        {/* BACK — RELIEF / CHIEF OF STAFF */}
        <div
          className="absolute inset-0 flex flex-col justify-between p-12 md:p-20 bg-gradient-to-br from-amber-950 via-black to-black"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center text-black font-black text-sm">
                P
              </div>
              <div className="uppercase tracking-[0.3em] text-xs text-brand-500 font-bold">
                Pop · AI Chief of Staff
              </div>
            </div>
            <div className="text-xs text-white/30 font-mono">
              {phase === "relief" ? "press space →" : phase === "closer" ? "← back" : ""}
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-5xl">
            {phase === "relief" && (
              <div className="animate-fade-in">
                <p className="uppercase tracking-[0.3em] text-xs text-brand-500 font-bold mb-6">
                  Now flip it
                </p>
                <h2 className="font-display font-black text-6xl md:text-8xl leading-[0.9] tracking-tight">
                  What if Maria<br />had one <span className="text-brand-500">too?</span>
                </h2>
                <p className="mt-10 max-w-2xl text-white/70 text-xl leading-relaxed">
                  Pop is the same brain — flipped to serve her.<br />
                  Her inbox, her calendar, her reviews. A phone number she calls.
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhase("asking");
                  }}
                  className="mt-12 inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-black font-bold text-lg"
                >
                  🎙️ Listen to Maria call Pop
                </button>
              </div>
            )}

            {(phase === "asking" || phase === "answering" || phase === "invoice" || phase === "closer") && (
              <div className="flex flex-col gap-6 max-w-3xl">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold">M</div>
                  <div className={`flex-1 p-5 rounded-2xl bg-white/5 border border-white/10 ${phase === "asking" ? "ring-2 ring-brand-500/40" : ""}`}>
                    <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Maria</div>
                    <div className="text-2xl text-white/90">{GOLDEN_QUESTION}</div>
                  </div>
                </div>

                {(phase === "answering" || phase === "invoice" || phase === "closer") && (
                  <div className="flex items-start gap-4 animate-fade-in">
                    <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-black font-black">P</div>
                    <div className={`flex-1 p-5 rounded-2xl bg-brand-500/10 border border-brand-500/30 ${phase === "answering" ? "ring-2 ring-brand-500/60" : ""}`}>
                      <div className="text-xs text-brand-500 uppercase tracking-wider mb-1">Pop</div>
                      <div className="text-xl text-white/90 leading-relaxed">{GOLDEN_ANSWER}</div>
                    </div>
                  </div>
                )}

                {(phase === "invoice" || phase === "closer") && (
                  <div className="ml-14 animate-slide-in">
                    <InvoiceCard />
                  </div>
                )}
              </div>
            )}

            {phase === "closer" && (
              <div className="mt-12 animate-fade-in max-w-3xl">
                <div className="h-px bg-white/10 mb-8" />
                <h2 className="font-display font-black text-4xl md:text-5xl leading-tight">
                  Pop. <span className="text-brand-500">An AI Chief of Staff</span> for the 36 million.
                </h2>
                <p className="mt-4 text-white/60 text-lg">
                  Three Mission restaurants in the pilot Monday. Free for 30 days. $99/mo after.
                </p>
                <a
                  href="/full#clone"
                  onClick={(e) => e.stopPropagation()}
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors"
                >
                  Clone your competition →
                </a>
              </div>
            )}
          </div>

          <div className="text-xs text-white/30">
            GStack × GBrain Hackathon · May 16 2026 · <a href="/full" className="underline hover:text-white/60">see full demo</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-black/40 border border-red-900/30">
      <div className="text-[10px] uppercase tracking-wider text-red-300/70">{label}</div>
      <div className="font-mono font-bold text-2xl text-red-400 mt-1 tabular-nums">{value}</div>
    </div>
  );
}

function InvoiceCard() {
  return (
    <div className="rounded-xl bg-black/60 border border-white/15 p-5 max-w-md shadow-2xl">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs uppercase tracking-wider text-white/40">Auto-sent · 2 min ago</div>
        <div className="text-xs text-emerald-400 font-mono">✓ DELIVERED</div>
      </div>
      <div className="text-sm text-white/50 mb-2">To: events@missionculturalcenter.org</div>
      <div className="text-sm text-white/80 leading-relaxed">
        Hi team — friendly nudge on invoice #2041 (<span className="text-brand-500 font-bold">$1,850</span>). Totally
        understand the grant timing; confirming May 23 payment is on track. We
        have you for two fall events and would love to keep things smooth.
        ¡Gracias! — Maria
      </div>
    </div>
  );
}
