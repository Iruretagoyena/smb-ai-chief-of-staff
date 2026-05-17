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
    <div className="min-h-screen bg-white text-gray-900">
      {/* Pop Banner */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2.5 flex items-center justify-between text-white">
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

      {/* ═══ HEADER — mirrors Pat's Garage top bar ═══ */}
      <header className="bg-[#1a1a1a] text-white">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo + name */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shrink-0">
              <span className="text-3xl font-black font-display leading-none">PP</span>
            </div>
            <div>
              <h1 className="font-display font-black text-2xl md:text-3xl leading-tight">
                {competitorName}
              </h1>
              <p className="text-white/60 text-sm mt-0.5">
                {data.location || "San Francisco"}&apos;s AI-Powered Auto Repair
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-yellow-400 text-sm">★★★★★</span>
                <span className="text-white/50 text-xs italic underline">
                  1,728 Reviews
                </span>
              </div>
            </div>
          </div>
          {/* Contact info */}
          <div className="text-right text-sm space-y-0.5">
            <div>
              <span className="text-white/50">Call Us: </span>
              <span className="text-cyan-400 font-bold text-lg">(415) 555-0187</span>
            </div>
            <div className="text-white/50">Open 24/7 &mdash; AI never sleeps</div>
            <div className="text-white/50">No lunch closure. No missed calls.</div>
          </div>
        </div>

        {/* Nav — mirrors Pat's: Home · About Us · Services · Special Deals · Make an Appointment · Get Directions */}
        <nav className="bg-[#2a5a2a] border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6 flex items-center gap-1 overflow-x-auto">
            {[
              "Home",
              "About Us",
              "Services & Advice",
              "Special Deals",
              "Make an Appointment",
              "Get Directions",
            ].map((item, i) => (
              <span
                key={item}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap cursor-default ${
                  i === 0
                    ? "text-white bg-white/10"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                } transition-colors`}
              >
                {item}
              </span>
            ))}
          </div>
        </nav>
      </header>

      {/* ═══ WELCOME SECTION — mirrors Pat's hero ═══ */}
      <section className="py-12 text-center border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-green-700 text-2xl md:text-3xl font-bold">
            Welcome to {competitorName}
          </h2>
          <h3 className="text-gray-800 font-black text-lg md:text-xl mt-2 uppercase tracking-wide">
            {data.location || "San Francisco"}&apos;s AI-Native Japanese &amp; Korean Vehicle Specialty Shop
          </h3>
          <p className="text-gray-600 mt-6 max-w-3xl mx-auto leading-relaxed">
            Located in San Francisco&apos;s Dogpatch neighborhood, {competitorName} is
            dedicated to providing the best service and advice for Honda and Acura,
            Subaru, Toyota, Lexus and Scion, Nissan, Mazda, Prius, Infiniti, Hyundai,
            Kia and Hybrids. We&apos;ve been operational since week one, and besides cultivating
            an obsession for the technical aspects of our work, we believe in the power of
            AI-driven operations, instant response times, and never missing a single call.
          </p>

          {/* Hero image placeholder — grey box mimicking the Pat's team photo area */}
          <div className="mt-8 mx-auto max-w-2xl h-64 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">🤖🔧</div>
              <p className="text-sm font-medium">AI-powered service bay &mdash; 24/7 operations</p>
              <p className="text-xs text-gray-400 mt-1">24 Month / 24,000 Mile Warranty</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SPECIAL DEALS — mirrors Pat's "First Timer" + "Web Special" cards ═══ */}
      <section className="py-12 bg-gray-50 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          {/* First Timer — mirrors Pat's "The First Timer Service" */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
            <p className="text-gray-400 text-sm italic">The</p>
            <p className="text-green-700 font-display font-black text-2xl mt-1">
              AI First Timer Service
            </p>
            <p className="text-gray-600 text-sm mt-3">
              <span className="font-bold">$135 for 4 Cylinder</span> and{" "}
              <span className="font-bold">$145 for 6/8 Cylinder</span> vehicles
              your first time with us! *
            </p>
            <p className="text-gray-500 text-sm mt-3 leading-relaxed">
              For your first time to {competitorName}, our AI auto-detects
              first-time visitors from quote requests and sends you the New
              Customer Special with a Calendly link &mdash; automatically,
              within 4 minutes of your first inquiry.
            </p>
            <span className="inline-block mt-4 px-6 py-2 rounded bg-green-700 text-white text-sm font-bold cursor-default">
              Redeem Now
            </span>
          </div>

          {/* Web Special — mirrors Pat's "The Web Special" */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
            <p className="text-gray-400 text-sm italic">The</p>
            <p className="text-green-700 font-display font-black text-2xl mt-1">
              Instant Quote Special
            </p>
            <p className="text-gray-600 text-sm mt-3">
              <span className="font-bold">$175.00 for 4 Cylinder</span> and{" "}
              <span className="font-bold">$185.00 for 6/8 Cylinder</span> vehicles
              Minor Service *
            </p>
            <p className="text-gray-500 text-sm mt-3 leading-relaxed">
              Get a model-specific estimate in under 4 minutes &mdash; Subaru CVT,
              Toyota timing belt, Lexus 90k service. Our AI knows your car and
              responds before Pat&apos;s even returns the call.
            </p>
            <span className="inline-block mt-4 px-6 py-2 rounded bg-green-700 text-white text-sm font-bold cursor-default">
              Redeem Now
            </span>
          </div>
        </div>
      </section>

      {/* ═══ WEEK ONE RESULTS — new section that Pat's doesn't have (the AI edge) ═══ */}
      {data.week_one_actions && data.week_one_actions.length > 0 && (
        <section className="py-14 border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-10">
              <h3 className="text-green-700 text-2xl md:text-3xl font-bold">
                Our Launch Week Results
              </h3>
              <p className="text-gray-500 mt-2">
                Here&apos;s what {competitorName} accomplished in its first 7 days.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {data.week_one_actions.map((a, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">
                      {CATEGORY_ICONS[a.category] || "⚡"}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-green-700">
                      {a.category}
                    </span>
                  </div>
                  <p className="text-gray-800 text-sm leading-relaxed">{a.action}</p>
                  <p className="text-gray-400 text-xs mt-2">{a.impact}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ SCOREBOARD — How We Compare ═══ */}
      {data.scoreboard && data.scoreboard.length > 0 && (
        <section className="py-14 bg-gray-50 border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-10">
              <h3 className="text-green-700 text-2xl md:text-3xl font-bold">
                How We Compare
              </h3>
              <p className="text-gray-500 mt-2">
                {competitorName} vs {businessName} &mdash; week one numbers
              </p>
            </div>
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
              <div className="grid grid-cols-3 text-xs uppercase tracking-wider px-5 py-3 border-b border-gray-100 bg-gray-50 font-bold">
                <div className="text-gray-400">Metric</div>
                <div className="text-gray-500">{businessName}</div>
                <div className="text-green-700">{competitorName.split(" ")[0]}</div>
              </div>
              {data.scoreboard.map((row) => (
                <div
                  key={row.metric}
                  className="grid grid-cols-3 px-5 py-3.5 border-b border-gray-100 last:border-0"
                >
                  <div className="text-sm text-gray-600">{row.metric}</div>
                  <div className="font-mono font-bold text-gray-400 text-sm">{row.you}</div>
                  <div className="font-mono font-bold text-green-700 text-sm">{row.competitor}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ SERVICES — mirrors Pat's vehicle list ═══ */}
      <section className="py-14 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-green-700 text-2xl md:text-3xl font-bold mb-2">
            What We Service
          </h3>
          <p className="text-gray-500 mb-8">
            Specializing in Japanese &amp; Korean vehicles &mdash; now with AI-powered diagnostics
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Honda", "Acura", "Subaru", "Toyota", "Lexus", "Scion",
              "Nissan", "Mazda", "Prius", "Infiniti", "Hyundai", "Kia",
              "Hybrids", "Tesla EV",
            ].map((make) => (
              <span
                key={make}
                className="px-4 py-2 rounded-lg bg-gray-100 border border-gray-200 text-sm text-gray-700 font-medium"
              >
                {make}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMMUNITY — mirrors Pat's referral program + car care class + awards ═══ */}
      <section className="py-14 bg-gray-50 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Referral */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h4 className="font-bold text-gray-800 mb-2">Referral Program</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Our AI identifies your happiest customers from 5-star reviews
                and automatically sends referral rewards &mdash; gift cards from
                favorite local Dogpatch businesses.
              </p>
            </div>
            {/* Car Care */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h4 className="font-bold text-gray-800 mb-2">AI Car Care Class</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Started over 15 years ago as a Women&apos;s Car Care Class at Pat&apos;s,
                now available 24/7 via AI chat. Ask any maintenance question and
                get a mechanic-grade answer instantly.
              </p>
            </div>
            {/* EV */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h4 className="font-bold text-gray-800 mb-2">EV Specialists</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Annual inspection for your Japanese, Korean, or Tesla EV.
                AI-scheduled appointments, instant diagnostics, and
                model-specific service protocols.
              </p>
            </div>
          </div>

          {/* Awards bar — mirrors Pat's Guardian awards */}
          <div className="mt-10 text-center">
            <p className="text-gray-400 text-sm">
              Modeled after the Bay Guardian&apos;s &ldquo;Best Car Mechanic&rdquo; of the SF Bay Area
              winner &mdash; 2005&ndash;2023
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {["ASE", "ASCCA", "Car Care Aware", "Green Business", "Top Shop", "Top Rated"].map(
                (badge) => (
                  <span
                    key={badge}
                    className="px-3 py-1.5 rounded bg-gray-100 border border-gray-200 text-xs text-gray-500 font-medium"
                  >
                    {badge}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ POP RECOMMENDATION ═══ */}
      {data.pop_recommendation && (
        <section className="py-14 bg-[#0b0b0e] text-white">
          <div className="max-w-3xl mx-auto px-6">
            <div className="rounded-2xl bg-brand-500/10 border border-brand-500/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center font-display font-black text-sm">
                  P
                </div>
                <span className="text-brand-500 font-bold uppercase tracking-wider text-xs">
                  Message from Pop &mdash; your AI Co-founder
                </span>
              </div>
              <p className="text-xl text-white/90 leading-relaxed">
                {data.pop_recommendation}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ═══ CTA ═══ */}
      <section className="py-20 bg-[#0b0b0e] text-white">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h3 className="font-display font-black text-3xl md:text-4xl mb-4">
            This doesn&apos;t have to be your competitor.
          </h3>
          <p className="text-white/60 text-lg mb-8 max-w-lg mx-auto">
            Everything {competitorName} did this week, Pop can do for{" "}
            {businessName} &mdash; starting now. Same voice, same heart, zero ops burden.
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

      {/* ═══ FOOTER — mirrors Pat's footer structure ═══ */}
      <footer className="bg-[#1a1a1a] text-white py-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div>
              <h4 className="font-display font-black text-lg">{competitorName}</h4>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-yellow-400 text-sm">★★★★★</span>
                <span className="text-white/50 text-xs">
                  4.9 star rating based on 1,728 reviews
                </span>
              </div>
            </div>
            <div className="text-sm text-white/50 space-y-1">
              <div>
                <span className="text-white/30">Call Us: </span>(415) 555-0187
              </div>
              <div>
                <span className="text-white/30">Address: </span>1090 26th Street,
                San Francisco, CA 94107
              </div>
              <div>
                <span className="text-white/30">Work Hours: </span>24/7 &mdash; AI
                never sleeps
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-white/30">
            <p>
              This is a simulated competitor website generated by{" "}
              <Link href="/" className="text-brand-500 hover:underline">
                Pop AI
              </Link>
              . No real business named &ldquo;{competitorName}&rdquo; exists.
            </p>
            <p className="mt-1">
              Pop &mdash; AI Co-founder for Mom &amp; Pop shops
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
