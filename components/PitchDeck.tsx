"use client";

import { useCallback, useEffect, useState } from "react";

type Slide = {
  id: string;
  kind:
    | "title"
    | "stat"
    | "persona"
    | "threat"
    | "what"
    | "moat"
    | "competition"
    | "gtm"
    | "horizon"
    | "closer";
};

const SLIDES: Slide[] = [
  { id: "title", kind: "title" },
  { id: "gap", kind: "stat" },
  { id: "persona", kind: "persona" },
  { id: "threat", kind: "threat" },
  { id: "what", kind: "what" },
  { id: "moat", kind: "moat" },
  { id: "competition", kind: "competition" },
  { id: "gtm", kind: "gtm" },
  { id: "horizon", kind: "horizon" },
  { id: "closer", kind: "closer" },
];

export default function PitchDeck() {
  const [i, setI] = useState(0);

  const next = useCallback(
    () => setI((x) => Math.min(x + 1, SLIDES.length - 1)),
    [],
  );
  const prev = useCallback(() => setI((x) => Math.max(x - 1, 0)), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === " " || e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft" || e.key === "Backspace") {
        e.preventDefault();
        prev();
      }
      if (e.key === "Home") setI(0);
      if (e.key === "End") setI(SLIDES.length - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const slide = SLIDES[i];

  return (
    <div
      className="min-h-screen w-full bg-neutral-950 text-white relative overflow-hidden cursor-pointer"
      onClick={next}
    >
      {/* Slide content */}
      <div className="absolute inset-0 flex items-center justify-center px-12 md:px-24">
        {slide.kind === "title" && <TitleSlide />}
        {slide.kind === "stat" && <StatSlide />}
        {slide.kind === "persona" && <PersonaSlide />}
        {slide.kind === "threat" && <ThreatSlide />}
        {slide.kind === "what" && <WhatSlide />}
        {slide.kind === "moat" && <MoatSlide />}
        {slide.kind === "competition" && <CompetitionSlide />}
        {slide.kind === "gtm" && <GtmSlide />}
        {slide.kind === "horizon" && <HorizonSlide />}
        {slide.kind === "closer" && <CloserSlide />}
      </div>

      {/* Footer nav */}
      <div className="absolute bottom-0 inset-x-0 px-8 py-4 flex items-center justify-between text-xs text-white/30 font-mono">
        <div>
          {i + 1} / {SLIDES.length}
        </div>
        <div className="flex items-center gap-4">
          <span>← prev · → next</span>
          <a
            href="/"
            onClick={(e) => e.stopPropagation()}
            className="hover:text-white/60 underline"
          >
            launch live demo
          </a>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute top-0 inset-x-0 h-px bg-white/5">
        <div
          className="h-full bg-brand-500 transition-all duration-300"
          style={{ width: `${((i + 1) / SLIDES.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

/* ────────── SLIDES ────────── */

function TitleSlide() {
  return (
    <div className="max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-black font-black">
          P
        </div>
        <div className="uppercase tracking-[0.3em] text-xs text-brand-500 font-bold">
          GStack × GBrain Hackathon · May 16 2026
        </div>
      </div>
      <h1 className="font-display font-black text-7xl md:text-9xl leading-[0.9] tracking-tight">
        Pop
      </h1>
      <p className="mt-8 text-3xl md:text-4xl text-white/70 font-display font-bold leading-tight max-w-3xl">
        An AI co-founder for the <span className="text-brand-500">36 million</span> Mom &amp; Pop shops.
      </p>
      <p className="mt-12 text-sm text-white/40 font-mono">press space to begin →</p>
    </div>
  );
}

function StatSlide() {
  return (
    <div className="max-w-5xl">
      <p className="uppercase tracking-[0.3em] text-xs text-red-400 font-bold mb-8">
        The gap
      </p>
      <div className="space-y-6">
        <BigStat number="36.2M" label="small businesses in the US" />
        <BigStat number="55%" label="have tried AI" />
        <BigStat
          number="<9%"
          label="have it actually running their business"
          highlight
        />
      </div>
      <p className="mt-12 text-xs text-white/30 font-mono">
        Sources: SBA 2025 Profile · Thryv AI Survey 2025
      </p>
    </div>
  );
}

function PersonaSlide() {
  return (
    <div className="max-w-5xl w-full">
      <p className="uppercase tracking-[0.3em] text-xs text-brand-500 font-bold mb-8">
        Meet Sofía
      </p>
      <h2 className="font-display font-black text-5xl md:text-7xl leading-[0.95] tracking-tight">
        Hair salon owner.<br />
        <span className="text-white/40">3 stylists. Mission District. SF.</span>
      </h2>
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-5">
        <PainTile value="27" label="unread Instagram DMs" />
        <PainTile value="41" label="unread emails" />
        <PainTile value="3" label="bridal leads lost this month" highlight />
        <PainTile value="16hr" label="per week on admin" />
      </div>
      <p className="mt-12 text-lg text-white/60 max-w-2xl">
        She is the CEO, the receptionist, the stylist, the bookkeeper,
        and the social media team. She has no time and no tech stack.
      </p>
    </div>
  );
}

function ThreatSlide() {
  return (
    <div className="max-w-5xl w-full">
      <p className="uppercase tracking-[0.3em] text-xs text-red-400 font-bold mb-8">
        Meanwhile, next door
      </p>
      <h2 className="font-display font-black text-5xl md:text-7xl leading-[0.95] tracking-tight">
        An AI-native salon<br />
        <span className="text-red-500">just opened.</span>
      </h2>
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl">
        <ThreatStat value="100%" label="DM reply rate" />
        <ThreatStat value="4 min" label="avg response" />
        <ThreatStat value="5 / wk" label="IG posts" />
        <ThreatStat value="38 / wk" label="bookings captured" />
      </div>
      <p className="mt-12 text-2xl text-white/80 font-medium max-w-3xl leading-snug">
        Same neighborhood. Same chairs. Different operations.<br />
        <span className="text-white">It never misses a message.</span>
      </p>
    </div>
  );
}

function WhatSlide() {
  return (
    <div className="max-w-6xl w-full">
      <p className="uppercase tracking-[0.3em] text-xs text-brand-500 font-bold mb-8">
        What Pop does
      </p>
      <h2 className="font-display font-black text-4xl md:text-6xl leading-tight tracking-tight mb-12">
        One co-founder. <span className="text-brand-500">Four jobs.</span>
      </h2>
      <div className="grid md:grid-cols-2 gap-5">
        <FeatureCard
          emoji="📥"
          title="One inbox"
          body="Aggregates Gmail + Instagram DMs into a single triaged queue. Pop drafts replies. You approve."
        />
        <FeatureCard
          emoji="✅"
          title="Plans & actions"
          body="Today / This week / Backlog. Pop already started — you just say yes."
        />
        <FeatureCard
          emoji="🧠"
          title="Private GBrain"
          body="Every call, DM, email, and review captured into your own memory layer."
        />
        <FeatureCard
          emoji="🔄"
          title="Provider portability"
          body="Use any AI provider. Pop captures everything to your GBrain. Switch anytime — your data goes with you."
          highlight
        />
      </div>
    </div>
  );
}

function MoatSlide() {
  return (
    <div className="max-w-5xl">
      <p className="uppercase tracking-[0.3em] text-xs text-brand-500 font-bold mb-8">
        The moat
      </p>
      <h2 className="font-display font-black text-5xl md:text-7xl leading-[0.95] tracking-tight">
        Every interaction lives in <span className="text-brand-500">her</span> GBrain.
      </h2>
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <MoatPanel
          label="Today"
          text="Pop is the easiest way to start. Your data flows in from day one."
        />
        <MoatPanel
          label="Tomorrow"
          text="If we stop being the best, she owns everything and walks. No lock-in. That's the moat."
          highlight
        />
      </div>
      <p className="mt-12 text-xl text-white/60 max-w-3xl">
        Motion holds your workflows. Bond holds your dashboard. We hold{" "}
        <span className="text-white">nothing</span>. The owner holds everything.
      </p>
    </div>
  );
}

function CompetitionSlide() {
  return (
    <div className="max-w-6xl w-full">
      <p className="uppercase tracking-[0.3em] text-xs text-brand-500 font-bold mb-8">
        Where we sit
      </p>
      <h2 className="font-display font-black text-4xl md:text-6xl leading-tight tracking-tight mb-12">
        The 36 million below them.
      </h2>
      <div className="space-y-3">
        <CompetitorRow
          name="Motion"
          stage="$10M ARR · $38M raised"
          who="sub-100 person teams with a Slack / Salesforce stack"
        />
        <CompetitorRow
          name="Bond (Donna)"
          stage="YC X25"
          who="CEOs and execs of funded startups"
        />
        <CompetitorRow
          name="Certus AI"
          stage="YC F25 · $250/mo"
          who="restaurants — only phone orders"
        />
        <CompetitorRow
          name="Pop"
          stage="us"
          who="the 36M owner-operators of sub-10 person shops who have no stack — just a phone, a DM inbox, and a deadline"
          highlight
        />
      </div>
    </div>
  );
}

function GtmSlide() {
  return (
    <div className="max-w-5xl w-full">
      <p className="uppercase tracking-[0.3em] text-xs text-brand-500 font-bold mb-8">
        Go to market
      </p>
      <h2 className="font-display font-black text-5xl md:text-7xl leading-[0.95] tracking-tight">
        Hair salons<br />and florists.<br />
        <span className="text-white/40">Mission District. First.</span>
      </h2>
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        <GtmTile big="3" small="verbal pilots" />
        <GtmTile big="Mon" small="onboarding starts" />
        <GtmTile big="$0" small="first 30 days" />
        <GtmTile big="$99/mo" small="after" />
      </div>
      <p className="mt-10 text-lg text-white/60 max-w-3xl">
        Setup time: <span className="text-white">12 minutes</span>. Forward Instagram,
        connect inbox, done. Then quietly lateral — anywhere the owner is also
        the operator.
      </p>
    </div>
  );
}

function HorizonSlide() {
  return (
    <div className="max-w-6xl w-full">
      <p className="uppercase tracking-[0.3em] text-xs text-brand-500 font-bold mb-8">
        Where this goes
      </p>
      <h2 className="font-display font-black text-4xl md:text-6xl leading-tight tracking-tight mb-12">
        From <span className="text-brand-500">"AI for Sofía"</span> to the{" "}
        <span className="text-brand-500">data layer for the 36 million</span>.
      </h2>
      <div className="grid md:grid-cols-3 gap-4">
        <HorizonCard
          when="Today"
          title="Pop for salons + florists"
          points={[
            "Mission District pilots",
            "DMs · inbox · reviews · brief",
            "$99/mo · 12-min setup",
          ]}
        />
        <HorizonCard
          when="6 months"
          title="Provider portability layer"
          points={[
            "Capture every interaction across any AI tool",
            "Owner-owned GBrain",
            "Switch providers without losing context",
          ]}
        />
        <HorizonCard
          when="18 months"
          title="Open-source brains"
          points={[
            "Owners run models on their own brain",
            "Shared playbooks (opt-in network effect)",
            "The data layer Mom & Pop never had",
          ]}
          highlight
        />
      </div>
    </div>
  );
}

function CloserSlide() {
  return (
    <div className="max-w-5xl text-center">
      <div className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center text-black font-black text-3xl mx-auto mb-10">
        P
      </div>
      <h1 className="font-display font-black text-6xl md:text-8xl leading-[0.9] tracking-tight">
        Pop
      </h1>
      <p className="mt-6 text-2xl md:text-3xl text-white/80 font-display font-bold">
        AI co-founder for the 36 million.
      </p>
      <div className="mt-16 flex flex-col gap-2 items-center">
        <div className="text-sm text-white/40 uppercase tracking-wider">
          Try the live demo
        </div>
        <div className="font-mono text-2xl text-brand-500">
          pop-cos.vercel.app
        </div>
      </div>
    </div>
  );
}

/* ────────── PRIMITIVES ────────── */

function BigStat({
  number,
  label,
  highlight,
}: {
  number: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-6">
      <div
        className={`font-display font-black text-6xl md:text-8xl tabular-nums ${
          highlight ? "text-brand-500" : "text-white"
        }`}
      >
        {number}
      </div>
      <div className="text-xl md:text-2xl text-white/60">{label}</div>
    </div>
  );
}

function PainTile({
  value,
  label,
  highlight,
}: {
  value: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-5 rounded-md border ${
        highlight
          ? "bg-red-500/10 border-red-500/30"
          : "bg-white/5 border-white/10"
      }`}
    >
      <div
        className={`font-display font-black text-4xl tabular-nums ${
          highlight ? "text-red-400" : "text-white"
        }`}
      >
        {value}
      </div>
      <div className="text-sm text-white/60 mt-1">{label}</div>
    </div>
  );
}

function ThreatStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="p-4 rounded-md border bg-red-950/30 border-red-900/40">
      <div className="text-[10px] uppercase tracking-wider text-red-300/70">
        {label}
      </div>
      <div className="font-mono font-bold text-2xl text-red-400 mt-1 tabular-nums">
        {value}
      </div>
    </div>
  );
}

