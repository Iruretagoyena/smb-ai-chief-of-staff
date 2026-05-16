"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Phase =
  | "threat"
  | "flip"
  | "relief"
  | "asking"
  | "answering"
  | "dm"
  | "closer"
  | "roadmap";

const GOLDEN_QUESTION = "Pop, what should I do first today?";
const GOLDEN_ANSWER =
  "Three things, Sofía. First — Mara needs an answer by Friday or she takes another offer; my read is yes, hire her. Second — you had twenty-seven DMs this morning; I replied to twenty-four and booked eleven of them already. Third — I held back three bridal inquiries because they need your voice, not mine. And by the way, I sent the friendly nudge to Adriana for the trial invoice. She just paid.";

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
    dms: 0,
    responseMin: 0,
    posts: 0,
    bookings: 0,
  });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (phase !== "threat") return;
    let i = 0;
    timerRef.current = setInterval(() => {
      i += 1;
      setBot({
        dms: Math.min(100, i * 8),
        responseMin: Math.max(4, 60 - i * 4),
        posts: Math.min(5, Math.floor(i / 3)),
        bookings: Math.min(38, i * 3),
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
      if (p === "answering") return "dm";
      if (p === "dm") return "closer";
      if (p === "closer") return "roadmap";
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
          if (p === "roadmap") return "closer";
          if (p === "closer") return "dm";
          if (p === "dm") return "answering";
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
        onEnd: () => setTimeout(() => setPhase("dm"), 400),
      });
    }
    if (phase === "dm") {
      const t = setTimeout(() => setPhase("closer"), 4500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const flipped =
    phase === "flip" ||
    phase === "relief" ||
    phase === "asking" ||
    phase === "answering" ||
    phase === "dm" ||
    phase === "closer" ||
    phase === "roadmap";

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
              An AI-native<br />hair salon<br />
              <span className="text-red-500">just opened.</span>
            </h1>
            <p className="mt-10 max-w-2xl text-white/70 text-xl leading-relaxed">
              Same neighborhood. Same chairs. Different operations. Replies to
              every Instagram DM in 4 minutes. Posts 5 times a week.
              Books bridal trials while you sleep. <br />
              <span className="text-white font-semibold">It never misses a message.</span>
            </p>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl">
              <Stat label="DM response rate" value={`${bot.dms}%`} />
              <Stat label="Avg response" value={`${bot.responseMin} min`} />
              <Stat label="IG posts / week" value={`${bot.posts}`} />
              <Stat label="Bookings captured / wk" value={`${bot.bookings}`} />
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-white/40">
                Sol &amp; Trenza · this week
              </div>
              <div className="text-2xl md:text-4xl font-display font-black mt-2 text-white/70 leading-tight">
                27 unread DMs · 41 unread emails · 3 bridal leads lost
              </div>
            </div>
            <div className="text-xs text-white/30 hidden md:block max-w-xs text-right">
              36.2M small businesses in the US.<br />8.8% use AI in production.
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 flex flex-col justify-between p-12 md:p-20 bg-gradient-to-br from-amber-950 via-black to-black"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center text-black font-black text-sm">
                P
              </div>
              <div className="uppercase tracking-[0.3em] text-xs text-brand-500 font-bold">
                Pop · AI Co-founder
              </div>
            </div>
            <div className="text-xs text-white/30 font-mono">
              {phase === "relief"
                ? "press space →"
                : phase === "roadmap"
                  ? "← back"
                  : ""}
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-5xl w-full">
            {phase === "relief" && (
              <div className="animate-fade-in">
                <p className="uppercase tracking-[0.3em] text-xs text-brand-500 font-bold mb-6">
                  Now flip it
                </p>
                <h2 className="font-display font-black text-6xl md:text-8xl leading-[0.9] tracking-tight">
                  What if Sofía<br />had one <span className="text-brand-500">too?</span>
                </h2>
                <p className="mt-10 max-w-2xl text-white/70 text-xl leading-relaxed">
                  Pop is the same brain — turned to serve her.<br />
                  Her DMs, her inbox, her calendar, her clients. A phone number
                  she just calls.
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhase("asking");
                  }}
                  className="mt-12 inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-black font-bold text-lg"
                >
                  🎙️ Listen to Sofía call Pop
                </button>
              </div>
            )}

            {(phase === "asking" ||
              phase === "answering" ||
              phase === "dm" ||
              phase === "closer") && (
              <div className="flex flex-col gap-6 max-w-3xl">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold">
                    S
                  </div>
                  <div
                    className={`flex-1 p-5 rounded-2xl bg-white/5 border border-white/10 ${
                      phase === "asking" ? "ring-2 ring-brand-500/40" : ""
                    }`}
                  >
                    <div className="text-xs text-white/40 uppercase tracking-wider mb-1">
                      Sofía
                    </div>
                    <div className="text-2xl text-white/90">{GOLDEN_QUESTION}</div>
                  </div>
                </div>

                {(phase === "answering" ||
                  phase === "dm" ||
                  phase === "closer") && (
                  <div className="flex items-start gap-4 animate-fade-in">
                    <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-black font-black">
                      P
                    </div>
                    <div
                      className={`flex-1 p-5 rounded-2xl bg-brand-500/10 border border-brand-500/30 ${
                        phase === "answering" ? "ring-2 ring-brand-500/60" : ""
                      }`}
                    >
                      <div className="text-xs text-brand-500 uppercase tracking-wider mb-1">
                        Pop
                      </div>
                      <div className="text-xl text-white/90 leading-relaxed">
                        {GOLDEN_ANSWER}
                      </div>
                    </div>
                  </div>
                )}

                {(phase === "dm" || phase === "closer") && (
                  <div className="ml-14 animate-slide-in">
                    <DMCard />
                  </div>
                )}
              </div>
            )}

            {phase === "closer" && (
              <div className="mt-12 animate-fade-in max-w-4xl">
                <div className="h-px bg-white/10 mb-8" />
                <h2 className="font-display font-black text-4xl md:text-5xl leading-tight">
                  Motion sells you software.<br />
                  Bond sells the CEO a dashboard.<br />
                  <span className="text-brand-500">
                    Pop is an AI co-founder for the 36 million
                  </span>{" "}
                  owners who are <em>also</em> the operator.
                </h2>
                <p className="mt-6 text-white/70 text-lg leading-relaxed max-w-2xl">
                  Every interaction lives in <span className="text-white font-semibold">their</span> private GBrain.
                  If we stop being the best, they own everything and walk.<br />
                  <span className="text-white/50">No lock-in. That&apos;s the moat.</span>
                </p>
                <a
                  href="/dashboard"
                  onClick={(e) => e.stopPropagation()}
                  className="mt-8 inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-black font-bold text-lg transition-colors"
                >
                  See Sofia&apos;s dashboard &rarr;
                </a>
              </div>
            )}

            {phase === "roadmap" && (
              <div className="animate-fade-in max-w-4xl">
                <p className="uppercase tracking-[0.3em] text-xs text-brand-500 font-bold mb-6">
                  Where this goes
                </p>
                <h2 className="font-display font-black text-4xl md:text-5xl leading-tight tracking-tight mb-10">
                  From <span className="text-brand-500">"AI for Sofía"</span> to{" "}
                  <span className="text-brand-500">"data layer for the 36 million"</span>
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <RoadCard
                    when="Today"
                    title="Pop for salons + florists"
                    points={[
                      "3 Mission pilots Monday",
                      "Free 30 days · $99/mo",
                      "DMs · inbox · reviews · brief",
                    ]}
                  />
                  <RoadCard
                    when="6 months"
                    title="Provider portability layer"
                    points={[
                      "Capture every interaction across any AI tool",
                      "Owner-owned GBrain",
                      "Switch providers anytime",
                    ]}
                  />
                  <RoadCard
                    when="18 months"
                    title="Open-source models on private data"
                    points={[
                      "Owners run models on their own brain",
                      "Network effect: shared playbooks (opt-in)",
                      "The data layer Mom & Pop never had",
                    ]}
                    highlight
                  />
                </div>
              </div>
            )}
          </div>

          <div className="text-xs text-white/30">
            GStack × GBrain Hackathon · May 16 2026 ·{" "}
            <a href="/full" className="underline hover:text-white/60">
              see full demo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-black/40 border border-red-900/30">
      <div className="text-[10px] uppercase tracking-wider text-red-300/70">
        {label}
      </div>
      <div className="font-mono font-bold text-2xl text-red-400 mt-1 tabular-nums">
        {value}
      </div>
    </div>
  );
}

