"use client";

import Link from "next/link";
import ArchitectureStack from "./ArchitectureStack";
import WhatsAppDemo from "./WhatsAppDemo";
import RecommendedTools from "./RecommendedTools";

export default function LandingPage() {
  function scrollToChat() {
    document
      .getElementById("conversation")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-[#f6f3ee]">
      {/* ═══ SECTION 1 — HERO ═══ */}
      <section className="min-h-screen flex flex-col px-6 md:px-12 lg:px-20 pb-20">
        <nav className="flex items-center justify-between pt-6 pb-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center font-display font-black text-sm">
              P
            </div>
            <span className="font-display font-bold text-lg">Pop</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <Link href="/demo" className="hover:text-white/70 transition-colors">
              Live demo
            </Link>
            <Link href="/dashboard" className="hover:text-white/70 transition-colors">
              Dashboard
            </Link>
            <Link href="/pitch" className="hover:text-white/70 transition-colors">
              Slides
            </Link>
          </div>
        </nav>

        <div className="flex-1 flex flex-col justify-center max-w-5xl">
          <p className="uppercase tracking-[0.2em] text-xs font-bold text-brand-500 mb-6">
            AI Co-founder for Mom &amp; Pop shops
          </p>
          <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[1.05]">
            An AI-native version of your business
            <br />
            opens next door.
            <br />
            <span className="text-brand-500">We show the same to you.</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-3xl mt-8 leading-relaxed">
            Drop in and Pop will walk you through it. 2 minutes.
          </p>
          <div className="mt-10">
            <button
              onClick={scrollToChat}
              className="px-8 py-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-lg transition-colors"
            >
              Start the demo &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 2 — HOW IT WORKS ═══ */}
      <ArchitectureStack />

      {/* ═══ SECTION 3 — THE CONVERSATION ═══ */}
      <WhatsAppDemo />

      {/* ═══ SECTION 4 + 5 — REVEAL + CTA ═══ */}
      <RecommendedTools />
    </div>
  );
}