function FeatureCard({
  emoji,
  title,
  body,
  highlight,
}: {
  emoji: string;
  title: string;
  body: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-6 rounded-md border ${
        highlight
          ? "bg-brand-500/8 border-brand-500/30"
          : "bg-white/5 border-white/10"
      }`}
    >
      <div className="text-3xl mb-3">{emoji}</div>
      <div className="font-display font-black text-xl">{title}</div>
      <div className="text-white/60 mt-2 leading-relaxed">{body}</div>
    </div>
  );
}

function MoatPanel({
  label,
  text,
  highlight,
}: {
  label: string;
  text: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-6 rounded-md border ${
        highlight
          ? "bg-brand-500/8 border-brand-500/30"
          : "bg-white/5 border-white/10"
      }`}
    >
      <div
        className={`text-xs uppercase tracking-wider font-bold ${
          highlight ? "text-brand-500" : "text-white/40"
        }`}
      >
        {label}
      </div>
      <div className="text-xl text-white/90 mt-2 leading-snug">{text}</div>
    </div>
  );
}

function CompetitorRow({
  name,
  stage,
  who,
  highlight,
}: {
  name: string;
  stage: string;
  who: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-12 gap-4 px-5 py-4 rounded-md border items-center ${
        highlight
          ? "bg-brand-500/8 border-brand-500/30"
          : "bg-white/5 border-white/10"
      }`}
    >
      <div
        className={`col-span-3 font-display font-black text-xl ${
          highlight ? "text-brand-500" : "text-white"
        }`}
      >
        {name}
      </div>
      <div className="col-span-3 text-xs text-white/40 uppercase tracking-wider">
        {stage}
      </div>
      <div className="col-span-6 text-white/70 text-sm leading-snug">{who}</div>
    </div>
  );
}

function GtmTile({ big, small }: { big: string; small: string }) {
  return (
    <div className="p-5 rounded-md border bg-white/5 border-white/10">
      <div className="font-display font-black text-4xl text-brand-500 tabular-nums">
        {big}
      </div>
      <div className="text-xs uppercase tracking-wider text-white/40 mt-2">
        {small}
      </div>
    </div>
  );
}

function HorizonCard({
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
      className={`p-5 rounded-md border ${
        highlight
          ? "bg-brand-500/8 border-brand-500/30"
          : "bg-white/5 border-white/10"
      }`}
    >
      <div className="text-xs uppercase tracking-wider text-brand-500 font-bold">
        {when}
      </div>
      <div className="font-display font-black text-xl mt-2 leading-tight">
        {title}
      </div>
      <ul className="mt-3 space-y-1.5 text-sm text-white/70">
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
