"use client";

import { useState } from "react";
import MirrorPanel from "@/components/MirrorPanel";
import CosChat from "@/components/CosChat";
import CosVoice from "@/components/CosVoice";
import WeeklyBrief from "@/components/WeeklyBrief";

export default function Home() {
  const [mirrorRun, setMirrorRun] = useState(false);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="flex items-center justify-between mb-16">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-black font-black">P</div>
          <span className="font-display font-black tracking-tight text-lg">Pop</span>
        </div>
        <a href="#cos" className="text-sm text-white/60 hover:text-white">
          Try the Chief of Staff →
        </a>
      </header>

      <section className="mb-24">
        <p className="uppercase tracking-[0.2em] text-xs text-brand-500 font-bold mb-4">
          For Mom &amp; Pop shops · GStack × GBrain hackathon
        </p>
        <h1 className="font-display font-black text-5xl md:text-7xl leading-[0.95] tracking-tight">
          An AI-native taqueria<br />
          opens next door.
        </h1>
        <p className="mt-8 max-w-2xl text-white/70 text-lg leading-relaxed">
          Same neighborhood. Same menu. Different operations. It replies to every
          review in 7 minutes, posts on Instagram four times a week, and chases every
          late invoice. It never sleeps. <br/>
          <span className="text-white">What does it do to your business in one week?</span>
        </p>

        <div className="mt-10 p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div>
              <div className="text-sm text-white/50">Demo business loaded</div>
              <div className="text-xl font-display font-bold">Lupita&apos;s Taqueria · 2847 Mission St</div>
              <div className="text-sm text-white/60">⭐ 4.3 Google · 4.0 Yelp · 1.8k IG followers · $47k/mo</div>
            </div>
            <button
              onClick={() => setMirrorRun(true)}
              disabled={mirrorRun}
              className="px-6 py-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-black font-bold text-lg disabled:opacity-60"
            >
              {mirrorRun ? "Running the mirror…" : "Show me the competitor →"}
            </button>
          </div>
        </div>
      </section>

      {mirrorRun && <MirrorPanel />}

      <section id="cos" className="mt-32 mb-24">
        <p className="uppercase tracking-[0.2em] text-xs text-brand-500 font-bold mb-4">
          Now flip it
        </p>
        <h2 className="font-display font-black text-4xl md:text-6xl leading-[0.95] tracking-tight">
          What if Maria<br />had one too?
        </h2>
        <p className="mt-8 max-w-2xl text-white/70 text-lg leading-relaxed">
          Pop is the AI Chief of Staff for Maria. It reads her email, her calendar, her
          reviews. She calls a phone number when she needs an answer.
        </p>

        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <div className="text-sm text-white/50 mb-3">🎙️ Talk to Pop</div>
            <CosVoice />
            <div className="text-xs text-white/30 mt-4 text-center">
              Chrome desktop · mic permission required
            </div>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <div className="text-sm text-white/50 mb-2">⌨️ Or type — same brain</div>
            <CosChat />
          </div>
        </div>
      </section>

      <section className="mt-24 mb-24">
        <p className="uppercase tracking-[0.2em] text-xs text-brand-500 font-bold mb-4">
          Monday at 7am
        </p>
        <h2 className="font-display font-black text-4xl md:text-6xl leading-[0.95] tracking-tight">
          Your week, one screen.
        </h2>
        <p className="mt-8 max-w-2xl text-white/70 text-lg leading-relaxed">
          Every Monday at 7am, Pop sends Maria a one-page brief. What is urgent.
          Who owes money. What was handled while she slept.
        </p>
        <WeeklyBrief />
      </section>

      <footer className="border-t border-white/10 pt-8 pb-12 text-sm text-white/40 flex flex-col md:flex-row justify-between gap-2">
        <div>Built at the GStack × GBrain Hackathon · May 16 2026</div>
        <div>Powered by GBrain · Claude · Twilio · Lightsprint</div>
      </footer>
    </main>
  );
}
