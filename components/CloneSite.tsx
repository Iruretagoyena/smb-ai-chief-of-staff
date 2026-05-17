"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type CloneData = {
  business_name?: string;
  business_type?: string;
  location?: string;
  since?: number;
  rating?: string;
  competitor?: { name: string; tagline: string };
  threat_analysis?: string;
  week_one_actions?: { category: string; action: string; impact: string }[];
  scoreboard?: { metric: string; you: string; competitor: string }[];
  pop_recommendation?: string;
};

const CATEGORY_ICONS: Record<string, string> = {
  Reviews: "⭐",
  "After-Hours Calls": "📞",
  "Quote Requests": "📋",
  "Social Media": "📱",
  "First-Timer Funnel": "🎯",
  "Customer Retention": "🔄",
  Invoicing: "💰",
  Operations: "⚙️",
};

const NAV_ITEMS = ["Home", "Services", "Book Online", "Reviews", "Our AI Edge"];

export default function CloneSite() {
  const router = useRouter();
  const [data, setData] = useState<CloneData | null>(null);
  const [submittedName, setSubmittedName] = useState("");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("clone-result");
      const name = sessionStorage.getItem("clone-submitted-name") || "";
      if (raw) {
        setData(JSON.parse(raw));
        setSubmittedName(name);
      } else {
        router.push("/");
      }
    } catch {
      router.push("/");
    }
  }, [router]);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0b0b0e] flex items-center justify-center text-white/50">
        Loading...
      </div>
    );
  }

  const competitorName = data.competitor?.name || "AI Competitor";
  const businessName = data.business_name || submittedName;

  return (
    <div className="min-h-screen bg-[#0f1923] text-white">
      {/* Pop Banner */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-white/20 flex items-center justify-center font-display font-black text-xs">
            P
          </div>
          <span className="text-sm font-medium">
            <span className="hidden sm:inline">Pop AI &mdash; </span>
            This is what your AI competitor&apos;s website would look like
          </span>
        </div>
        <Link
          href="/dashboard"
          className="text-sm font-bold bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-lg transition-colors whitespace-nowrap"
        >
          Go to dashboard &rarr;
        </Link>
      </div>

      {/* Competitor Website Header */}
      <header className="bg-[#1a2a3a] border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <span className="text-2xl font-black font-display">PP</span>
            </div>
            <div>
              <h1 className="font-display font-black text-xl md:text-2xl">
                {competitorName}
              </h1>
              <p className="text-cyan-400 text-sm">{data.competitor?.tagline}</p>
            </div>
          </div>
          <div className="text-right text-sm">
            <div className="text-cyan-400 font-bold text-lg">Always Open</div>
            <div className="text-white/50">AI-Powered &middot; 24/7/365</div>
            <div className="text-white/50">
              {data.location || "San Francisco, CA"}
            </div>
          </div>
        </div>
        {/* Nav */}
        <nav className="bg-[#0f1923] border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6 flex items-center gap-1 overflow-x-auto">
            {NAV_ITEMS.map((item, i) => (
              <span
                key={item}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors cursor-default ${
                  i === 0
                    ? "text-cyan-400 border-b-2 border-cyan-400"
                    : "text-white/50 hover:text-white/70"
                }`}
              >
                {item}
              </span>
            ))}
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#1a2a3a] to-[#0f1923] py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">
            Now open in {data.location || "your neighborhood"}
          </div>
          <h2 className="font-display font-black text-4xl md:text-6xl tracking-tight leading-[1.1]">
            {data.business_type
              ? `Your AI-Native ${data.business_type.split("/")[0].trim()} Shop`
              : "Your AI-Native Auto Shop"}
          </h2>
          <p className="text-white/60 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
            {data.threat_analysis}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <span className="px-6 py-3 rounded-xl bg-cyan-500 text-white font-bold cursor-default">
              Book a Service
            </span>
            <span className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white/80 font-medium cursor-default">
              Get an Instant Quote
            </span>
          </div>
        </div>
      </section>

      {/* Week One Stats Bar */}
      <section className="bg-cyan-500/10 border-y border-cyan-500/20 py-6">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-black text-cyan-400">23</div>
            <div className="text-xs text-white/50 mt-1">Reviews Answered</div>
          </div>
          <div>
            <div className="text-2xl font-black text-cyan-400">7 min</div>
            <div className="text-xs text-white/50 mt-1">Avg Response Time</div>
          </div>
          <div>
            <div className="text-2xl font-black text-cyan-400">31</div>
            <div className="text-xs text-white/50 mt-1">Calls Fielded 24/7</div>
          </div>
          <div>
            <div className="text-2xl font-black text-cyan-400">4 min</div>
            <div className="text-xs text-white/50 mt-1">Quote Turnaround</div>
          </div>
        </div>
      </section>

      {/* What We Did in Week One */}
      {data.week_one_actions && data.week_one_actions.length > 0 && (
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-6">
            <h3 className="font-display font-black text-3xl text-center mb-3">
              Our Launch Week
            </h3>
            <p className="text-white/50 text-center mb-10 max-w-xl mx-auto">
              Here&apos;s what {competitorName} accomplished in its first 7 days of operation.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {data.week_one_actions.map((a, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-white/[0.04] border border-white/10 p-5 hover:border-cyan-500/30 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">
                      {CATEGORY_ICONS[a.category] || "⚡"}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                      {a.category}
                    </span>
                  </div>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {a.action}
                  </p>
                  <p className="text-white/40 text-xs mt-3">{a.impact}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Scoreboard: Us vs Them */}
      {data.scoreboard && data.scoreboard.length > 0 && (
        <section className="py-16 bg-white/[0.02]">
          <div className="max-w-3xl mx-auto px-6">
            <h3 className="font-display font-black text-3xl text-center mb-3">
              How We Compare
            </h3>
            <p className="text-white/50 text-center mb-10">
              {competitorName} vs {businessName} — week one numbers
            </p>
            <div className="rounded-xl overflow-hidden border border-white/10">
              <div className="grid grid-cols-3 text-xs uppercase tracking-wider px-5 py-3 border-b border-white/10 bg-white/[0.04]">
                <div className="text-white/40">Metric</div>
                <div className="text-white/40">{businessName}</div>
                <div className="text-cyan-400">{competitorName.split(" ")[0]}</div>
              </div>
              {data.scoreboard.map((row) => (
                <div
                  key={row.metric}
                  className="grid grid-cols-3 px-5 py-3.5 border-b border-white/5 last:border-0"
                >
                  <div className="text-sm text-white/70">{row.metric}</div>
                  <div className="font-mono font-bold text-white/50 text-sm">
                    {row.you}
                  </div>
                  <div className="font-mono font-bold text-cyan-400 text-sm">
                    {row.competitor}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="font-display font-black text-3xl mb-3">
            What We Service
          </h3>
          <p className="text-white/50 mb-8">
            Specializing in Japanese &amp; Korean vehicles — now with AI-powered diagnostics
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Honda", "Acura", "Subaru", "Toyota", "Lexus", "Scion",
              "Nissan", "Mazda", "Prius", "Infiniti", "Hyundai", "Kia", "Hybrids",
            ].map((make) => (
              <span
                key={make}
                className="px-4 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-sm text-white/70"
              >
                {make}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* AI-Powered Specials */}
      <section className="py-16 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="font-display font-black text-3xl text-center mb-10">
            AI-Powered Specials
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl bg-gradient-to-br from-cyan-950/50 to-transparent border border-cyan-500/20 p-6">
              <p className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
                The
              </p>
              <p className="text-cyan-400 font-display font-black text-2xl mb-3">
                Instant Quote
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                Get a model-specific service estimate in under 4 minutes.
                Subaru CVT, Toyota timing belt, Lexus 90k — our AI knows your car.
              </p>
              <span className="inline-block mt-4 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm font-bold cursor-default">
                Get Quote Now
              </span>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-cyan-950/50 to-transparent border border-cyan-500/20 p-6">
              <p className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
                The
              </p>
              <p className="text-cyan-400 font-display font-black text-2xl mb-3">
                First Timer Special
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                New customer? Our AI detects first-time visitors and sends you
                the New Customer Special with a Calendly link — automatically.
              </p>
              <span className="inline-block mt-4 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm font-bold cursor-default">
                Redeem Now
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pop Recommendation */}
      {data.pop_recommendation && (
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-6">
            <div className="rounded-2xl bg-brand-500/10 border border-brand-500/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center font-display font-black text-sm">
                  P
                </div>
                <span className="text-brand-500 font-bold uppercase tracking-wider text-xs">
                  Message from Pop — your AI Co-founder
                </span>
              </div>
              <p className="text-xl text-white/90 leading-relaxed">
                {data.pop_recommendation}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-transparent to-[#0b0b0e]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h3 className="font-display font-black text-3xl md:text-4xl mb-4">
            This doesn&apos;t have to be your competitor.
          </h3>
          <p className="text-white/60 text-lg mb-8 max-w-lg mx-auto">
            Everything {competitorName} did this week, Pop can do for {businessName} — starting now. Same voice, same heart, zero ops burden.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-8 py-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-lg transition-colors"
          >
            Go to my Pop dashboard &rarr;
          </Link>
          <div className="mt-6">
            <Link
              href="/"
              className="text-sm text-white/40 hover:text-white/60 transition-colors"
            >
              &larr; Try another business
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 bg-[#0b0b0e]">
        <div className="max-w-4xl mx-auto px-6 text-center text-xs text-white/30">
          <p>
            This is a simulated competitor website generated by{" "}
            <Link href="/" className="text-brand-500 hover:underline">
              Pop AI
            </Link>
            . No real business named &ldquo;{competitorName}&rdquo; exists.
          </p>
          <p className="mt-2">
            Pop &mdash; AI Co-founder for Mom &amp; Pop shops
          </p>
        </div>
      </footer>
    </div>
  );
}