function DMCard() {
  return (
    <div className="rounded-xl bg-black/60 border border-white/15 p-5 max-w-md shadow-2xl">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs uppercase tracking-wider text-white/40">
          Instagram DM · auto-sent 2 min ago
        </div>
        <div className="text-xs text-emerald-400 font-mono">✓ READ</div>
      </div>
      <div className="text-sm text-white/50 mb-2">To: @amber_m_sf</div>
      <div className="text-sm text-white/80 leading-relaxed">
        Hi Amber! Yes — Saturday at <span className="text-brand-500 font-bold">11am or 2pm</span> both
        open for color. I'll save the 2pm for your niece if that works. Sending you
        the deposit link now. Excited for prom! 🌟 — Sofía
      </div>
    </div>
  );
}

function RoadCard({
  when,
  title,
  points,
  highlight,
}: {
  when: string;
  title: string;
  points: string[];
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-5 rounded-xl border ${
        highlight
          ? "bg-brand-500/10 border-brand-500/40"
          : "bg-white/5 border-white/10"
      }`}
    >
      <div className="text-xs uppercase tracking-wider text-brand-500 font-bold">
        {when}
      </div>
      <div className="font-display font-black text-xl mt-2 leading-tight">
        {title}
      </div>
      <ul className="mt-3 space-y-1 text-sm text-white/70">
        {points.map((p) => (
          <li key={p} className="flex gap-2">
            <span className="text-brand-500">·</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
