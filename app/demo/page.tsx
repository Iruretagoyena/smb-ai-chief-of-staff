"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import conversations from "@/data/demo-conversations.json";

/* ── Conversation card for the IG DM grid ── */
function ConvoCard({
  convo,
}: {
  convo: (typeof conversations)[number];
}) {
  const initial = convo.handle.replace("@", "").charAt(0).toUpperCase();
  const colors = ["from-purple-400 to-pink-500", "from-cyan-400 to-blue-500", "from-amber-400 to-orange-500", "from-emerald-400 to-teal-500", "from-rose-400 to-red-500", "from-indigo-400 to-violet-500"];
  const colorIdx = convo.handle.length % colors.length;

  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/5">
        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${colors[colorIdx]} flex items-center justify-center text-sm font-bold text-white shrink-0`}>
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white/90 truncate">{convo.handle}</p>
        </div>
        <span className="text-[11px] text-white/30 shrink-0">{convo.timestamp}</span>
      </div>

      {/* Messages */}
      <div className="space-y-2 flex-1">
        {convo.messages.map((msg, i) => (
          <div key={i} className={`text-[13px] leading-relaxed px-3 py-2 rounded-xl ${
            msg.from === "customer"
              ? "bg-white/[0.06] text-white/70"
              : "bg-[#ff6b1a]/[0.06] border border-[#ff6b1a]/15 text-white/80"
          }`}>
            {msg.from === "pop" && (
              <span className="text-[#ff6b1a] font-bold text-[11px]">Pop · </span>
            )}
            {msg.text}
          </div>
        ))}
      </div>

      {/* Outcome */}
      <div className="mt-3 pt-3 border-t border-white/5">
        <span className="text-xs font-medium text-emerald-400">✓ {convo.outcome}</span>
      </div>
    </div>
  );
}

/* ── Summary metrics bar ── */
function MetricsBar() {
  const stats = [
    { value: "3", label: "customers handled" },
    { value: "100%", label: "reply rate" },
    { value: "3 min", label: "avg response time" },
    { value: "36 min", label: "time saved today" },
    { value: "3", label: "bookings confirmed" },
    { value: "$700", label: "revenue captured today" },
  ];

  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-6 mt-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="text-center lg:border-r lg:border-white/5 last:border-0">
            <div className="text-2xl font-black text-[#ff6b1a]">{s.value}</div>
            <div className="text-[11px] text-white/40 mt-1 uppercase tracking-wider leading-tight">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-white/5 text-center">
        <Link href="/dashboard" className="text-xs text-white/30 hover:text-[#ff6b1a] transition-colors">
          All transcripts captured to Sof&iacute;a&apos;s private GBrain &rarr;
        </Link>
      </div>
    </div>
  );
}

/* ── Main demo page ── */
export default function DemoPage() {
  const [screen, setScreen] = useState(0);
  const [prevScreen, setPrevScreen] = useState<number | null>(null);
  const [direction, setDirection] = useState<"fwd" | "rev">("fwd");
  const totalScreens = 4;
  const transitioning = useRef(false);

  function goTo(index: number, dir: "fwd" | "rev") {
    if (index < 0 || index >= totalScreens || index === screen || transitioning.current) return;
    transitioning.current = true;
    setDirection(dir);
    setPrevScreen(screen);
    setScreen(index);
    setTimeout(() => {
      setPrevScreen(null);
      transitioning.current = false;
    }, 550);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(screen + 1, "fwd"); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); goTo(screen - 1, "rev"); }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  const screenClass = (i: number) => {
    if (i === screen) return `demo-screen demo-screen-enter-${direction}`;
    if (i === prevScreen) return `demo-screen demo-screen-exit-${direction}`;
    return "demo-screen demo-screen-hidden";
  };

  return (
    <div className="fixed inset-0 bg-[#0b0b0e] text-[#f6f3ee] overflow-hidden" style={{ fontFamily: "ui-sans-serif, system-ui, Inter, sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .demo-screen { position: absolute; inset: 0; }
        .demo-screen-hidden { opacity: 0; pointer-events: none; }
        .demo-screen-enter-fwd { animation: dsIn 0.5s ease both; pointer-events: all; z-index: 1; }
        .demo-screen-enter-rev { animation: dsInR 0.5s ease both; pointer-events: all; z-index: 1; }
        .demo-screen-exit-fwd { animation: dsOut 0.45s ease both; z-index: 0; }
        .demo-screen-exit-rev { animation: dsOutR 0.45s ease both; z-index: 0; }
        @keyframes dsIn   { from { opacity:0; transform:translateX(60px) } to { opacity:1; transform:translateX(0) } }
        @keyframes dsOut  { from { opacity:1; transform:translateX(0) } to { opacity:0; transform:translateX(-60px) } }
        @keyframes dsInR  { from { opacity:0; transform:translateX(-60px) } to { opacity:1; transform:translateX(0) } }
        @keyframes dsOutR { from { opacity:1; transform:translateX(0) } to { opacity:0; transform:translateX(60px) } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
        .stagger-1 { animation: fadeUp 0.6s ease 0.2s both; }
        .stagger-2 { animation: fadeUp 0.7s ease 0.9s both; }
        .stagger-3 { animation: fadeUp 0.5s ease 1.8s both; }
      `}} />

      {/* Step dots */}
      <div className="fixed top-6 right-8 flex gap-2 z-50">
        {Array.from({ length: totalScreens }).map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${
            i === screen ? "bg-[#ff6b1a] shadow-[0_0_8px_rgba(255,107,26,0.4)]" :
            i < screen ? "bg-[#ff6b1a]/35" : "bg-white/10"
          }`} />
        ))}
      </div>

      {/* ═══ Screen 0: Sofía intro ═══ */}
      <div className={screenClass(0)}>
        <div className="h-full flex items-center justify-center px-6">
          <div className="text-center max-w-[1100px]">
            <p className="text-xl text-white/55 leading-relaxed mb-7 stagger-1">
              Sof&iacute;a owns an auto repair shop in the Mission.
            </p>
            <h1 className="text-[44px] md:text-[56px] lg:text-[64px] font-black leading-[1.1] tracking-tight stagger-2">
              She struggles with managing inbound &mdash;{" "}
              <span className="text-[#ef4444]">Email</span>,{" "}
              <span className="text-[#ef4444]">Instagram DMs</span>,{" "}
              <span className="text-[#ef4444]">WhatsApp</span> &mdash;{" "}
              answering the phone 24/7,{" "}
              and prioritizing her work.
            </h1>
            <p className="text-lg text-white/35 mt-6 stagger-3">
              She&apos;s never had a co-founder. Until now.
            </p>
          </div>
        </div>
      </div>

      {/* ═══ Screen 1: We fix all that ═══ */}
      <div className={screenClass(1)}>
        <div className="h-full flex items-center justify-center px-6">
          <div className="text-center max-w-[1100px]">
            <h2 className="text-[52px] md:text-[64px] font-black leading-tight tracking-tight">
              We fix <span className="text-[#ef4444]">all</span> of that.
            </h2>
            <p className="text-[22px] text-white/55 leading-relaxed mt-8 max-w-2xl mx-auto">
              Pop is an AI co-founder that handles every manual operation &mdash;
              replies to DMs, answers the phone, drafts review responses,
              chases invoices, posts on social &mdash; so Sof&iacute;a can focus on
              fixing cars.
            </p>
            <p className="text-sm text-white/20 mt-10">
              press <kbd className="px-2 py-0.5 rounded bg-white/[0.07] border border-white/10 text-[11px] mx-1">&rarr;</kbd> to continue
            </p>
          </div>
        </div>
      </div>

      {/* ═══ Screen 2: Multi-customer IG simulation ═══ */}
      <div className={screenClass(2)}>
        <div className="h-full overflow-y-auto px-6 py-16">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-[0.25em] text-white/30 font-bold mb-3">
                Instagram DMs &middot; Today
              </p>
              <h2 className="text-[40px] md:text-[52px] font-black leading-tight tracking-tight">
                Pop replied to every customer.
              </h2>
              <p className="text-lg text-white/50 mt-4 max-w-2xl mx-auto leading-relaxed">
                Three new conversations. All handled while Sof&iacute;a was under a hood.
                Here&apos;s everything that happened today.
              </p>
            </div>

            {/* 3-column conversation grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {conversations.map((convo) => (
                <ConvoCard key={convo.handle} convo={convo} />
              ))}
            </div>

            {/* Metrics */}
            <MetricsBar />

            <p className="text-sm text-white/20 mt-8 text-center">
              press <kbd className="px-2 py-0.5 rounded bg-white/[0.07] border border-white/10 text-[11px] mx-1">&rarr;</kbd> to continue
            </p>
          </div>
        </div>
      </div>

      {/* ═══ Screen 3: Closer ═══ */}
      <div className={screenClass(3)}>
        <div className="h-full flex items-center justify-center px-6">
          <div className="text-center max-w-[620px]">
            <div className="text-[56px] font-black text-[#ff6b1a] mb-7">Pop</div>
            <p className="text-[22px] leading-relaxed text-white/80">
              Sof&iacute;a&apos;s been running Reyes Auto Repair for{" "}
              <em className="text-[#ff6b1a] not-italic font-bold">10 years</em>.
              <br />
              She&apos;s never had a co-founder.
              <br /><br />
              Now every DM, every call, every review, every invoice
              <br />
              is handled &mdash; so she can focus on{" "}
              <em className="text-[#ff6b1a] not-italic font-bold">the cars</em>.
              <br /><br />
              That&apos;s Pop.
            </p>
            <div className="mt-10">
              <Link
                href="/dashboard"
                className="inline-block px-8 py-4 rounded-xl bg-[#ff6b1a] hover:bg-[#e8530a] text-white font-bold text-lg transition-colors"
              >
                See Sof&iacute;a&apos;s dashboard &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Key bar */}
      <div className="fixed bottom-0 inset-x-0 bg-[#0b0b0e]/90 border-t border-white/5 py-2.5 flex justify-center gap-7 text-xs text-white/20 z-50">
        <span><kbd className="px-1.5 py-0.5 rounded bg-white/[0.07] border border-white/10 text-[11px] mr-1">&rarr;</kbd> Next</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-white/[0.07] border border-white/10 text-[11px] mr-1">&larr;</kbd> Back</span>
      </div>
    </div>
  );
}
